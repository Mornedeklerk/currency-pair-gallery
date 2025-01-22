import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, args: any) => ipcRenderer.invoke(channel, args)
  }
});

// Add TypeScript declarations
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, args: any): Promise<any>;
      };
    };
  }
}