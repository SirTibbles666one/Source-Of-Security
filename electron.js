const { app, BrowserWindow } = require('electron');
const path = require('path');

// --- SINGLE INSTANCE LOCK ---
// This prevents multiple instances of the app from running.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Create mainWindow, load the rest of the app, etc...
  app.on('ready', createWindow);
}

let mainWindow; // Make mainWindow a global variable to access it in the second-instance event

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 940,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // The frame option is set to false to allow for a custom title bar (Window Controls Overlay)
    // This is a key part of making the app feel native
    frame: false, 
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2d3748', // Corresponds to bg-gray-800
      symbolColor: '#e2e8f0', // Corresponds to text-gray-200
      height: 40
    }
  });

  // Load the index.html of the app using a robust path.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools in development.
  // mainWindow.webContents.openDevTools();
}


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});