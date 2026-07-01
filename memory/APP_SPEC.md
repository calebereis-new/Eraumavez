# Era Uma Vez — Especificação Funcional Completa

**Última atualização:** Janeiro 2026
**Escopo:** App PWA "Era uma vez…" — histórias infantis para hora de dormir
**URL de produção:** https://eraumavez.app.br
**Stack:** Expo Router (React Native Web) + FastAPI + MongoDB (não usado ainda) + catálogo JSON estático

---

## 1. Visão geral

Aplicativo web progressivo (instalável no celular como app nativo) que oferece um catálogo de histórias infantis curadas para a hora de dormir, com formatos de leitura para adulto e criança, narração em áudio (parcial), sistema de perfis por criança dentro de uma conta familiar, histórico de leitura, favoritos e avaliação com Gostei/Não gostei.

O acesso hoje **funciona via login/cadastro simulado** — nenhuma autenticação real acontece; qualquer clique em "Entrar" ou "Criar conta" leva direto pra tela de seleção de perfil. Toda persistência do usuário (perfis, histórico, favoritos, modo noite) é **local**, via AsyncStorage do navegador. O catálogo (histórias) vem do backend.

---

## 2. Estrutura de dados

### 2.1. Catálogo (backend/catalogo.json, estático)

Contém 150 histórias. Cada história tem estes campos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador único no padrão `EUV-XXXX` (ex.: `EUV-0031`) |
| `titulo` | string | Título completo da história |
| `universo` | string | Ex.: `Bíblicas`, `Super-heróis`, `Princesas e Reinos`, `Animais`, `Contos`, `Históricas`, `Mundo` |
| `colecao` | string | Sub-agrupamento dentro do universo (ex.: `Histórias de Jesus`, `Marvel`, `Disney`) |
| `valor_principal` | string | Ex.: `Humildade`, `Coragem`, `Gratidão`, `Fé` |
| `valor_secundario` | string | Segundo valor abordado (opcional; pode estar vazio) |
| `faixa_etaria` | string | Ex.: `3-6 anos (geral)`, `7-10 anos` |
| `duracao_min` | number | Duração estimada em minutos (leitura por adulto) |
| `texto` | string | Texto integral (formato "adulto") |
| `texto_simplificado` | string | Frases curtas separadas por `\|` para o modo criança |
| `pergunta` | string | Pergunta reflexiva "Para conversar" ao final |
| `camada` | string | `Grátis` ou `Premium` — reservado para monetização futura, hoje não é usado como gate |
| `link_audio` | string | Caminho relativo do áudio (ex.: `/api/audio/EUV-0031.mp3`); vazio quando não tem |
| `link_imagem` | string | Reservado, não usado |
| `link_video` | string | Reservado, não usado |

Metadata do catálogo:
- `marca`: "Era Uma Vez"
- `versao_catalogo`: "1.0"
- `total`: 150

Áudios servidos: 4 histórias hoje têm `link_audio` preenchido (`EUV-0031`, `EUV-0032`, `EUV-0034`, `EUV-0038`). Os MP3s ficam em `/app/backend/audio/`.

### 2.2. Armazenamento local (AsyncStorage no navegador)

**Chave `@euv:auth:v1`** — flag `'1'` ou `'0'`. Marca se o usuário passou pelo login simulado.

**Chave `@euv:profiles:v1`** — array de perfis:
```
{
  id: string,        // gerado local: "p_<timestamp>_<random>"
  nome: string,
  cor: string,       // "corA|corB" — gradiente do avatar
  idade?: number,
  desdeISO: string   // ISO datetime de criação
}
```
Paleta de cores dos avatares (aplicada por ordem cíclica de criação):
1. Rosa → magenta
2. Azul acinzentado
3. Verde
4. Dourado
5. Roxo
6. Coral

**Chave `@euv:active-profile:v1`** — string com o `id` do perfil ativo atualmente selecionado, ou ausente.

**Chave `@euv:history:v1`** — objeto indexado por `profileId`:
```
{
  "<profileId>": [
    {
      storyId: "EUV-0001",
      storyTitulo: "A Noite em que o Céu Cantou",
      universo: "Bíblicas",
      valor: "Humildade",
      duracao: 3,
      whenISO: "2026-01-31T22:15:00.000Z",
      like: "like" | "dislike" | null
    },
    ...
  ]
}
```
Regras:
- Máximo 500 entradas por perfil (as mais antigas são cortadas).
- Se o usuário abre a mesma história 2x no mesmo dia, a entrada é **atualizada no lugar** (não duplica).
- Ao abrir uma nova história, a entrada é inserida no início (mais recentes primeiro).

**Chave dos favoritos (via `favorites.ts`)** — array de `storyId`s. Toggle simples.

**Chave `@euv:night-mode:v1`** — `'1'` ou `'0'`.

### 2.3. Cálculo de estatísticas (função `computeStats` em `history.ts`)

A partir das entradas de histórico de um perfil, calcula:
- **`total`**: número total de entradas (histórias lidas contando repetições em dias diferentes).
- **`valores`**: número de valores únicos abordados nas histórias lidas.
- **`streak`** (sequência de noites): dias únicos consecutivos até hoje em que houve leitura. Se hoje ainda não teve leitura mas ontem teve, começa a contar a partir de ontem. Máximo 365.

---

## 3. Backend — API

Base: `https://<preview-url>/api` ou `https://eraumavez.app.br/api`
Prefixo: `/api` (obrigatório por causa do proxy do Kubernetes)

### 3.1. Endpoints ativos

| Método | Rota | Retorno | Descrição |
|---|---|---|---|
| GET | `/api/` | `{ msg, marca, versao_catalogo, total }` | Health check + metadata |
| GET | `/api/catalog` | catálogo completo (o JSON inteiro) | Uso interno; frontend baixa uma vez |
| GET | `/api/stories` | `[Historia]` | Lista todas as histórias |
| GET | `/api/stories/{id}` | `Historia \| 404` | Detalhe de uma história |
| GET | `/api/meta` | `{ total, universos: {[uni]: {[colecao]: n}}, valores, faixas }` | Agregações para telas de filtro |
| GET | `/api/audio/{id}.mp3` | Binário MP3 com `Accept-Ranges: bytes` e `Cache-Control: public, max-age=86400` | Serve o áudio da história `id` |

O endpoint `/api/audio/` valida path (rejeita `..`, `/`, `\`) e retorna 404 se o arquivo não existir.

### 3.2. Não implementado ainda
- Nenhuma autenticação real.
- Nenhum endpoint de perfis, histórico ou favoritos (tudo é local).
- Nenhum endpoint de pagamento.

---

## 4. Estrutura de navegação (Expo Router)

```
/                             → redireciona para /splash
/splash                       → tela de abertura (roteador)
/auth/entrar                  → login/cadastro simulado
/auth/perfis                  → seleção de perfil "Quem vai sonhar hoje?"
/(tabs)/                      → home (aba Início)
/(tabs)/explorar              → aba Explorar (toggle Valor/Universo)
/(tabs)/perfil                → aba Perfil (perfil ativo)
/historia/[id]                → tela de leitura da história
/historia/fim/[id]            → tela de encerramento da história
/universo/[nome]              → lista de histórias de um universo (com sub-coleções)
/valor/[nome]                 → lista de histórias que abordam um valor
/colecao?universo=X&colecao=Y → lista de histórias de uma coleção específica
/busca                        → tela de busca com filtros
/sobre                        → sobre o app
```

Barra inferior fixa em `/(tabs)/*` com 3 ícones: **Início**, **Explorar**, **Perfil**. Rotas fora dessa família (histórias, sobre, etc.) NÃO mostram a barra inferior — usam o botão voltar do header.

---

## 5. Especificação por tela

### 5.1. Splash `/splash`

- Aparece automaticamente ao abrir o app pela URL raiz.
- Mostra ícone da lua com brilho, texto "Era uma vez…" em italic com "vez" destacado, subtítulo "histórias para a hora de dormir" e 3 pontinhos indicando animação.
- Anima entrada (fade + slide-up de 8px em 700ms).
- Após **1,9 segundo**, decide o próximo destino:
  1. Se `getAuthed()` retorna `false` → `/auth/entrar`
  2. Se autenticado mas `getActiveProfileId()` retorna `null` → `/auth/perfis`
  3. Senão → `/(tabs)`
- Não tem botão de skip.

### 5.2. Login / Cadastro `/auth/entrar`

- Header com lua pequena + "Era uma **vez**" + "Boa noite. Vamos começar?"
- **Tabs internas** com dois estados: `Entrar` (padrão) e `Criar conta`. Trocar tab não muda os campos, só o rótulo do botão principal.
- Campos:
  - **E-MAIL** com ícone de envelope, `keyboardType="email-address"`, `autoCapitalize="none"`.
  - **SENHA** com ícone de cadeado, campo com `secureTextEntry` e ícone de olho (decorativo, não implementa toggle de visibilidade ainda).
- Somente no modo `Entrar`: link "Esqueci a senha" alinhado à direita (decorativo, não abre nada).
- Botão principal grande **dourado**: "Entrar" ou "Criar conta".
- Divisor "ou".
- Dois botões sociais lado a lado: **Google** e **Apple** (decorativos, mas clicáveis).
- Rodapé: "Ao continuar, você concorda com os Termos e a Política de Privacidade." (texto estático).
- **Comportamento atual (simulado)**: qualquer clique em `Entrar`, `Criar conta`, `Google` ou `Apple` chama `setAuthed(true)` e redireciona para `/auth/perfis`. Os campos de email/senha **NÃO são validados nem enviados a lugar nenhum**.

### 5.3. Seleção de Perfil `/auth/perfis`

- Header: lua + "Era uma vez" (italic dourado) + título "Quem vai sonhar hoje?"
- **Grid de perfis**: cada perfil ocupa uma célula com avatar circular gradiente + primeiro nome. Perfis são lidos de `listProfiles()` (AsyncStorage).
- **Botão "Adicionar"** aparece **sempre** como última célula do grid — círculo tracejado com ícone `+`. Toca → abre modal.
- No rodapé (posição absoluta), botão **"Cantinho dos pais"** com ícone de engrenagem. **Decorativo — não faz nada ao clicar** (previsto para futuro).

**Modal de novo perfil:**
- Título "Novo perfil" + subtítulo "Quem mais vai sonhar com a gente?"
- Campo `NOME` (texto).
- Campo `IDADE (opcional)` (numérico).
- Botões `Cancelar` e `Adicionar`.
- Ao submeter:
  1. Valida `nome` (não pode estar vazio; se vazio, mostra `Alert.alert` "Nome" — no web pode não aparecer visualmente).
  2. Converte idade para número se digitada (remove não-dígitos).
  3. Chama `addProfile({nome, idade})` — gera id local, atribui próxima cor da paleta, timestamp atual.
  4. Fecha modal, limpa campos, define esse perfil como ativo, redireciona para `/(tabs)`.

**Selecionar perfil existente**: clique no card → `setActiveProfileId(p.id)` → redireciona para `/(tabs)`.

**Estado inicial (usuário novo)**: grid tem só o botão "Adicionar".

### 5.4. Aba Início `/(tabs)/`

- **Header (AppHeader)** com:
  - Saudação dinâmica baseada na hora do relógio local:
    - 0–5h: "Boa madrugada"
    - 6–11h: "Bom dia"
    - 12–17h: "Boa tarde"
    - 18–23h: "Boa noite"
  - Se há perfil ativo: `"{saudação}, {primeiro nome}!"` — ex.: `"Boa noite, Joana!"`
  - Subtítulo: "Qual história hoje?"
  - Ícone de **lua** (toggle Modo Noite) e ícone de **informação** (abre `/sobre`).
- **Botão de busca** (lupa) na parte superior direita — abre `/busca`.
- **Prateleiras horizontais** com scroll horizontal, cada uma com título e histórias:
  - **Em destaque** — subtítulo "Histórias que abrem o coração"; filtragem: primeira leva de 8 histórias com alguma lógica de destaque.
  - **Para dormir tranquilo**
  - **Histórias rápidas** (baseado em `duracao_min`)
  - **Histórias Bíblicas** (filtro por universo)
  - **Super-heróis**
  - **Princesas e Reinos**
  - **Animais**
- Cada prateleira usa o componente `Shelf` + `StoryCard`.
- Estado vazio (catálogo carregando ou sem histórias): mostra spinner ou "Nenhuma história disponível."

**StoryCard** — cada card exibe:
- Capa colorida por universo (usa `universoCor()`), com estrelinhas piscando (StarrySky) no painel superior.
- Ícone do universo no canto superior direito da capa.
- Título da história em serifa italic.
- Rodapé com: badge do valor principal (com estrela dourada), duração em minutos com ícone de lua, e (se tiver áudio) indicador visual de fone/áudio.
- Ao tocar, navega para `/historia/{id}`.

### 5.5. Aba Explorar `/(tabs)/explorar`

- Título "Explorar" grande.
- **Botão de busca** logo abaixo (mesmo comportamento — abre `/busca`).
- **Toggle no topo** com 2 opções mutuamente exclusivas: **Por valor** (padrão) e **Por universo**. Cliques trocam a visualização abaixo.

**Modo "Por valor"** (FlatList):
- Cada linha tem: pequeno círculo com estrela dourada + nome do valor + badge com número de histórias que abordam esse valor + seta direita.
- Ordenados alfabeticamente.
- Ao tocar, navega para `/valor/{nome}`.
- Conta é feita considerando `valor_principal` OU qualquer valor em `valor_secundario` (parsing por `|`).

**Modo "Por universo"** (ScrollView):
- Cada universo é um bloco com:
  - Header com gradiente colorido do universo + estrelinhas + ícone do universo + nome + "N histórias · M coleções" + botão dourado "Abrir" (leva a `/universo/{nome}`).
  - Abaixo, lista das **até 5 primeiras coleções** do universo — cada linha com dot colorido, nome da coleção, contagem, seta. Ao tocar, navega para `/colecao?universo=X&colecao=Y`.
- Universos ordenados alfabeticamente.

### 5.6. Aba Perfil `/(tabs)/perfil`

**Se não há perfil ativo:**
- Mostra "Nenhum perfil ativo" + botão dourado "Escolher perfil" → navega para `/auth/perfis`.

**Se há perfil ativo:**
- Header:
  - Avatar circular com gradiente (60x60) e inicial do nome.
  - Nome do perfil (título).
  - Subtítulo: `"[idade] anos · desde [mês por extenso]"` (mês em português).
  - Ícone de **trocar perfil** à direita (setas horizontais). Ao clicar: chama `setActiveProfileId(null)` e navega para `/auth/perfis`. (Antigamente usava `Alert.alert` mas foi trocado porque não funciona no web.)
- **Stats row** (3 cards lado a lado):
  1. `{total}` histórias
  2. `{streak}` noites seguidas
  3. `{valores}` valores
- **Tabs** internos: `Histórias lidas` (padrão) e `Favoritos`.

**Tab Histórias lidas:**
- Se vazio: "Ainda nenhuma noite registrada" + "Abra uma história e ela aparece aqui — com botão de gostei."
- Senão: lista vertical, cada entrada com:
  - Thumbnail colorido (48x48) na cor do universo.
  - Título da história (1 linha, elipse).
  - Metadata: `"{valor} · {tempo relativo}"` — tempo relativo humanizado: `"hoje"`, `"ontem"`, `"N dias"`.
  - Ícone de **joinha dourada** (like) ou **joinha lavanda invertida** (dislike) à direita, se houver avaliação. Sem ícone se ainda não avaliou.
- Ao tocar em uma entrada, reabre a história em `/historia/{storyId}`.

**Tab Favoritos:**
- Se vazio: "Ainda não há favoritas" + "Toque na estrelinha de uma história para guardá-la aqui."
- Senão: **grid de 3 colunas** com cards no tamanho `sm` (usa `StoryCard`). Ordenados pela ordem em que foram favoritados (mais recentes primeiro? — checar ordem exata).

### 5.7. Tela da história `/historia/[id]`

Carrega a história do backend em `useEffect` (ao montar). Enquanto carrega, mostra spinner. Se `id` inválido → 404.

**Ao carregar com sucesso**, chama `logRead(profileId, {...})` **automaticamente** (registra visualização no histórico do perfil ativo). Se não há perfil ativo, não registra.

**Estrutura vertical (ScrollView):**

1. **Header (hero)** — bloco com gradiente colorido do universo + estrelinhas piscando + ícone do universo no canto:
   - Botão voltar (canto superior esquerdo).
   - Toggle Modo Noite (canto superior direito, ícone lua).
   - Toggle Favorito (canto superior direito, estrela — dourada quando ativo).
   - Rótulo "Era uma vez" pequenino em italic dourado.
   - Título grande em Cormorant (serifa italic).
   - Badge do valor principal (com estrela dourada, fundo dourado leve).
   - Metadata em chips: universo · coleção · faixa etária · duração (com ícones).

2. **Player de áudio** (só aparece se `historia.link_audio` estiver preenchido):
   - Componente `AudioPlayer` — botão redondo grande de play/pause em dourado (56x56), rótulo "Ouvir esta história 🌙" + "Narração suave para a hora de dormir", barra de progresso fininha dourada, tempo atual / duração total (`0:00 / 3:04`).
   - Uso de HTMLAudioElement no web (não usa a API `expo-av`).
   - Suporta **scrub** (tocar na barra para pular).
   - **Não faz autoplay** — usuário precisa clicar.
   - Continua tocando se o usuário rolar a tela ou trocar de aba dentro da história.
   - Respeita modo noite (cor de fundo do card fica mais discreta).

3. **Seletor de formato** (4 tabs em pill):
   - **Ler (adulto)** — sempre disponível, é o padrão.
   - **Ler (criança)** — disponível se `texto_simplificado` estiver preenchido. Se não, tab fica desabilitado.
   - **Ouvir** — disponível se tiver `link_audio`. Se não, tab desabilitado com rótulo "em breve".
   - **Assistir** — sempre indisponível hoje (rótulo "em breve").

4. **Conteúdo por formato:**

   - **Adulto**: mostra o texto integral (`historia.texto`) em Cormorant. Acima do texto, há um controle "Tamanho do texto" com botões `A−` e `A+` que ajustam de 14 a 24px. Ao aumentar/diminuir, o `lineHeight` acompanha (1,7 × tamanho).

   - **Criança** (componente `KidReader`):
     - Parse do `texto_simplificado` separando por `|` → array de frases curtas.
     - Mostra **uma frase por página**, centralizada, em tipografia grande (30px extra-bold).
     - **Barra de progresso** fininha dourada no topo.
     - **Contador** em pill: `"3 de 15"` com sparkle dourado.
     - **Botão anterior** (círculo, seta esquerda) — desabilitado com opacidade reduzida na primeira frase.
     - **Botão próximo** (grande, dourado, ocupa a maior parte da largura) — "Próxima" com seta direita.
     - Na **última frase**, o botão "Próxima" vira **"Terminamos! ✨"** em italic e leva direto para `/historia/fim/{id}`.
     - Rodapé com dica sutil: "Cada tela tem uma frase. Leia bem devagar. ✨"
     - Respeita modo noite (fundo do card mais escuro).

   - **Ouvir**: quando tem áudio, mostra um card explicativo ("Áudio narrado" + "Aperte o botão para ouvir"). Mas o player já está acima; esta view é secundária. Se não tem áudio: "O áudio chega em breve. Por enquanto, leia em voz alta."

   - **Assistir**: card "em breve".

5. **Para conversar** — card com ícone de balão e pergunta reflexiva (`historia.pergunta`).

6. **CTA grande dourado "Era uma vez… Terminamos! Avaliar e ver a próxima"** — leva para `/historia/fim/{id}`. Sempre aparece independente do formato escolhido.

7. **"Esta história também fala de"** — chips com o(s) valor(es) secundário(s), se houver. Ao tocar, navega para `/valor/{nome}`.

### 5.8. Tela de Fim `/historia/fim/[id]`

Carrega os dados da história em `useEffect`.

Estrutura vertical centralizada:
- **Lua com glow** no topo.
- **"Fim"** em Cormorant italic grande.
- **Card "O VALOR DE HOJE"** com rótulo pequeno em letras maiúsculas, o nome do valor grande em dourado, e o texto da pergunta (`historia.pergunta`) como resumo. Se não houver pergunta, mostra fallback: `"Hoje aprendemos sobre {valor lowercase}."`
- **Pergunta em italic**: "Você gostou desta história?"
- **Dois botões grandes**:
  - **Gostei** (com ícone de joinha) — ao clicar, salva `like` no histórico (`setLike(profileId, storyId, 'like')`) e o botão fica dourado preenchido.
  - **Não gostei** (com joinha invertida) — salva `dislike`. Botão fica em tom lavanda escuro.
  - Clicar de novo no mesmo botão remove a avaliação (volta pra `null`).
  - Se não há perfil ativo, a avaliação **não é persistida** (mas o UI reage).
- **Linha de ações inferiores**:
  - **De novo** (com ícone de recarregar) — `router.replace('/historia/{id}')` (recomeça a história).
  - **Próxima história** (dourado, destacado) — busca a próxima história do catálogo em ordem circular (índice `+1` módulo total) e navega.
- **"Voltar ao início"** (link pequeno no rodapé) — `router.replace('/(tabs)')`.

Nenhum contador de tempo, sem confetti, sem som. Design contemplativo pra hora de dormir.

### 5.9. Detalhe de Universo `/universo/[nome]`

- Header com título "{Universo}" e metadata (n° histórias, n° coleções).
- Lista de sub-coleções expansíveis — cada coleção com título e histórias filtráveis dentro.
- Toca em uma história → `/historia/{id}`.

### 5.10. Detalhe de Valor `/valor/[nome]`

- Título "Histórias sobre {Valor}".
- Lista de histórias que têm `valor_principal == valor` OU `valor_secundario` contendo esse valor.
- Grid ou lista vertical de `StoryCard`.

### 5.11. Detalhe de Coleção `/colecao?universo=X&colecao=Y`

- Título com nome da coleção.
- Lista de histórias filtradas por `universo == X` E `colecao == Y`.

### 5.12. Busca `/busca`

- Campo de busca no topo, foca automaticamente.
- Filtros opcionais expansíveis (universo, valor, faixa etária, duração).
- Resultados em lista/grid conforme digita (debounced).
- Case-insensitive; busca por título, universo, coleção, valor, e trechos do texto.
- Estado vazio: "Encontre uma história pelo título, valor ou universo."

### 5.13. Sobre `/sobre`

- Botão voltar no header.
- Hero compacto: lua dourada + "Era uma **vez**" (em serifa italic, com "vez" em dourado).
- Frase-manifesto centralizada e em italic:  
  *"Toda história começa com 'Era uma vez' — o ritual que acende a imaginação da criança e tranquiliza o coração dos pais."*
- **3 cards** com títulos dourados:
  1. **O que é** — "Histórias infantis criadas com um modelo previamente treinado para trazer uma linguagem adequada, histórias bem estruturadas e sempre ensinar valores para nossos filhos."
  2. **Para quem é** — "Famílias que querem transformar a hora de dormir num momento de carinho, escuta e formação."
  3. **Como navegar** — "Percorra as prateleiras no **Início**, use o **Explorar** para navegar entre universos e valores e veja em seu **Perfil** as histórias que já leu, curtiu e suas favoritas."
- Box de versão do app com "Versão" + "1.0.0".
- Frase de assinatura no rodapé: *"Feito com carinho para a hora mais bonita do dia."*

---

## 6. Componentes globais

### 6.1. AppHeader
- Aparece no topo da Home e da tela Sobre.
- Props: `greeting`, `subtitle`, `showBack` (mostra botão voltar em vez da lua/info).
- Ícones interativos: **lua** (toggle Modo Noite), **info** (abre `/sobre`), **voltar** (quando `showBack`).

### 6.2. BottomBar
- Barra inferior fixa nas 3 abas.
- 3 ícones: `House` (Início), `Compass` (Explorar), `User` (Perfil).
- Cor do ícone ativo: dourado (`douradoEstrela`). Inativo: ameixa claro.
- `data-testid` no formato `tab-{route}` para automação.

### 6.3. StarrySky
- Fundo com pontos aleatórios simulando estrelas (com `seed` para consistência entre re-renders).
- Props: `seed`, `density`, `opacity`.
- Sem animação de piscar hoje (poderia ser adicionado).

### 6.4. ScreenBg
- Wrapper de tela: aplica gradiente noturno de fundo + StarrySky por cima.
- Usado como raiz de todas as telas principais.

### 6.5. MoonMark, Wordmark, UniverseIcon, ValorBadge
- Componentes de marca:
  - `MoonMark`: lua dourada (SVG).
  - `Wordmark`: logo textual (usada apenas em contextos maiores; **evitada em Sobre**).
  - `UniverseIcon`: ícone específico por universo (Book, Castle, Star, Planet, etc.). Usa Phosphor Icons; note que `Castle` foi mapeado como `CastleTurret` porque a versão instalada do pacote não exporta `Castle` puro.
  - `ValorBadge`: badge com estrela dourada + nome do valor.

### 6.6. Shelf
- Prateleira horizontal reutilizável na Home. Título + subtítulo opcional + FlatList horizontal de `StoryCard`.

### 6.7. StoryCard
- Card de história com 3 tamanhos: `sm`, `md`, `lg`.
- `sm` usado em favoritos (grid 3 colunas).
- `md` usado em prateleiras da Home.

### 6.8. AudioPlayer
- Player de áudio custom com HTMLAudioElement.
- Ver §5.7 item 2 para detalhes.

### 6.9. KidReader
- Leitor paginado por frase, ver §5.7 item 4 (formato criança).

---

## 7. Funcionalidades transversais

### 7.1. Modo Noite

- Toggle global via ícone de lua no AppHeader.
- Estado persistido em AsyncStorage (`@euv:night-mode:v1`).
- Quando ativo:
  - Escurece gradiente de fundo (usa cores mais profundas).
  - Reduz contraste e brilho de dourados nos players/cards.
  - Tende a tirar animações mais chamativas.
- Contexto React (`useNightMode`) disponível globalmente.

### 7.2. Favoritos

- Toggle na estrela no header da tela de história.
- Store em `favorites.ts` (AsyncStorage).
- Aparecem no Perfil > tab Favoritos.
- Não conta como "leitura" — só marca preferência.

### 7.3. Áudio

- 4 histórias com narração: `EUV-0031`, `EUV-0032`, `EUV-0034`, `EUV-0038`.
- Backend serve MP3 em `/api/audio/{id}.mp3`.
- Frontend detecta pelo campo `link_audio` do catálogo — se presente, mostra o player.
- Suporte a scrub (barra clicável).
- Não faz autoplay.
- Continua tocando com scroll (não é anexado ao DOM da tela).

### 7.4. Histórico

- Registrado automaticamente ao abrir uma história (`logRead`).
- Atualizado ao avaliar na tela Fim (`setLike`).
- Estatísticas calculadas em tempo real ao entrar no Perfil.
- Limite de 500 entradas por perfil.

---

## 8. Fluxos completos (jornadas do usuário)

### 8.1. Primeira abertura (usuário novo)

1. Abre https://eraumavez.app.br
2. Splash aparece 1,9s
3. Redireciona para `/auth/entrar` (não autenticado)
4. Usuário digita qualquer coisa (ou nada) e clica **Entrar**
5. Vai para `/auth/perfis` — grid vazio com só o botão "+Adicionar"
6. Clica em Adicionar → modal → digita nome ("Joana") e idade (5)
7. Clica em Adicionar → perfil criado, marcado como ativo
8. Vai para Home — "Boa noite, Joana!" com prateleiras
9. Clica em uma história — vai para `/historia/{id}` (histórico é registrado)
10. Lê / ouve
11. Clica em "Era uma vez… Terminamos!" ou navega para `/historia/fim/{id}`
12. Avalia com joinha
13. Clica em "Próxima história" — vai pra próxima do catálogo (circular)
14. Volta ao início pelo link "Voltar ao início"
15. Abre a aba Perfil — vê "Joana, 5 Anos, desde Janeiro · 1 história · 1 noite seguida · 1 valor" + histórico com joinha dourada

### 8.2. Retorno (usuário já logado)

1. Abre app → Splash → detecta autenticado + perfil ativo → vai direto pra Home
2. Já vê saudação com nome
3. Continua consumindo histórias

### 8.3. Trocar de perfil

1. Aba Perfil → ícone de troca no canto → confirma → limpa perfil ativo → volta pra `/auth/perfis`
2. Escolhe outro perfil OU adiciona novo

### 8.4. Marcar história como favorita

1. Dentro de `/historia/{id}` → clica na estrela do header → preenche dourada
2. Vai para Perfil > Favoritos → grid de favoritas

### 8.5. Reproduzir áudio

1. Abre uma das 4 histórias com áudio (ex.: `EUV-0031`)
2. Player aparece entre o hero e o seletor de formato
3. Clica no play → botão vira pause, tempo começa a correr, barra dourada preenche
4. Rola o texto — áudio continua tocando
5. Clica na barra para pular
6. Ao terminar (`ended`), botão volta ao estado inicial

---

## 9. Regras de negócio e edge cases

### 9.1. Autenticação simulada

- Nenhum campo é validado. Nenhuma senha é armazenada. Não há backend de auth. O botão **Entrar** só define uma flag booleana local.
- Se o navegador limpar `localStorage` (aba anônima, limpeza de cache), o usuário perde acesso ao "estado autenticado" e precisa passar pelo login de novo.
- Não há multiusuário no mesmo dispositivo (aparelho compartilhado = mesmo estado).

### 9.2. Persistência local

- Todos os dados (perfis, histórico, favoritos, modo noite) vivem no AsyncStorage do navegador.
- **Se o usuário limpar cache do navegador, perde tudo.**
- **Não sincroniza entre dispositivos** — abrir o app no celular e no PC = dois estados independentes.

### 9.3. Áudio

- Sem `link_audio` no catálogo = player não aparece.
- Se o MP3 retornar 404 no backend, o player aparece mas fica travado no estado "carregando duração".

### 9.4. Fluxo de Fim

- Se abrir `/historia/fim/{id}` diretamente por URL sem passar pela história, ainda funciona — carrega os dados via API.
- "Próxima história" usa a ordem do catálogo (não é aleatória, não filtra por afinidade).
- "De novo" recomeça a mesma história do zero (não retoma áudio).

### 9.5. Modo Noite

- Aplicado globalmente, não por tela.
- O toggle está em telas que têm `AppHeader` (Home, Sobre) e no header da tela de história.

### 9.6. Perfis

- Não há limite de perfis criados.
- Sem validação de duplicidade de nome — dá pra ter 3 "Joana" com IDs diferentes.
- Delete não está exposto no UI hoje (a função existe no store, mas nenhum botão a chama).

### 9.7. Histórico

- Se abrir a mesma história 2× no mesmo dia, atualiza a entrada existente (não duplica).
- Se abrir em dias diferentes, cria 2 entradas.
- Streak "quebra" se um dia passa sem leitura. Recomputa toda vez que a tela Perfil carrega.

---

## 10. Comportamento em PWA

- Manifest configurado com `background_color`, `theme_color`, ícones (48, 72, 96, 144, 192, 512).
- Instalável no celular como app (adicionar à tela inicial).
- Splash nativo do sistema mostra logo antes do splash React ser carregado.
- Meta tags Open Graph configuradas para links compartilhados.
- Favicon SVG + PNGs.
- Sem service worker de cache offline hoje — se o usuário perder conexão, o catálogo/histórias não carregam.
- Não instala em iOS Safari em modo offline hoje.

---

## 11. Deploy e ambientes

- **Preview (desenvolvimento)**: URL temporária do Emergent (muda por sessão).
- **Produção**: https://eraumavez.app.br — domínio próprio conectado.
- Backend em `:8001` interno, frontend em `:3000`, roteado por prefix `/api` via nginx do Kubernetes.
- Supervisor gerencia processos backend + frontend (Expo).
- Deploy manual pelo botão "Deploy" no painel Emergent — build cloud com Expo web export.

---

## 12. Limitações conhecidas / não implementado

- **Autenticação real**: hoje é 100% fake.
- **Sincronização entre dispositivos**: dados locais apenas.
- **Deletar perfil pelo UI**: função existe no store, sem botão.
- **Editar perfil (nome/idade)**: idem.
- **PIN "Cantinho dos pais"**: botão existe visualmente mas não faz nada.
- **Compartilhar história**: não há.
- **Notificações**: não há.
- **Offline first**: não há service worker de cache — precisa de conexão.
- **Vídeo ("Assistir")**: sempre "em breve".
- **Pagamento / gate Premium**: não há — `camada: "Premium"` no catálogo é ignorado.
- **Reset de senha**: link "Esqueci a senha" é decorativo.
- **Google / Apple login**: botões decorativos.
- **Confirmação de email**: não há.
- **Rate limiting**: nenhum endpoint do backend tem rate limit.
- **Analytics**: nenhum evento é rastreado.
- **Admin panel**: não existe.
- **Refresh de tokens**: não aplicável (sem tokens).

---

## 13. Arquivos-chave para navegação rápida no repositório

| Área | Arquivos principais |
|---|---|
| Backend | `/app/backend/server.py`, `/app/backend/catalogo.json`, `/app/backend/audio/EUV-*.mp3` |
| Rotas | `/app/frontend/app/**/*.tsx` (Expo Router) |
| Splash | `/app/frontend/app/splash.tsx`, `/app/frontend/app/index.tsx` |
| Auth | `/app/frontend/app/auth/entrar.tsx`, `/app/frontend/app/auth/perfis.tsx` |
| Home | `/app/frontend/app/(tabs)/index.tsx` |
| Explorar | `/app/frontend/app/(tabs)/explorar.tsx` |
| Perfil | `/app/frontend/app/(tabs)/perfil.tsx` |
| Layout tabs | `/app/frontend/app/(tabs)/_layout.tsx` |
| História | `/app/frontend/app/historia/[id].tsx` |
| Fim | `/app/frontend/app/historia/fim/[id].tsx` |
| Detalhe universo/valor/coleção | `/app/frontend/app/universo/[nome].tsx`, `/valor/[nome].tsx`, `/colecao.tsx` |
| Busca | `/app/frontend/app/busca.tsx` |
| Sobre | `/app/frontend/app/sobre.tsx` |
| Stores | `/app/frontend/src/store/{profiles,history,favorites,nightMode}.ts` |
| Componentes | `/app/frontend/src/components/{AppHeader,BottomBar,StoryCard,Shelf,ScreenBg,AudioPlayer,KidReader}.tsx` |
| Brand | `/app/frontend/src/components/brand/{MoonMark,Wordmark,UniverseIcon,ValorBadge,StarrySky}.tsx` |
| Design tokens | `/app/frontend/src/theme/tokens.ts` |
| API client | `/app/frontend/src/api/catalog.ts`, `/app/frontend/src/hooks/use-catalog.ts` |

---

**Fim da especificação.**
