# Era Uma Vez — PWA de Histórias Infantis

Este projeto consiste em um aplicativo móvel e PWA de histórias infantis curtas para a hora de dormir, desenhado para encantar as crianças e desenvolver o caráter por meio de valores morais.

O projeto está dividido em duas partes principais:
1. **`backend`**: API construída em FastAPI (Python) que serve as narrativas, metadados e arquivos de áudio (MP3).
2. **`frontend`**: Aplicativo universal desenvolvido em React Native/Expo, focado na Web (PWA) utilizando `react-native-web` e `expo-router`.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework Principal**: [Expo v54](https://expo.dev/) (React Native v0.81)
- **Roteamento**: [Expo Router v6](https://docs.expo.dev/router/introduction/) (Roteamento baseado em arquivos para Mobile & Web)
- **Renderização Web**: [React Native Web](https://necolas.github.io/react-native-web/) (Porta padrão: `3000`)
- **Estilização**: CSS-in-JS nativo (`StyleSheet`) alimentado por um sistema centralizado de design tokens (`src/theme/tokens.ts`).
- **Gerenciamento de Estado / Persistência**:
  - **Favoritos**: Salvos localmente no dispositivo via `@react-native-async-storage/async-storage` (MVP sem contas).
  - **Modo Noite**: Controle de tema escuro persistente via Context API + `AsyncStorage`.
- **Biblioteca de Ícones**: `phosphor-react-native`.

### Backend
- **Framework Web**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Servidor ASGI**: [Uvicorn](https://www.uvicorn.org/)
- **Variáveis de Ambiente**: `python-dotenv`
- **Validação de Dados**: `pydantic`
- **Banco de Dados / Armazenamento (Atual)**: Armazenamento local baseado em arquivo JSON (`backend/catalogo.json`), carregado em memória na inicialização do servidor.
- **Banco de Dados (Estrutura Futura)**: As dependências no `requirements.txt` já contam com `pymongo` e `motor` prontas para integrar com MongoDB em uma fase pós-MVP (para controle de contas, assinaturas, sincronização e histórico).

---

## 📐 Arquitetura do Sistema

```mermaid
graph TD
    subgraph Frontend (Expo Web/Mobile)
        App[Expo Router /app] --> Components[Components: StoryCard, AudioPlayer, etc.]
        Components --> Hooks[Hooks: useCatalog, useIconFonts]
        Components --> Theme[Theme Tokens: colors, fonts]
        Components --> Store[Store Contexts: nightMode, favorites]
        Hooks --> API[API Client: catalog.ts]
    end

    subgraph Backend (FastAPI)
        API --> Server[FastAPI Server: server.py]
        Server --> Catalog[catalogo.json - 130+ Histórias]
        Server --> Audio[Audio Assets - MP3 files]
    end
```

### Estrutura de Diretórios
- `/backend`: Servidor Python com FastAPI.
  - `server.py`: Arquivo principal da API contendo as rotas de catálogo, metadados e áudio.
  - `catalogo.json`: Banco de dados offline de histórias estruturadas.
  - `/audio`: Pasta contendo os arquivos `.mp3` de narrações correspondentes aos IDs das histórias.
- `/frontend`: Aplicação Expo.
  - `/app`: Estrutura de páginas e abas (`(tabs)` contendo Home, Favoritos, Universos, Valores; e sub-rotas `/historia/[id]`, `/universo`, `/valor`, `/colecao`).
  - `/src`:
    - `/api`: Conexão com o backend (`catalog.ts`).
    - `/components`: Componentes reutilizáveis de UI (`StoryCard`, `AudioPlayer`, `AppHeader`, etc.).
    - `/hooks`: Hooks customizados (`useCatalog` para centralizar dados, `useWebHead` para SEO na Web).
    - `/store`: Estados compartilhados e persistidos localmente (favoritos e modo noite).
    - `/theme`: Sistema de Design Tokens (`tokens.ts`).

### Endpoints da API
- `GET /api/` - Retorna informações gerais do catálogo (Marca, Versão, Total de histórias).
- `GET /api/catalog` - Retorna o catálogo completo (metadados e histórias estruturadas).
- `GET /api/stories` - Lista apenas o array de histórias.
- `GET /api/stories/{story_id}` - Retorna uma história específica por ID.
- `GET /api/meta` - Agrega estatísticas e contagem rápida para renderização rápida na UI (Universos, Valores, Faixas Etárias).
- `GET /api/audio/{story_id}.mp3` - Transmite o arquivo de áudio correspondente para o player.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o backend e o frontend em sua máquina local.

### Pré-requisitos
Certifique-se de possuir instalado em sua máquina:
- **Node.js** (versão 18 ou superior)
- **Yarn** ou **npm**
- **Python** (versão 3.10 ou superior) com `pip`

---

### Passo 1: Executando o Backend (API)

1. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. (Opcional, mas recomendado) Crie e ative um ambiente virtual Python:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instale as dependências necessárias:
   ```bash
   pip install -r requirements.txt
   ```

4. Inicie o servidor local FastAPI utilizando o Uvicorn:
   ```bash
   uvicorn server:app --host 127.0.0.1 --port 8001 --reload
   ```

5. **Verificação**: Acesse `http://127.0.0.1:8001/api/` em seu navegador para validar que a API está rodando com sucesso.

---

### Passo 2: Executando o Frontend (Expo App)

1. Abra um novo terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências do projeto:
   ```bash
   yarn install
   # ou: npm install
   ```

3. Crie um arquivo chamado `.env` na raiz da pasta `frontend/` (caso não exista) e adicione a URL da sua API local:
   ```env
   EXPO_PUBLIC_BACKEND_URL=http://127.0.0.1:8001
   ```

4. Inicie a aplicação no modo Web:
   ```bash
   yarn web
   # ou: npm run web
   ```
   *Nota: A aplicação será iniciada na porta 3000 por padrão, conforme configurado nos scripts (`expo start --web --port 3000`).*

5. **Verificação**: Seu navegador padrão abrirá automaticamente a página do aplicativo em `http://localhost:3000`.

---

## 🔒 Roadmap Pós-MVP (Em Breve)
A arquitetura do backend já está pré-configurada para expansões futuras:
- **Autenticação**: Rotas para `/api/auth/*` para login/cadastro de pais.
- **Perfis de Crianças**: Rotas para `/api/profiles/*` permitindo gerenciar perfis individuais por filho (nome, idade, avatares).
- **Assinaturas**: Rotas `/api/subscription/*` para integrar camada Grátis vs Premium e Gateway de Pagamentos.
- **Histórico & Sincronização**: Integração total com MongoDB para registrar histórias lidas e sincronizar dados entre dispositivos.
