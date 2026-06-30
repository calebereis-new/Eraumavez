from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import json
import logging
from pathlib import Path
from typing import Any, Dict, List


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---- Catalog loading (in-memory; reload from disk on each startup) ----
CATALOG_PATH = ROOT_DIR / "catalogo.json"


def load_catalog() -> Dict[str, Any]:
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


CATALOG = load_catalog()

# Create the main app without a prefix
app = FastAPI(title="Era Uma Vez API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {
        "message": "Era Uma Vez API",
        "marca": CATALOG.get("marca"),
        "versao_catalogo": CATALOG.get("versao_catalogo"),
        "total": CATALOG.get("total"),
    }


@api_router.get("/catalog")
async def get_catalog() -> Dict[str, Any]:
    """Return the full catalog (metadata + stories).

    The frontend filters/sorts client-side. This keeps the API simple and
    leaves room for future filtering endpoints when the catalog grows.
    """
    return CATALOG


@api_router.get("/stories")
async def list_stories() -> List[Dict[str, Any]]:
    return CATALOG.get("historias", [])


@api_router.get("/stories/{story_id}")
async def get_story(story_id: str) -> Dict[str, Any]:
    for h in CATALOG.get("historias", []):
        if h.get("id") == story_id:
            return h
    raise HTTPException(status_code=404, detail="História não encontrada")


@api_router.get("/meta")
async def get_meta() -> Dict[str, Any]:
    """Aggregated metadata to help the UI render section / value lists fast."""
    historias = CATALOG.get("historias", [])
    universos: Dict[str, Dict[str, int]] = {}
    valores: Dict[str, int] = {}
    faixas: Dict[str, int] = {}
    for h in historias:
        u = h.get("universo") or "Outros"
        c = h.get("colecao") or "Geral"
        universos.setdefault(u, {}).setdefault(c, 0)
        universos[u][c] += 1
        vp = h.get("valor_principal") or "Outros"
        valores[vp] = valores.get(vp, 0) + 1
        fe = h.get("faixa_etaria") or "3-6 anos (geral)"
        faixas[fe] = faixas.get(fe, 0) + 1
    return {
        "total": len(historias),
        "universos": universos,
        "valores": valores,
        "faixas_etarias": faixas,
    }


AUDIO_DIR = ROOT_DIR / "audio"


@api_router.get("/audio/{story_id}.mp3")
async def get_audio(story_id: str):
    """Serve um arquivo MP3 cujo nome bate com o id da história."""
    # Sanitização básica do id (sem barras / .. )
    if "/" in story_id or ".." in story_id or "\\" in story_id:
        raise HTTPException(status_code=400, detail="ID inválido")
    fpath = AUDIO_DIR / f"{story_id}.mp3"
    if not fpath.is_file():
        raise HTTPException(status_code=404, detail="Áudio não encontrado")
    return FileResponse(
        path=str(fpath),
        media_type="audio/mpeg",
        headers={"Accept-Ranges": "bytes", "Cache-Control": "public, max-age=86400"},
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
logger.info("Catalog loaded: %s stories", len(CATALOG.get("historias", [])))


# --------------------------------------------------------------------------
# FUTURE (post-MVP) — kept here as a roadmap, intentionally NOT implemented:
#   - /api/auth/*                  → login/cadastro de pais
#   - /api/profiles/*              → perfis dos filhos (nome, idade, avatar)
#   - /api/subscription/*          → camada gratuita vs. premium + pagamento
#   - /api/history/*               → "já lidas" e recomendações
#   - /api/sync/*                  → sincronização entre dispositivos
# --------------------------------------------------------------------------
