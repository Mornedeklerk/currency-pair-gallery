import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the app data directory if it doesn't exist
const appDataPath = path.join(app.getPath('userData'), 'CurrencyPairData');
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle saving data
ipcMain.handle('save-data', async (_, { type, data, id }) => {
  const filePath = path.join(appDataPath, `${type}_${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
  return true;
});

// Handle loading data
ipcMain.handle('load-data', async (_, { type, id }) => {
  const filePath = path.join(appDataPath, `${type}_${id}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return null;
});

// Handle saving images
ipcMain.handle('save-image', async (_, { id, imageData }) => {
  const filePath = path.join(appDataPath, `image_${id}.png`);
  fs.writeFileSync(filePath, Buffer.from(imageData));
  return true;
});

// Handle loading images
ipcMain.handle('load-images', async (_, { id }) => {
  const filePath = path.join(appDataPath, `image_${id}.png`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
});