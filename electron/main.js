import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { loadConfig, saveConfig } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow = null;
const isDev = !app.isPackaged;
let config = loadConfig();
let currentKanban = null; // Kanban atual selecionado pelo atalho

function createWindow() {
    config = loadConfig();
    mainWindow = new BrowserWindow({
        width: config.window.width,
        height: config.window.height,
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

ipcMain.handle('get-config', () => {
    config = loadConfig();
    return config;
});

ipcMain.handle('save-config', (event, newConfig) => {
    const success = saveConfig(newConfig);
    if (success) {
        config = loadConfig();
        registerGlobalShortcut();
    }
    return success;
});

function readFileContent() {
    try {
        config = loadConfig();
        const filePath = config.fileLocation;
        
        if (!filePath || filePath.trim() === '') {
            console.log('Nenhum arquivo configurado em fileLocation');
            return null;
        }
        
        if (!existsSync(filePath)) {
            console.error('Arquivo não encontrado:', filePath);
            return null;
        }
        
        const content = readFileSync(filePath, 'utf8');
        return content;
    } catch (error) {
        console.error('Erro ao ler arquivo:', error);
        return null;
    }
}

ipcMain.handle('read-file', () => {
    return readFileContent();
});

function insertLineInFile(lineNumber, newLine) {
    try {
        config = loadConfig();

        // Se houver um kanban selecionado, usamos o arquivo dele.
        // Caso contrário, usamos o fileLocation "global" (modo antigo).
        const filePath = (currentKanban && currentKanban.fileLocation) || config.fileLocation;
        
        if (!filePath || filePath.trim() === '') {
            console.error('Nenhum arquivo configurado em fileLocation');
            return { success: false, error: 'Nenhum arquivo configurado' };
        }
        
        if (!existsSync(filePath)) {
            console.error('Arquivo não encontrado:', filePath);
            return { success: false, error: 'Arquivo não encontrado' };
        }
        
        const content = readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        if (lineNumber < 0 || lineNumber > lines.length) {
            console.error('Número de linha inválido:', lineNumber);
            return { success: false, error: 'Número de linha inválido' };
        }
        
        lines.splice(lineNumber, 0, newLine);
        const newContent = lines.join('\n');
        
        writeFileSync(filePath, newContent, 'utf8');
        
        return { success: true };
    } catch (error) {
        console.error('Erro ao inserir linha no arquivo:', error);
        return { success: false, error: error.message };
    }
}

ipcMain.handle('insert-line', (event, lineNumber, newLine) => {
    return insertLineInFile(lineNumber, newLine);
});

function registerGlobalShortcut() {
    globalShortcut.unregisterAll();
    config = loadConfig();

    let anyRegistered = false;

    // Novo modo: vários kanbans, cada um com seu próprio atalho
    if (Array.isArray(config.kanbanLists) && config.kanbanLists.length > 0) {
        config.kanbanLists.forEach((kanban) => {
            if (!kanban.shortcut || !kanban.fileLocation) {
                return;
            }

            const ret = globalShortcut.register(kanban.shortcut, () => {
                currentKanban = kanban;

                if (!mainWindow) {
                    createWindow();
                }

                if (mainWindow.isVisible()) {
                    // Se já está visível e o usuário chamar o mesmo atalho,
                    // mantemos a lógica de alternar visibilidade.
                    if (mainWindow.isFocused()) {
                        mainWindow.hide();
                        return;
                    }
                }

                mainWindow.show();
                mainWindow.focus();

                const sendFileContent = () => {
                    const fileContent = readFileContent();
                    if (fileContent !== null) {
                        mainWindow.webContents.send('file-content-loaded', fileContent);
                    }
                };

                if (mainWindow.webContents.isLoading()) {
                    mainWindow.webContents.once('did-finish-load', sendFileContent);
                } else {
                    setTimeout(sendFileContent, 100);
                }
            });

            if (!ret) {
                console.log(`Falha ao registrar o atalho global para kanban "${kanban.name}" (${kanban.shortcut})`);
            } else {
                anyRegistered = true;
                console.log(`Atalho global registrado para kanban "${kanban.name}": ${kanban.shortcut}`);
            }
        });
    }

    // Modo antigo (fallback): um único atalho "global" e um único fileLocation
    if (!anyRegistered && config.shortcut) {
        const ret = globalShortcut.register(config.shortcut, () => {
            currentKanban = null; // usa fileLocation global

            if (!mainWindow) {
                createWindow();
            }

            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
                mainWindow.focus();

                const sendFileContent = () => {
                    const fileContent = readFileContent();
                    if (fileContent !== null) {
                        mainWindow.webContents.send('file-content-loaded', fileContent);
                    }
                };

                if (mainWindow.webContents.isLoading()) {
                    mainWindow.webContents.once('did-finish-load', sendFileContent);
                } else {
                    setTimeout(sendFileContent, 100);
                }
            }
        });

        if (!ret) {
            console.log('Falha ao registrar o atalho global (modo único)');
        } else {
            console.log(`Atalho global registrado (modo único): ${config.shortcut}`);
        }
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

