import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import url from '../assets/icon.png';

let win: BrowserWindow | null;
// To add more environment variables, update the esbuild config
const isDev =
  (process.env['NODE_ENV'] && process.env['NODE_ENV'] === 'development') ||
  false;
const isServer =
  (process.env['esbuild_server'] && process.env['esbuild_server'] === 'on') ||
  false;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, url),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      // sandbox: true may make youre preload undebuggable or not working properly.
      // check this ur: https://www.electronjs.org/docs/latest/tutorial/esm#preload-scripts
      sandbox: !isDev,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (isDev && isServer) {
    win.loadURL('http://localhost:5500');
  } else {
    win.loadFile(path.join(__dirname, 'index.html'));
  }

  if (isDev) win.webContents.openDevTools();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
});
