// https://esbuild.github.io/api/#js-async
// Electron envs : https://www.electronjs.org/docs/latest/api/environment-variables

/**
 * This Esbuild configuration support watch and serve flags.
 * But due to the nature of Esbuild and Electron, their uses are not recommended.
 */

import { build, context } from 'esbuild';

// *********************** CLI ARGUMENTS HANDLING ******************************

const allowedArgs = {
  dev: false,
  serve: false,
  watch: false,
};

function parseArgs() {
  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split('=');
    const keyClean = key.replace('--', '');
    if (Object.keys(allowedArgs).includes(keyClean)) {
      // Handle flags with or without values
      allowedArgs[keyClean] = value || true;
    }
  });
}
parseArgs();

/**  flag --dev for development. Default is production */
const isDev = allowedArgs.dev;
/** flag --serve */
const isServe = allowedArgs.serve;
/** flag --watch */
const isWatch = allowedArgs.watch;

console.log(
  `\n\x1b[38;5;208m**** Esbuild: Building... *****\x1b[0m\nMode: ${
    isDev ? 'Development' : 'Production'
  }\x1b[0m`
);
if (Object.values(allowedArgs).includes(true)) {
  console.log(' Arguments:');
  Object.entries(allowedArgs).forEach(([key, value]) => {
    if (value) console.log(`     ${key} : ${value}`);
  });
}
console.log('\x1b[38;5;208m*******************************\n\x1b[0m');

// ************************* END OF CLI ARGUMENTS HANDLING ************************

const define = {
  'process.env.NODE_ENV': isDev ? "'development'" : "'production'",
};

const defineWithArgs = {
  ...define,
  'process.env.esbuild_server': isServe ? "'on'" : "'off'",
};

const buildOrContext = isWatch || isServe ? context : build;

/**
 * Common configuration options for esbuild web server.
 * @type {import('esbuild').BuildOptions}
 */
const commonConfigs = {
  bundle: true,
  sourcemap: isDev ? 'inline' : false,
  minify: !isDev,
  loader: { '.png': 'file', '.jpg': 'file', '.html': 'copy' },
  define: allowedArgs.size > 0 ? defineWithArgs : define,
  alias: {
    '@src/*': './src/*',
  },
};

// MAIN
const main = buildOrContext({
  ...commonConfigs,
  entryPoints: ['src/electron/main.ts'],
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/main.cjs',
  external: ['electron'],
});

// PRELOAD
const preload = buildOrContext({
  ...commonConfigs,
  entryPoints: ['src/electron/preload.ts'],
  platform: 'node',
  format: 'esm',
  outfile: 'dist/preload.mjs',
  external: ['electron'],
});

// RENDERER
const rendererBaseConfig = {
  ...commonConfigs,
  entryPoints: ['src/ui/index.tsx', 'src/ui/index.html'],
  platform: 'browser',
  format: 'esm',
  outdir: 'dist',
};

const renderConfigWithServerEvent = {
  ...rendererBaseConfig,
  ...{
    banner: {
      // https://esbuild.github.io/api/#live-reload
      js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
    },
  },
};

const renderConfig = isServe ? renderConfigWithServerEvent : rendererBaseConfig;

const renderer = buildOrContext(renderConfig);

// Wait for all builds or contexts for initial building
Promise.all([main, preload, renderer])
  .then(async ([mainResult, preloadResult, rendererResult]) => {
    console.log(
      '\n\x1b[38;5;208m**** Build completed successfully! ****\x1b[0m'
    );

    // WATCH MODE HANDLING
    if (isWatch) {
      if (mainResult.watch) await mainResult.watch();
      if (preloadResult.watch) await preloadResult.watch();
      if (rendererResult.watch) await rendererResult.watch();
      console.log('\n\x1b[38;5;208mEsbuild watch mode started...\x1b[0m');
    }

    // SERVE MODE HANDLING
    if (isServe) {
      if (rendererResult.serve) {
        rendererResult
          .serve({
            port: 5500,
            servedir: 'dist',
          })
          .then((result) => {
            console.log('\n\x1b[38;5;208mEsbuild server started...\x1b[0m');
            result.hosts.forEach((host) => {
              console.log(`   url: http://${host}:${result.port}`);
            });
          });
      }
    }
  })
  .catch((error) => {
    console.error('\n\x1b[31m**** Build failed: ****\x1b[0m', error);
    process.exit(1);
  });
