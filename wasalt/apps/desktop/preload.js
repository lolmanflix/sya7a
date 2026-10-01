const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wasaltDesktop', {
  platform: process.platform,
  version: '1.0.0',
  isDesktop: true,
  sendNotification: (title, body) => {
    ipcRenderer.send('desktop-notification', { title, body });
  },
  onWorkspaceSwitched: (callback) => {
    ipcRenderer.on('workspace-switched', (_event, value) => callback(value));
  },
});
