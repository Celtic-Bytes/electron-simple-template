/**
 * File watcher for development.
 *
 * Watches the src/ directory for changes and triggers an esbuild rebuild.
 * When the --electron flag is passed, it also restarts the Electron process
 * automatically after each successful build.
 *
 * Usage: node watcher.mjs [--electron]
 */

import chokidar from 'chokidar';
import electronPath from 'electron'; // Import the path to the electron binary directly
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
    // build uses shell: true because it invokes a global npm/node command
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
  // Use the imported path and shell: false to have full control of the process
  electronProcess = spawn(electronPath, ['dist/main.cjs'], {
    stdio: 'inherit',
    shell: false,
  })
    .on('close', (code) => {
      // Ignore the exit code if the process was killed intentionally (SIGTERM)
      if (code !== null && code !== 0 && code !== 143) {
        // 143 is usually SIGTERM
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
    // With shell: false, .kill() kills the real Electron process immediately
    try {
      // Remove listeners to avoid confusing 'exit code' logs during restart
      electronProcess.removeAllListeners('close');
      electronProcess.kill();
      electronProcess = null;
    } catch (e) {
      console.error('Error killing electron process:', e);
    }
  }

  // Start a new one
  electronStart();
}

function watch() {
  const folder = './src';

  // Initial start
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
          // Only restart if the build was successful
          await build();
          if (isElectron) electronRestart();
        } catch (error) {
          console.error(`Build failed, skipping restart: ${error}`);
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

// No need for getElectronProcesses anymore, as we manage our own child process

watch();
