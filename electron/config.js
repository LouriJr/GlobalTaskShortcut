import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getConfigPath() {
    if (app.isPackaged) {
        return join(process.resourcesPath, 'config.json');
    } else {
        return join(__dirname, '../config.json');
    }
}

export function loadConfig() {
    try {
        const configPath = getConfigPath();
        const configData = readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Erro ao carregar configuração:', error);
        return getDefaultConfig();
    }
}

export function saveConfig(config) {
    try {
        const configPath = getConfigPath();
        writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erro ao salvar configuração:', error);
        return false;
    }
}

export function getDefaultConfig() {
    return {
        // Atalho "global" padrão (usado como fallback quando não houver kanbanLists)
        shortcut: 'CommandOrControl+Shift+Q',
        window: {
            width: 800,
            height: 600
        },
        app: {
            name: 'Global Task Shortcut',
            version: '1.0.0'
        },
        // Arquivo padrão (modo antigo, com um único kanban)
        fileLocation: '',
        // Novo formato: múltiplos kanbans, cada um com seu próprio atalho e arquivo
        kanbanLists: [
            // {
            //   name: 'Meu Kanban',
            //   shortcut: 'CommandOrControl+Shift+Q',
            //   fileLocation: 'C:\\caminho\\para\\arquivo.md'
            // }
        ]
    };
}

