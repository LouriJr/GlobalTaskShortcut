
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    hideWindow: () => {
        ipcRenderer.send('hide-window');
    },
    getConfig: () => {
        return ipcRenderer.invoke('get-config');
    },
    saveConfig: (config) => {
        return ipcRenderer.invoke('save-config', config);
    },
    readFile: () => {
        return ipcRenderer.invoke('read-file');
    },
    insertLine: (lineNumber, newLine) => {
        return ipcRenderer.invoke('insert-line', lineNumber, newLine);
    },
    onFileContentLoaded: (callback) => {
        ipcRenderer.on('file-content-loaded', (event, content) => {
            callback(content);
        });
    },
    removeFileContentListener: () => {
        ipcRenderer.removeAllListeners('file-content-loaded');
    },
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload CJS carregado');
});


