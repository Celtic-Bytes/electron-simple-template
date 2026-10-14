import { describe, it, expect, vi } from 'vitest';

vi.mock('electron', () => {
  const mockApp = {
    on: vi.fn(),
    quit: vi.fn(),
    whenReady: vi.fn(() => Promise.resolve()),
  };
  const BrowserWindowMock = Object.assign(function BrowserWindow() {
    return {
      webContents: {
        on: vi.fn(),
        send: vi.fn(),
        openDevTools: vi.fn(),
      },
      loadFile: vi.fn(),
      loadURL: vi.fn(),
    };
  });
  return {
    app: mockApp,
    BrowserWindow: vi.fn(BrowserWindowMock),
  };
});

// main.ts registers its handlers as import-time side effects. Vitest 5
// clears mock call history before every test (clearMocks default), so each
// test re-imports the module to capture a fresh evaluation.
async function loadMainModule() {
  vi.resetModules();
  await import('./main.ts');
  return import('electron');
}

describe('main process startup', () => {
  it('registers window-all-closed handler on app', async () => {
    const { app } = await loadMainModule();
    expect(app.on).toHaveBeenCalledWith(
      'window-all-closed',
      expect.any(Function)
    );
  });

  it('registers activate handler on app', async () => {
    const { app } = await loadMainModule();
    expect(app.on).toHaveBeenCalledWith('activate', expect.any(Function));
  });

  it('calls app.whenReady to schedule startup', async () => {
    const { app } = await loadMainModule();
    expect(app.whenReady).toHaveBeenCalledTimes(1);
  });

  it('creates the window with the CJS preload (sandboxed preloads only support CommonJS)', async () => {
    const { BrowserWindow } = await loadMainModule();
    const bw = vi.mocked(BrowserWindow);
    await vi.waitFor(() => expect(bw).toHaveBeenCalledTimes(1));

    // Non-null: the assertion above guarantees the constructor was called once.
    const options = bw.mock.calls[0]![0]!;
    expect(options.webPreferences?.preload).toMatch(/preload\.cjs$/);
  });

  it('creates the window with the secure defaults', async () => {
    const { BrowserWindow } = await loadMainModule();
    const bw = vi.mocked(BrowserWindow);
    await vi.waitFor(() => expect(bw).toHaveBeenCalledTimes(1));

    const options = bw.mock.calls[0]![0]!;
    expect(options.webPreferences?.nodeIntegration).toBe(false);
    expect(options.webPreferences?.contextIsolation).toBe(true);
    expect(options.webPreferences?.webSecurity).toBe(true);
  });
});
