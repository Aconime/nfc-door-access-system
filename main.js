const { app, BrowserWindow } = require('electron');

process.env.NODE_ENV = 'production';

function openAppWindow() {
  let mainWindow = new BrowserWindow({
    title: "NFC Door Access System",
    width: 800,
    height: 600,
    minWidth: 1200,
    minHeight: 960,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  mainWindow.maximize();

  mainWindow.menuBarVisible = false;
  
  mainWindow.loadFile('src/login.html');
}

app.whenReady().then(() => {
  openAppWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) openAppWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})