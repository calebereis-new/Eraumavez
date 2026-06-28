// Centraliza acesso ao backend. Toda chamada usa EXPO_PUBLIC_BACKEND_URL.

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export type Historia = {
  id: string;
  titulo: string;
  universo: string;
  colecao: string;
  personagem: string;
  valor_principal: string;
  valores_secundarios: string;
  faixa_etaria: string;
  duracao_min: number;
  texto: string;
  texto_simplificado: string;
  pergunta: string;
  link_audio: string;
  link_video: string;
  link_imagem: string;
  camada: 'Grátis' | 'Premium' | string;
  data_criacao?: string;
  status?: string;
};

export type Meta = {
  total: number;
  universos: Record<string, Record<string, number>>;
  valores: Record<string, number>;
  faixas_etarias: Record<string, number>;
};

async function jget<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  listStories: () => jget<Historia[]>('/stories'),
  getStory: (id: string) => jget<Historia>(`/stories/${id}`),
  getMeta: () => jget<Meta>('/meta'),
};

// Helpers de derivação no cliente -----------------------------------------

export function valoresSecundariosArr(h: Historia): string[] {
  return (h.valores_secundarios || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function todosValores(historias: Historia[]): string[] {
  const set = new Set<string>();
  for (const h of historias) {
    if (h.valor_principal) set.add(h.valor_principal);
    for (const v of valoresSecundariosArr(h)) set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function historiasPorValor(historias: Historia[], valor: string): Historia[] {
  const v = valor.toLowerCase();
  return historias.filter(
    (h) =>
      (h.valor_principal || '').toLowerCase() === v ||
      valoresSecundariosArr(h).some((x) => x.toLowerCase() === v),
  );
}

export function historiasPorUniverso(historias: Historia[], universo: string): Historia[] {
  return historias.filter((h) => h.universo === universo);
}

export function colecoesDoUniverso(historias: Historia[], universo: string): string[] {
  const set = new Set<string>();
  for (const h of historias) {
    if (h.universo === universo && h.colecao) set.add(h.colecao);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function historiasPorColecao(
  historias: Historia[],
  universo: string,
  colecao: string,
): Historia[] {
  return historias.filter((h) => h.universo === universo && h.colecao === colecao);
}

export function curtas(historias: Historia[], maxMin = 3): Historia[] {
  return historias.filter((h) => (h.duracao_min ?? 99) <= maxMin);
}

export function destaques(historias: Historia[]): Historia[] {
  // Pequena curadoria por mistura de universos. Embaralhamento estável.
  const seenU = new Set<string>();
  const ordered: Historia[] = [];
  for (const h of historias) {
    if (!seenU.has(h.universo)) {
      ordered.push(h);
      seenU.add(h.universo);
    }
  }
  for (const h of historias) {
    if (!ordered.includes(h)) ordered.push(h);
  }
  return ordered.slice(0, 10);
}
