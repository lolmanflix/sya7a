/**
 * @file electron.d.ts
 * @description Type definitions for Wasalt Electron desktop context bridge.
 */

export interface WasaltDesktopAPI {
  platform: NodeJS.Platform;
  version: string;
  isDesktop: boolean;
  sendNotification: (title: string, body?: string) => void;
  openExternal: (url: string) => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  onWindowStateChange: (callback: (state: { isMaximized: boolean }) => void) => () => void;
}

declare global {
  interface Window {
    wasaltDesktop?: WasaltDesktopAPI;
  }
}
