import { describe, it, expect, vi } from 'vitest';

describe('renderer bootstrap', () => {
  it('subscribes to main process messages through window.api', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./index.tsx');

    const onMessage = vi.mocked(window.api.system.onMainProcessMessage);
    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage.mock.calls[0][0]).toBeTypeOf('function');
  });
});
