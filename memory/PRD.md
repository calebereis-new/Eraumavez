# Era Uma Vez — PRD (MVP)

## Visão
Plataforma de histórias infantis (3–6 anos) para o momento de dormir. Cada história curta começa com "Era uma vez" e ensina um valor. Navegação estilo streaming (prateleiras), múltiplos universos e coleções, múltiplos formatos.

## Escopo do MVP (entregue nesta etapa)
- **Identidade visual** fiel ao guia: paleta Noite Ameixa (#2A1844) ~60% / Creme Lençol (#F6EFE1) ~30% / Dourado Estrela (#E9B24C) ~10%. Títulos em **Cormorant**, texto em **Nunito** (fontes locais TTF).
- **Catálogo** carregado de `backend/catalogo.json` via `GET /api/catalog`, `GET /api/stories`, `GET /api/stories/{id}`, `GET /api/meta`. Adicionar histórias = acrescentar ao JSON.
- **Home** com saudação dinâmica e prateleiras roláveis horizontais: Em destaque, Para dormir tranquilo, Histórias rápidas (≤ 3 min), uma prateleira por universo.
- **Tabs**: Início · Valores · Universos · Favoritos.
- **Navegação por valor** (`/valor/[nome]`): grid de todas as histórias daquele valor (principal + secundários).
- **Navegação por universo › coleção** (`/universo/[nome]` → `/colecao?universo=…&colecao=…`): prateleiras por coleção dentro do universo, chips de coleção e grid de histórias.
- **Busca e filtros** (`/busca`): busca por título/personagem + filtros combináveis (universo, valor, faixa etária, duração até 3/5 min, formato disponível). Mostra contagem de resultados.
- **Tela da história** (`/historia/[id]`): hero com gradiente do universo, "Era uma vez", título, badges (universo, coleção, valor principal destacado, faixa etária, duração, Premium se aplicável). Seletor de formato:
  - **Ler (adulto)** — texto completo em Nunito, A−/A+ para ajustar fonte.
  - **Ler (criança)** — fonte maior; oculto se não houver `texto_simplificado`.
  - **Ouvir** — player UI; tabs desabilitadas com "em breve" quando não há `link_audio`.
  - **Assistir** — placeholder; "em breve" quando não há `link_video`.
  - Card destacado **"Para conversar"** com a pergunta de reflexão.
- **Modo Noite / Hora de Dormir**: botão dedicado na tela da história escurece o fundo (`#170A28`); preferência persistida em AsyncStorage.
- **Favoritos locais**: estrela na tela da história; armazenados em AsyncStorage; aba dedicada na navegação.
- **Cards procedurais elegantes** para histórias sem `link_imagem`: gradiente da cor do universo + estrelas + título.

## Ganchos para o futuro (comentados no código, não implementados)
- `/api/auth/*`, `/api/profiles/*` — login dos pais + perfis de filhos.
- `/api/subscription/*` — camada Grátis vs. Premium + pagamento mensal (campo `camada` já existe no catálogo).
- `/api/history/*` — "já lidas" e recomendações.
- `/api/sync/*` — sincronização entre dispositivos.
- Bloqueio Premium marcado em `app/historia/[id].tsx` na seção pré-render.

## Estrutura técnica
- **Backend**: FastAPI carrega `catalogo.json` em memória; endpoints `/api/catalog`, `/api/stories`, `/api/stories/{id}`, `/api/meta`. CORS aberto. Pronto para evoluir para MongoDB.
- **Frontend**: Expo Router file-based.
  - `app/(tabs)/` — Home, Valores, Universos, Favoritos.
  - `app/historia/[id].tsx`, `app/valor/[nome].tsx`, `app/universo/[nome].tsx`, `app/colecao.tsx`, `app/busca.tsx`.
  - `src/theme/tokens.ts` — cores, fontes, spacing, radius (fonte de verdade da marca).
  - `src/api/catalog.ts` — cliente do backend + helpers de filtro.
  - `src/components/` — `AppHeader`, `StoryCard`, `Shelf`, `StoryGrid`.
  - `src/store/favorites.ts`, `src/store/nightMode.ts` — AsyncStorage.
- Fontes: TTFs em `assets/fonts/` carregadas via `expo-font`.

## Próximas etapas
1. Polir Modo Noite (aplicar globalmente, não só na tela de história).
2. Integrar player de áudio real (`expo-audio`) quando houver `link_audio`.
3. Integrar player de vídeo (`expo-video`).
4. Imagens de capa reais quando o cliente fornecer.
5. Auth + perfis de filhos + camada Premium + pagamento.
