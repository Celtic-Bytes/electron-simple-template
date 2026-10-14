import { describe, it, expect, vi } from 'vitest';

vi.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: vi.fn() },
  ipcRenderer: { on: vi.fn(), off: vi.fn() },
}));

// preload.ts exposes its API at import time (contextBridge side effect).
// Re-import the module per test to capture a fresh evaluation.
async function loadPreloadModule() {
  vi.resetModules();
  await import('./preload.ts');
  return import('electron');
}

describe('preload context bridge', () => {
  it('exposes a minimal typed API under the "api" key', async () => {
    const { contextBridge } = await loadPreloadModule();
    const exposeMock = vi.mocked(contextBridge.exposeInMainWorld);

    expect(exposeMock).toHaveBeenCalledTimes(1);
    const [key, api] = exposeMock.mock.calls[0];
    expect(key).toBe('api');
    expect(api).toEqual(
      expect.objectContaining({
        system: expect.objectContaining({
          onMainProcessMessage: expect.any(Function),
        }),
      })
    );
  });

  it('onMainProcessMessage subscribes to the main-process-message channel', async () => {
    const { contextBridge, ipcRenderer } = await loadPreloadModule();
    const api = vi.mocked(contextBridge.exposeInMainWorld).mock.calls[0][1];

    api.system.onMainProcessMessage(vi.fn());

    expect(vi.mocked(ipcRenderer.on)).toHaveBeenCalledWith(
      'main-process-message',
      expect.any(Function)
    );
  });

  it('onMainProcessMessage forwards only the payload to the listener (no ipc event)', async () => {
    const { contextBridge, ipcRenderer } = await loadPreloadModule();
    const api = vi.mocked(contextBridge.exposeInMainWorld).mock.calls[0][1];

    const listener = vi.fn();
    api.system.onMainProcessMessage(listener);

    const wrapped = vi.mocked(ipcRenderer.on).mock.calls[0][1] as (
      event: unknown,
      ...args: unknown[]
    ) => void;
    wrapped({ fakeEvent: true }, 'hello');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('hello');
  });

  it('onMainProcessMessage returns an unsubscribe that removes the listener', async () => {
    const { contextBridge, ipcRenderer } = await loadPreloadModule();
    const api = vi.mocked(contextBridge.exposeInMainWorld).mock.calls[0][1];

    const listener = vi.fn();
    const unsubscribe = api.system.onMainProcessMessage(listener);

    unsubscribe();

    expect(vi.mocked(ipcRenderer.off)).toHaveBeenCalledWith(
      'main-process-message',
      expect.any(Function)
    );
  });
});
