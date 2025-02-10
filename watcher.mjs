/**
 * This file will watch if any file in the 'src' directory change and will execute automatically
 * the esbuild build and will launch electron on the bundled files.
 */

import { spawn } from "node:child_process";
import fs from "node:fs";

/**
 * @type {import( 'child_process').ChildProcess}
 */
let electronProcess = null;
let folderWatcher = null;
let buildProcess = null;
let debounceTimer = null;

function startElectron() {
    console.log("Starting Electron...");

    buildProcess = spawn("node", ["esbuild.config.mjs --dev"], {
        stdio: "inherit", // Attach the Electron app's logs to this terminal
        shell: true // Use shell to ensure cross-platform compatibility
    });

    buildProcess.on("close", (code) => {
        if (code !== null) {
            console.log(`BUILD process finished with code ${code}`);
        }
    });

    // electronProcess = spawn("npm", ["run", "start"], {
    electronProcess = spawn("electron", ["dist/main.cjs"], {
        stdio: "inherit", // Attach the Electron app's logs to this terminal
        shell: true // Use shell to ensure cross-platform compatibility
    });

    electronProcess.on("close", (code) => {
        if (code !== null) {
            console.log(`ELECTRON process exited with code ${code}`);
        }
    });
}

function stopElectron() {
    if (electronProcess) {
        console.log("Stopping Electron...");
        // electronProcess.kill();
        electronProcess.kill("SIGTERM");
        // process.kill(electronProcess.pid);
        electronProcess = null;
    }
}

function restartElectron() {
    stopElectron();
    startElectron();
}

function watchFolder() {
    console.log("Watching folder for changes...");

    folderWatcher = fs.watch(
        "src",
        { recursive: true },
        (eventType, filename) => {
            if (filename) {
                // File events may fire multiple times in quick succession due to quirks in the fs.watch
                // implementation and the underlying file system. Thats why debounce is needed.
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    console.log(`Debounced restart triggered for ${filename}`);
                    restartElectron();
                }, 2000);
            }
        }
    );
}

// Function to ensure the folder exists and watch it
function ensureFolderExistsAndWatch() {
    watchFolder();
    startElectron();
}

// Ensure the  folder exists and start watching it
ensureFolderExistsAndWatch();
