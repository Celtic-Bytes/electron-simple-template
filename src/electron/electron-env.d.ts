// Type augmentation for the renderer process.
// `window.api` is exposed by the preload script (see src/electron/preload.ts).
import type { RendererApi } from '../../types/ipc.types';

declare global {
  interface Window {
    /**
     * Typed API exposed from the Electron preload script.
     * Use this object for every backend interaction — never access
     * Electron/Node primitives directly from the renderer.
     */
    api: RendererApi;
  }
}

export {};
