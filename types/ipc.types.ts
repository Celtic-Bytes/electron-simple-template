/**
 * Type-safe contract for every IPC channel used by the app.
 *
 * Declare a channel here BEFORE using it in main.ts or preload.ts, so both
 * sides always agree on the channel name and payload type.
 */
export interface IpcChannels {
  /**
   * Demo channel: pushed by the main process when the window finishes
   * loading. Carries a human-readable timestamp string.
   */
  'main-process-message': {
    payload: string;
  };
}

/**
 * Minimal API exposed to the renderer via `contextBridge` as `window.api`.
 *
 * Only add what the UI actually needs — keep the surface small for security.
 * The renderer must talk to the app through this object only, never through
 * Electron/Node primitives directly.
 */
export interface RendererApi {
  system: {
    /**
     * Subscribe to messages pushed on the `main-process-message` channel.
     * Returns a function that unsubscribes the listener.
     */
    onMainProcessMessage: (
      listener: (message: IpcChannels['main-process-message']['payload']) => void
    ) => () => void;
  };
}
