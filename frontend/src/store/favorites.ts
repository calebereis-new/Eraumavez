// Favoritos locais (MVP — sem conta de usuário).
// FUTURO: migrar para perfis de filhos no backend.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY = '@euv:favorites:v1';

async function read(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(ids: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const list = await read();
    setIds(list);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(async (id: string) => {
    const list = await read();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    await write(next);
    setIds(next);
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ready, toggle, isFavorite, refresh };
}
