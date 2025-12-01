# Global Task Shortcut

Aplicação desktop simples criada com React e Electron que fica escutando um atalho global do Windows. Quando o atalho é pressionado, uma janela React é aberta/fechada e permite digitar rapidamente uma tarefa.

## 🚀 Funcionalidades

- ✅ Atalho global do Windows (**Ctrl+Shift+Q**)
- ✅ Janela sempre no topo quando visível
- ✅ Janela não redimensionável, sem minimizar/maximizar (somente fechar)
- ✅ Janela é escondida ao perder o foco ou após o submit, mantendo o processo rodando em background
- ✅ Interface React moderna e responsiva

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
- Iniciar o Electron apontando para o servidor

## 🏗️ Build

Para criar um executável:

```bash
npm run build:electron
```

## ⌨️ Atalho Global

O atalho padrão é **Ctrl+Shift+Q**. Você pode alterar isso editando o arquivo `electron/main.js` na função `registerGlobalShortcut()`:

```javascript
const ret = globalShortcut.register('CommandOrControl+Shift+Q', () => {
  // ...
});
```

Comportamento atual:
- Se a janela estiver oculta, o atalho mostra e foca a janela.
- Se a janela estiver visível, o atalho esconde a janela.

## 📝 Estrutura do Projeto

```
.
├── electron/
│   ├── main.js        # Processo principal do Electron
│   └── preload.cjs    # Script de preload (CommonJS) com API segura para o renderer
├── src/
│   ├── App.jsx        # Componente principal React (formulário de tarefa)
│   ├── App.css        # Estilos do App
│   ├── main.jsx       # Ponto de entrada React
│   └── index.css      # Estilos globais
├── index.html         # HTML principal
├── vite.config.js     # Configuração do Vite
└── package.json       # Dependências e scripts
```

## 🔧 Personalização

### Alterar o Atalho Global

Edite `electron/main.js` na função `registerGlobalShortcut()` e modifique a combinação de teclas:

```javascript
const ret = globalShortcut.register('CommandOrControl+Shift+Q', () => {
  // ...
});
```

Para outros atalhos, use a sintaxe do Electron:
- `CommandOrControl` = Ctrl no Windows/Linux, Cmd no Mac
- `Alt`
- `Shift`
- Teclas: `A-Z`, `0-9`, `F1-F24`, etc.

Exemplo: `'Alt+Shift+G'` ou `'CommandOrControl+Alt+K'`

### Modificar a Interface / Comportamento do Formulário

O formulário principal está em `src/App.jsx`.

Comportamento padrão:
- **Enter**: envia o formulário (submit) sem quebrar linha.
- **Shift+Enter**: quebra linha dentro do campo de texto.
- Após o submit, o texto é limpo e a janela é escondida (via `window.electronAPI.hideWindow()` exposta pelo `preload.cjs`).

Para personalizar textos, layout ou lógica, edite os arquivos em `src/`.

## 📄 Licença

MIT

