const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

function createWindow() {
  const iconPath = path.join(__dirname, 'frontend', 'public', 'icon.png');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: { nodeIntegration: false }
  });
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
