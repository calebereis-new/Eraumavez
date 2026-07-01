from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import json
import logging
import time
import bcrypt
from pathlib import Path
from typing import Any, Dict, List
from pydantic import BaseModel


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


class UserAuth(BaseModel):
    email: str
    senha: str


if os.environ.get("VERCEL") or os.environ.get("LAMBDA_TASK_ROOT"):
    USERS_PATH = Path("/tmp") / "usuarios.json"
else:
    USERS_PATH = ROOT_DIR / "usuarios.json"


def load_users() -> Dict[str, Any]:
    if not USERS_PATH.exists():
        with open(USERS_PATH, "w", encoding="utf-8") as f:
            json.dump({"usuarios": []}, f)
        return {"usuarios": []}
    try:
        with open(USERS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"usuarios": []}


def save_users(users_data: Dict[str, Any]):
    with open(USERS_PATH, "w", encoding="utf-8") as f:
        json.dump(users_data, f, ensure_ascii=False, indent=2)


def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    pwd_bytes = password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)


@api_router.post("/auth/signup")
async def signup(credentials: UserAuth):
    email = credentials.email.strip().lower()
    senha = credentials.senha
    if not email or not senha:
        raise HTTPException(status_code=400, detail="E-mail e senha são obrigatórios")
    
    users_data = load_users()
    usuarios = users_data.get("usuarios", [])
    
    # Verifica se já existe
    for u in usuarios:
        if u.get("email") == email:
            raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado")
            
    # Cria novo usuário
    hashed = hash_password(senha)
    new_user = {
        "email": email,
        "senha_hash": hashed,
        "id": f"u_{int(time.time())}"
    }
    usuarios.append(new_user)
    users_data["usuarios"] = usuarios
    save_users(users_data)
    return {"message": "Conta criada com sucesso", "email": email}


@api_router.post("/auth/login")
async def login(credentials: UserAuth):
    email = credentials.email.strip().lower()
    senha = credentials.senha
    if not email or not senha:
        raise HTTPException(status_code=400, detail="E-mail e senha são obrigatórios")
        
    users_data = load_users()
    usuarios = users_data.get("usuarios", [])
    
    for u in usuarios:
        if u.get("email") == email:
            if verify_password(senha, u.get("senha_hash", "")):
                return {"token": f"token_{u.get('id')}", "email": email}
            else:
                raise HTTPException(status_code=400, detail="Senha incorreta")
                
    raise HTTPException(status_code=400, detail="Usuário não encontrado")


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
