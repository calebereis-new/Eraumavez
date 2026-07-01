# Era Uma Vez - PWA de Histórias Infantis

## Original Problem Statement
Pull do repo Era Uma Vez (privado). PWA Expo + React Native Web + Expo Router + FastAPI + catálogo JSON. Refinamento visual completo + camada de perfil/login simulado.

## Architecture
- Frontend: Expo Router (Expo 54, React 19, react-native-web), porta 3000
- Backend: FastAPI (porta 8001) servindo /api/{catalog,stories,stories/{id},meta,audio/{id}.mp3}
- Storage: backend/catalogo.json (150 histórias) + backend/audio/ (4 MP3s)
- PWA: manifest.webmanifest, favicons, og-image, apple-touch-icon
- Persistência local: AsyncStorage (auth, profiles, active profile, history, favorites, night mode)

## What's been done

### 2026-01 — Setup inicial
- Repo clonado, dependências, .env, fixes de deploy (env vars Expo + ngrok + supervisor [program:expo])

### 2026-01 — Áudio (4 histórias)
- 4 MP3s servidos via /api/audio/{id}.mp3 (Accept-Ranges, cache)
- Player AudioPlayer com botão dourado, barra fininha, scrub, rótulo

### 2026-01 — Sincronização catálogo
- Catálogo agora 150 histórias (20 novas)

### 2026-01 — Identidade visual refinada (Fase 1)
- Tokens: noiteAmeixa #0B0717, gradiente #3D2363→#1B1030→#0B0717, lavanda #9A86C0, lilas #C8B2E6
- ScreenBg wrapper com gradiente + StarrySky
- BottomBar: 3 abas (Início, Explorar, Perfil) — Compass/House/User icons
- Aba Explorar: toggle "Por valor"/"Por universo" unificando antigos Valores+Universos
- Removidos arquivos antigos: (tabs)/valores.tsx, universos.tsx, favoritos.tsx

### 2026-01 — Auth simulado + Perfis + Histórico (Fase 2)
- Splash com lua + "Era uma vez…" animado, decisor de rota
- /auth/entrar — Tabs Entrar/Criar conta, campos visuais, botões Google/Apple (qualquer clique entra)
- /auth/perfis — "Quem vai sonhar hoje?" começa vazio, modal Adicionar com nome+idade
- (tabs)/perfil — header com avatar, stats (histórias/noites/valores), tabs Histórias lidas/Favoritos
- /historia/fim/[id] — Fim com Lua, "O valor de hoje", Gostei/Não gostei, De novo/Próxima, Voltar
- Stores: profiles, history (com computeStats: total, streak, valores únicos)
- logRead automático ao abrir história · setLike ao avaliar no Fim

## Endpoints
- GET /api/ | /api/catalog | /api/stories | /api/stories/{id} | /api/meta | /api/audio/{id}.mp3

## Próxima etapa
- Validação do usuário (preview) → Deploy em produção
- (Backlog) Auth real (JWT ou Emergent Google), backend dos perfis, sincronizar histórico entre dispositivos
