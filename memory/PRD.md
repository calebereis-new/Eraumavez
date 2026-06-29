# Era Uma Vez - PWA de Histórias Infantis

## Original Problem Statement
Pull do repo https://github.com/calebereis-new/Eraumavez (privado).
PWA "Era Uma Vez" - Expo + React Native Web + Expo Router + FastAPI + catálogo JSON (130 histórias). Não alterar design/navegação/cores/fontes/estrutura. Apenas importar, validar e deixar pronto para deploy.

## Architecture
- Frontend: Expo Router (Expo 54, React 19, react-native-web), porta 3000
- Backend: FastAPI (port 8001) servindo /api/{catalog,stories,stories/{id},meta}
- Storage: backend/catalogo.json (130 histórias, sem DB)
- PWA: manifest.webmanifest, favicons, og-image, apple-touch-icon em /app/frontend/public

## What's been done (2026-01)
- Repo clonado para /app (privado, via PAT)
- Dependências instaladas (yarn + pip)
- .env criados: EXPO_PUBLIC_BACKEND_URL (frontend), MONGO_URL/DB_NAME (backend)
- `package.json` start ajustado para `expo start --web --port 3000` (necessário para supervisor)
- Bug fix mínimo: `Castle` icon não existe em phosphor-react-native@3.0.6 → trocado para `CastleTurret as Castle` em UniverseIcon.tsx
- Validado: backend 130 stories, todos assets PWA HTTP 200, frontend renderiza grids e tabs

## Endpoints
- GET /api/ → metadata da marca
- GET /api/catalog → catálogo completo
- GET /api/stories → lista de histórias
- GET /api/stories/{id} → história específica
- GET /api/meta → universos/valores/faixas agregados

## Next Action Items
- Usuário acionar botão Deploy no painel Emergent para publicar e obter URL pública estável
- Conectar domínio próprio após deploy
