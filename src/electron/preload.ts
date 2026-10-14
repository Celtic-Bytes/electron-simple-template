import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';
import type { RendererApi } from '../../types/ipc.types';

/**
 * Bridge between the main and renderer processes.
 *
 * Exposes a minimal, typed API on `window.api` via contextBridge.
 * The renderer must only talk to the app through this object — never
 * through Electron/Node primitives directly.
 */
function createSystemApi(): RendererApi['system'] {
  return {
    onMainProcessMessage(listener) {
      const channel = 'main-process-message';
      const wrapped = (_event: IpcRendererEvent, message: string) =>
        listener(message);
      ipcRenderer.on(channel, wrapped);
      return () => {
        ipcRenderer.off(channel, wrapped);
      };
    },
  };
}

const api: RendererApi = {
  system: createSystemApi(),
};

contextBridge.exposeInMainWorld('api', api);
