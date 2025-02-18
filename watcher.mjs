/*
 * This file will watch if any file in the 'src' directory change and will execute automatically
 * the esbuild build in dev mode.
 */

import chokidar from 'chokidar';
import { exec, spawn } from 'node:child_process';
import os from 'node:os';
import process from 'node:process';

// *********************** CLI ARGUMENTS HANDLING ******************************

const allowedArgs = {
  electron: false,
};

/**
 *
 * @type {import( 'child_process').ChildProcess}
 */
let electronProcess = null;

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

/**  flag --electron */
const isElectron = allowedArgs.electron;

if (isElectron)
  console.log('\x1b[34mWatcher: restart Electron activated\x1b[0m');

// ************************* END OF CLI ARGUMENTS HANDLING ************************

function build() {
  return new Promise((resolve, reject) => {
    spawn('node', ['esbuild.config.mjs', '--dev'], {
      stdio: 'inherit', // Attach the Electron app's logs to this terminal
      shell: true, // Use shell to ensure cross-platform compatibility
    })
      .on('close', (code) => {
        if (code === 0) {
          resolve(); // Notify that the build is complete
        } else {
          console.log(
            `\x1b[34mBUILD process finished with code \x1b[0m${code}\x1b[0m`
          );
          reject(
            new Error(
              `\x1b[34mBuild process exited with code \x1b[0m${code}\x1b[0m`
            )
          );
        }
      })
      .on('error', (err) => {
        console.log(`\x1b[34mBuild process error:\x1b[0m'${err}\x1b[0m`);
        reject(err);
      });
  });
}

function electronStart() {
  // electronProcess = spawn("npm", ["run", "start"], {
  electronProcess = spawn('electron', ['dist/main.cjs'], {
    stdio: 'inherit', // Attach the Electron app's logs to this terminal
    shell: true, // Use shell to ensure cross-platform compatibility
  })
    .on('close', (code) => {
      if (code !== null) {
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
    electronProcess.kill('SIGTERM');
  }

  getElectronProcesses()
    .then((processes) => {
      processes.forEach((pro) => {
        try {
          process.kill(pro.pid);
        } catch (err) {
          console.log(
            `\x1b[31mUnable to kill electron process with pid: ${pro.pid}. Error: \x1b[0m${err}\x1b[0m`
          );
        }
      });
    })
    .catch((err) =>
      console.log(`\x1b[31mError restaring Electron: \x1b[0m${err}\x1b[0m`)
    )
    .finally(async () => {
      electronStart();
    });
}

function watch() {
  const folder = './src';
  if (isElectron) {
    electronStart();
  }

  chokidar
    .watch(folder, {
      awaitWriteFinish: { pollInterval: 100, stabilityThreshold: 2000 },
      ignoreInitial: true,
    })
    .on('change', async (args, stats) => {
      if (args) {
        await build();
        if (isElectron) electronRestart();
      }
    })
    .on('error', (err) =>
      console.log(`\x1b[31mWatcher error: \x1b[0m${err}\x1b[0m`)
    );

  console.log(
    `\x1b[34mWatching changes in '\x1b[0m${folder}\x1b[34m' folder\x1b[0m`
  );
}

function getElectronProcesses() {
  return new Promise((resolve, reject) => {
    const platform = os.platform();

    // Use platform-appropriate command for process listing
    const cmd =
      platform === 'win32'
        ? 'tasklist' // Windows command
        : 'ps -A -o pid,comm'; // Linux/macOS command

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      // Parse the output
      const electronProcesses = stdout
        .split('\n')
        .filter((line) => line.toLowerCase().includes('electron')) // Filter for Electron processes
        .map((line) => {
          const parts = line.trim().split(/\s+/);
          if (platform === 'win32') {
            // On Windows, the first segment is the name and the last is the PID
            const name = parts[0];
            const pid = parseInt(parts[1], 10);
            return { pid, name };
          } else {
            throw new Error('Pending to implement for Mac and Linux');
          }
        });

      resolve(electronProcesses);
    });
  });
}

watch();
