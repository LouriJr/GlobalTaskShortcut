import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow = null;
const isDev = !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 350,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.cjs')
        },
        frame: true,
        show: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        minimizable: false,
        maximizable: false,
        resizable: false,
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.setMenu(null);

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        const indexPath = join(__dirname, '../dist/index.html');
        if (existsSync(indexPath)) {
            mainWindow.loadFile(indexPath);
        }
    }

    mainWindow.on('blur', () => {
        mainWindow.hide();
    });

    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.on('hide-window', () => {
    if (mainWindow) mainWindow.hide();
});

function registerGlobalShortcut() {
    const ret = globalShortcut.register('CommandOrControl+Shift+Q', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
                mainWindow.focus();
            }
        }
    });

    if (!ret) {
        console.log('Falha ao registrar o atalho global');
    } else {
        console.log('Atalho global registrado: Ctrl+Shift+Q');
    }
}

app.whenReady().then(() => {
    createWindow();
    registerGlobalShortcut();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
});

