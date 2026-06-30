// Histórico de histórias lidas/ouvidas por perfil, com Gostei/Não gostei.
// Calcula stats (n° lidas, sequência de noites, valores explorados).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = '@euv:history:v1';

export type LikeState = 'like' | 'dislike' | null;

export type HistoryEntry = {
  storyId: string;
  storyTitulo: string;
  universo: string;
  valor: string;
  duracao: number;
  whenISO: string;
  like: LikeState;
};

type Db = Record<string /* profileId */, HistoryEntry[]>;

async function read(): Promise<Db> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed != null ? (parsed as Db) : {};
  } catch (err) {
    console.warn('[history] read failed', err);
    return {};
  }
}

async function write(db: Db): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(db));
}

export async function logRead(
  profileId: string,
  entry: Omit<HistoryEntry, 'whenISO' | 'like'> & { like?: LikeState },
): Promise<void> {
  const db = await read();
  const list = db[profileId] ?? [];
  // Se já há entry com mesmo storyId no mesmo dia, atualiza no lugar.
  const today = new Date().toISOString().slice(0, 10);
  const idx = list.findIndex((e) => e.storyId === entry.storyId && e.whenISO.slice(0, 10) === today);
  const next: HistoryEntry = {
    ...entry,
    like: entry.like ?? null,
    whenISO: new Date().toISOString(),
  };
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  db[profileId] = list.slice(0, 500); // cap
  await write(db);
}

export async function setLike(profileId: string, storyId: string, like: LikeState): Promise<void> {
  const db = await read();
  const list = db[profileId] ?? [];
  // atualiza a entry mais recente para o storyId
  const idx = list.findIndex((e) => e.storyId === storyId);
  if (idx >= 0) {
    list[idx] = { ...list[idx], like };
    db[profileId] = list;
    await write(db);
  }
}

export async function listHistory(profileId: string): Promise<HistoryEntry[]> {
  const db = await read();
  return db[profileId] ?? [];
}

export function computeStats(entries: HistoryEntry[]): { total: number; streak: number; valores: number } {
  const total = entries.length;
  const valoresSet = new Set(entries.map((e) => e.valor).filter(Boolean));
  // Sequência de noites: dias únicos consecutivos até hoje.
  const dias = new Set(entries.map((e) => e.whenISO.slice(0, 10)));
  let streak = 0;
  const cur = new Date();
  for (let i = 0; i < 365; i += 1) {
    const k = cur.toISOString().slice(0, 10);
    if (dias.has(k)) {
      streak += 1;
      cur.setDate(cur.getDate() - 1);
    } else {
      // se o dia 0 (hoje) está vazio mas ontem tem, ainda contamos a partir de ontem.
      if (i === 0) {
        cur.setDate(cur.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return { total, streak, valores: valoresSet.size };
}

export function useHistory(profileId: string | null) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!profileId) {
      setEntries([]);
      setReady(true);
      return;
    }
    const list = await listHistory(profileId);
    setEntries(list);
    setReady(true);
  }, [profileId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { entries, ready, refresh };
}
