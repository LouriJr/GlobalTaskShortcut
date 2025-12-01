# Sistema de Configuração

Este projeto utiliza um arquivo `config.json` para configurações editáveis pós-build.

## Localização do Arquivo

- **Desenvolvimento**: `config.json` na raiz do projeto
- **Produção (após build)**: `config.json` na pasta `resources` do executável

## Estrutura do Arquivo

```json
{
  "shortcut": "CommandOrControl+Shift+Q",
  "window": {
    "width": 800,
    "height": 350
  },
  "app": {
    "name": "Global Task Shortcut",
    "version": "1.0.0"
  }
}
```

## Propriedades

### `shortcut`
Atalho global do teclado para abrir/fechar a janela.
- Formato: `CommandOrControl+Shift+Q`
- `CommandOrControl` = Ctrl no Windows/Linux, Cmd no Mac
- Exemplos: `Alt+Shift+G`, `CommandOrControl+Alt+K`

### `window`
Configurações da janela:
- `width`: Largura da janela em pixels
- `height`: Altura da janela em pixels

### `app`
Informações da aplicação:
- `name`: Nome da aplicação
- `version`: Versão da aplicação

## Como Editar

### Em Desenvolvimento
Edite diretamente o arquivo `config.json` na raiz do projeto.

### Após Build
1. Localize o arquivo `config.json` na pasta `resources` do executável
2. Edite o arquivo com qualquer editor de texto
3. Reinicie a aplicação para aplicar as mudanças

## Uso no Código

### No Electron (main.js)
```javascript
import { loadConfig, saveConfig } from './config.js';

const config = loadConfig();
// Usar config.shortcut, config.window.width, etc.
```

### No React (via IPC)
```javascript
// Ler configuração
const config = await window.electronAPI.getConfig();

// Salvar configuração
await window.electronAPI.saveConfig({
  shortcut: 'CommandOrControl+Shift+T',
  window: { width: 900, height: 400 }
});
```

## Notas

- O arquivo é recarregado automaticamente quando a aplicação inicia
- Mudanças no atalho requerem reiniciar a aplicação
- O arquivo é criado automaticamente com valores padrão se não existir

