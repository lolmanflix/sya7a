/**
 * @file main.cjs
 * @description Main Electron process for Wasalt Transit Operations Command Center.
 * Supports cross-platform desktop execution on Linux, Windows, and macOS.
 */
const { app, BrowserWindow, ipcMain, Notification, shell } = require('electron');
const path = require('path');
const { setupApplicationMenu } = require('./menu.cjs');

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

let mainWindow = null;

/**
 * Creates the primary application desktop window.
 */
function createMainWindow() {
  const isMac = process.platform === 'darwin';

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'Wasalt | Transit Operations Command',
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    trafficLightPosition: isMac ? { x: 16, y: 16 } : undefined,
    backgroundColor: '#090d16',
    show: false, // Prevent white flash before rendering
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  // Smoothly show window once ready to prevent visual flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Track and broadcast maximize/unmaximize state for custom UI controls
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-changed', { isMaximized: true });
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-changed', { isMaximized: false });
  });

  // Route external navigation to default operating system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Install custom native application menu
  setupApplicationMenu(mainWindow);

  // Determine whether to load live development server or production dist bundle
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL(devServerUrl).catch((err) => {
      console.warn('[Electron Main] Dev server not reachable, attempting dist fallback:', err.message);
      const distIndex = path.join(__dirname, '../dist/index.html');
      mainWindow.loadFile(distIndex).catch((fileErr) => {
        console.error('[Electron Main] Failed to load dist bundle:', fileErr);
      });
    });
  } else {
    const distIndex = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(distIndex);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.on('desktop-notification', (_event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'Wasalt Transit Alert',
      body: body || '',
      silent: false,
    }).show();
  }
});

ipcMain.on('desktop-open-external', (_event, url) => {
  if (typeof url === 'string' && (url.startsWith('http:') || url.startsWith('https:'))) {
    shell.openExternal(url);
  }
});

ipcMain.on('window-minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-maximize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
});

// App lifecycle
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
