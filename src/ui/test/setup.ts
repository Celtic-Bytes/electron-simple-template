import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock the typed API exposed by the preload script (window.api).
// Keep this in sync with types/ipc.types.ts (RendererApi).
Object.defineProperty(window, 'api', {
  value: {
    system: {
      onMainProcessMessage: vi.fn(() => vi.fn()),
    },
  },
  writable: true,
  configurable: true,
});
