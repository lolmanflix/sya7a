/**
 * @file preload.cjs
 * @description Secure context bridge exposing desktop IPC helpers to the Wasalt Admin renderer.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wasaltDesktop', {
  platform: process.platform,
  version: '1.0.0',
  isDesktop: true,

  /**
   * Dispatches a native desktop notification.
   * @param {string} title - Notification title.
   * @param {string} body - Notification body text.
   */
  sendNotification: (title, body) => {
    ipcRenderer.send('desktop-notification', { title, body });
  },

  /**
   * Opens an external link safely in the user's default OS browser.
   * @param {string} url - Web URL to open.
   */
  openExternal: (url) => {
    ipcRenderer.send('desktop-open-external', url);
  },

  /**
   * Minimizes the main application window.
   */
  minimizeWindow: () => {
    ipcRenderer.send('window-minimize');
  },

  /**
   * Toggles maximization of the main application window.
   */
  maximizeWindow: () => {
    ipcRenderer.send('window-maximize');
  },

  /**
   * Closes the application window.
   */
  closeWindow: () => {
    ipcRenderer.send('window-close');
  },

  /**
   * Subscribes to window maximize/restore state events.
   * @param {Function} callback - State change callback.
   * @returns {Function} Unsubscribe handler.
   */
  onWindowStateChange: (callback) => {
    const handler = (_event, state) => callback(state);
    ipcRenderer.on('window-state-changed', handler);
    return () => ipcRenderer.removeListener('window-state-changed', handler);
  },
});
