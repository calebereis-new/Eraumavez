// Hook simples para carregar o catálogo uma vez e compartilhar entre telas.
import { useCallback, useEffect, useState } from 'react';
import { api, Historia, Meta } from '@/src/api/catalog';

export function useCatalog() {
  const [stories, setStories] = useState<Historia[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [s, m] = await Promise.all([api.listStories(), api.getMeta()]);
      setStories(s);
      setMeta(m);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar histórias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { stories, meta, loading, error, reload: load };
}
