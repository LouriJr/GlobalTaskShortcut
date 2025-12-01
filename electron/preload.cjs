// Preload script para comunicação segura entre Electron e React (CommonJS)

const { contextBridge, ipcRenderer } = require('electron');

// Expor uma API segura para o renderer
contextBridge.exposeInMainWorld('electronAPI', {
    hideWindow: () => {
        ipcRenderer.send('hide-window');
    },
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload CJS carregado');
});


