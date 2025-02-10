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

console.info(
  `**** Esbuild configuration **** \n Mode: ${isDev ? 'Development' : 'Production'}`
);
if (Object.values(allowedArgs).includes(true)) {
  console.info(' Arguments:');
  Object.entries(allowedArgs).forEach(([key, value]) => {
    if (value) console.info(`     ${key} : ${value}`);
  });
}
console.info('*******************************');

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
};

// MAIN
const main = await buildOrContext({
  ...commonConfigs,
  entryPoints: ['src/electron/main.ts'],
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/main.cjs',
  external: ['electron'],
}).catch(() => process.exit(1));

// PRELOAD
const preload = await buildOrContext({
  ...commonConfigs,
  entryPoints: ['src/electron/preload.ts'],
  platform: 'node',
  format: 'esm',
  outfile: 'dist/preload.mjs',
  external: ['electron'],
}).catch(() => process.exit(1));

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

const renderer = await buildOrContext(renderConfig).catch((err) => {
  console.log('err :>> ', err);
  process.exit(1);
});

// WATCH
if (isWatch) {
  await main.watch();
  await preload.watch();
  await renderer.watch();
  console.info('Esbuild watch mode started...');
}

// SERVE
// Since Electron is designed to use the file:// protocol to load renderer files,
// it's not recomended to use the HTTP server. If you use it, you will probably have problems
// with the preload. Also the server will only work with renderer sources files.

if (isServe) {
  await renderer
    .serve({
      port: 5500,
      servedir: 'dist',
    })
    .then((result) => {
      console.info('Esbuild server started...');
      result.hosts.forEach((host) => {
        console.info(`   url: http://${host}:${result.port} `);
      });
    });
}
