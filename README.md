# Global Task Shortcut

Aplicação desktop simples criada com React e Electron que fica escutando um atalho global do Windows. Quando o atalho é pressionado, uma janela React é aberta/fechada.

## 🚀 Funcionalidades

- ✅ Atalho global do Windows (Ctrl+Shift+T)
- ✅ Janela sempre no topo quando visível
- ✅ Interface React moderna e responsiva
- ✅ Abre/fecha com o atalho global

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

## 🛠️ Desenvolvimento

Para rodar em modo de desenvolvimento:

```bash
npm run electron:dev
```

Isso irá:
- Iniciar o servidor Vite (React)
- Aguardar o servidor estar pronto
- Iniciar o Electron

## 🏗️ Build

Para criar um executável:

```bash
npm run build:electron
```

## ⌨️ Atalho Global

O atalho padrão é **Ctrl+Shift+T**. Você pode alterar isso editando o arquivo `electron/main.js` na função `registerGlobalShortcut()`.

## 📝 Estrutura do Projeto

```
.
├── electron/
│   ├── main.js       # Processo principal do Electron
│   └── preload.js    # Script de preload
├── src/
│   ├── App.jsx       # Componente principal React
│   ├── App.css       # Estilos do App
│   ├── main.jsx      # Ponto de entrada React
│   └── index.css     # Estilos globais
├── index.html        # HTML principal
├── vite.config.js    # Configuração do Vite
└── package.json      # Dependências e scripts
```

## 🔧 Personalização

### Alterar o Atalho Global

Edite `electron/main.js` e modifique a linha:

```javascript
const ret = globalShortcut.register('CommandOrControl+Shift+T', () => {
```

Para outros atalhos, use a sintaxe do Electron:
- `CommandOrControl` = Ctrl no Windows/Linux, Cmd no Mac
- `Alt`
- `Shift`
- Teclas: `A-Z`, `0-9`, `F1-F24`, etc.

Exemplo: `'Alt+Shift+G'` ou `'CommandOrControl+Alt+K'`

### Modificar a Interface

Edite os arquivos em `src/` para personalizar a interface React.

## 📄 Licença

MIT

