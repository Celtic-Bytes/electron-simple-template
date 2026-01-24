/*
 * This file will watch if any file in the 'src' directory change and will execute automatically
 * the esbuild build in dev mode.
 */

import chokidar from 'chokidar';
import electronPath from 'electron'; // Importamos la ruta directa al binario
import { spawn } from 'node:child_process';
import process from 'node:process';

// *********************** CLI ARGUMENTS HANDLING ******************************

const allowedArgs = {
  electron: false,
};

/**
 * @type {import( 'child_process').ChildProcess}
 */
let electronProcess = null;

function parseArgs() {
  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split('=');
    const keyClean = key.replace('--', '');
    if (Object.keys(allowedArgs).includes(keyClean)) {
      allowedArgs[keyClean] = value || true;
    }
  });
}
parseArgs();

const isElectron = allowedArgs.electron;

if (isElectron)
  console.log('\x1b[34mWatcher: restart Electron activated\x1b[0m');

// ************************* END OF CLI ARGUMENTS HANDLING ************************

function build() {
  return new Promise((resolve, reject) => {
    // build usa shell: true porque invoca un comando npm/node global
    spawn('node', ['esbuild.config.mjs', '--dev'], {
      stdio: 'inherit',
      shell: true,
    })
      .on('close', (code) => {
        if (code === 0) resolve();
        else {
          console.log(`\x1b[34mBUILD finished with code \x1b[0m${code}\x1b[0m`);
          reject(new Error(`Build exited with code ${code}`));
        }
      })
      .on('error', (err) => reject(err));
  });
}

function electronStart() {
  // Usamos el path importado y shell: false para tener control total del proceso
  electronProcess = spawn(electronPath, ['dist/main.cjs'], {
    stdio: 'inherit',
    shell: false,
  })
    .on('close', (code) => {
      // Ignoramos el código de salida si fue matado intencionalmente (SIGTERM)
      if (code !== null && code !== 0 && code !== 143) {
        // 143 es usualmente SIGTERM
        console.log(
          `\x1b[34mELECTRON process exited with code \x1b[0m${code}\x1b[0m`
        );
      }
    })
    .on('error', (err) =>
      console.log(`\x1b[31mError starting Electron: \x1b[0m${err}\x1b[0m`)
    );
}

function electronRestart() {
  console.log('\n\x1b[34m*** Restarting Electron***\n\x1b[0m');

  if (electronProcess) {
    // Al usar shell: false, .kill() mata al proceso Electron real inmediatamente
    try {
      // Eliminamos listeners para evitar logs confusos de 'exit code' durante el reinicio
      electronProcess.removeAllListeners('close');
      electronProcess.kill();
      electronProcess = null;
    } catch (e) {
      console.error('Error killing electron process:', e);
    }
  }

  // Iniciamos uno nuevo
  electronStart();
}

function watch() {
  const folder = './src';

  // Arranque inicial
  if (isElectron) {
    electronStart();
  }

  chokidar
    .watch(folder, {
      awaitWriteFinish: { pollInterval: 100, stabilityThreshold: 2000 },
      ignoreInitial: true,
    })
    .on('change', async (args) => {
      if (args) {
        try {
          // Solo reiniciamos si el build es exitoso
          await build();
          if (isElectron) electronRestart();
        } catch (error) {
          console.error('Build failed, skipping restart');
        }
      }
    })
    .on('error', (err) =>
      console.log(`\x1b[31mWatcher error: \x1b[0m${err}\x1b[0m`)
    );

  console.log(
    `\x1b[34mWatching changes in '\x1b[0m${folder}\x1b[34m' folder\x1b[0m`
  );
}

// Ya no necesitamos getElectronProcesses porque gestionamos nuestro propio hijo

watch();
