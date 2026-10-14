import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vite plugin stubbing static asset imports (.png, .jpg, .svg) in tests.
 * esbuild's `file` loader returns the asset path as a string at build time;
 * vitest has no such loader, so tests get a stable placeholder instead.
 */
const assetExtensions = ['.png', '.jpg', '.svg'];
const assetStub = {
  name: 'asset-stub',
  resolveId(id: string) {
    if (assetExtensions.some((ext) => id.endsWith(ext))) {
      return `\0asset-stub:${id}`;
    }
    return null;
  },
  load(id: string) {
    if (id.startsWith('\0asset-stub:')) {
      return 'export default "asset-stub";';
    }
    return null;
  },
};

export default defineConfig({
  plugins: [assetStub],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'main',
          environment: 'node',
          include: ['src/electron/**/*.test.ts'],
          setupFiles: ['src/electron/test/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'renderer',
          environment: 'jsdom',
          include: ['src/ui/**/*.test.{ts,tsx}'],
          setupFiles: ['src/ui/test/setup.ts'],
        },
      },
    ],
  },
});
