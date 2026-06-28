// Busca + Filtros combináveis.
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '@/src/components/AppHeader';
import { StoryCard } from '@/src/components/StoryCard';
import { useCatalog } from '@/src/hooks/use-catalog';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

type FaixaFilter = 'all' | '3-4 anos' | '4-6 anos' | '3-6 anos (geral)';
type DuracaoFilter = 'all' | 3 | 5;
type FormatoFilter = 'all' | 'audio' | 'video' | 'crianca';

export default function BuscaScreen() {
  const insets = useSafeAreaInsets();
  const { stories, meta } = useCatalog();
  const [q, setQ] = useState('');
  const [valor, setValor] = useState<string | null>(null);
  const [universo, setUniverso] = useState<string | null>(null);
  const [faixa, setFaixa] = useState<FaixaFilter>('all');
  const [duracao, setDuracao] = useState<DuracaoFilter>('all');
  const [formato, setFormato] = useState<FormatoFilter>('all');

  const universos = Object.keys(meta?.universos ?? {});
  const valoresTop = Object.entries(meta?.valores ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([k]) => k);

  const results = useMemo(() => {
    const norm = (s: string) =>
      (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const qq = norm(q.trim());
    return stories.filter((h) => {
      if (qq) {
        const hay = `${norm(h.titulo)} ${norm(h.personagem)}`;
        if (!hay.includes(qq)) return false;
      }
      if (valor) {
        const has =
          h.valor_principal === valor ||
          (h.valores_secundarios ?? '')
            .split(',')
            .map((x) => x.trim())
            .includes(valor);
        if (!has) return false;
      }
      if (universo && h.universo !== universo) return false;
      if (faixa !== 'all' && h.faixa_etaria !== faixa) return false;
      if (duracao !== 'all' && (h.duracao_min ?? 99) > (duracao as number)) return false;
      if (formato === 'audio' && !h.link_audio) return false;
      if (formato === 'video' && !h.link_video) return false;
      if (formato === 'crianca' && !h.texto_simplificado) return false;
      return true;
    });
  }, [stories, q, valor, universo, faixa, duracao, formato]);

  const clearAll = () => {
    setQ('');
    setValor(null);
    setUniverso(null);
    setFaixa('all');
    setDuracao('all');
    setFormato('all');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="busca-screen">
      <AppHeader showBack greeting="Buscar" subtitle="Por título ou personagem" />

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.lilasSonho} />
        <TextInput
          placeholder="Davi, Bela, dragão…"
          placeholderTextColor="rgba(246,239,225,0.5)"
          value={q}
          onChangeText={setQ}
          style={styles.searchInput}
          testID="busca-input"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {(q || valor || universo || faixa !== 'all' || duracao !== 'all' || formato !== 'all') && (
          <Pressable onPress={clearAll} hitSlop={8} testID="busca-clear">
            <Ionicons name="close-circle" size={18} color={colors.lilasSonho} />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FilterGroup title="Universo">
          <Chip label="Todos" active={!universo} onPress={() => setUniverso(null)} />
          {universos.map((u) => (
            <Chip key={u} label={u} active={universo === u} onPress={() => setUniverso(u)} />
          ))}
        </FilterGroup>

        <FilterGroup title="Valor">
          <Chip label="Todos" active={!valor} onPress={() => setValor(null)} />
          {valoresTop.map((v) => (
            <Chip key={v} label={v} active={valor === v} onPress={() => setValor(v)} />
          ))}
        </FilterGroup>

        <FilterGroup title="Faixa etária">
          {(['all', '3-4 anos', '4-6 anos', '3-6 anos (geral)'] as FaixaFilter[]).map((f) => (
            <Chip
              key={f}
              label={f === 'all' ? 'Todas' : f}
              active={faixa === f}
              onPress={() => setFaixa(f)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Duração">
          <Chip label="Qualquer" active={duracao === 'all'} onPress={() => setDuracao('all')} />
          <Chip label="até 3 min" active={duracao === 3} onPress={() => setDuracao(3)} />
          <Chip label="até 5 min" active={duracao === 5} onPress={() => setDuracao(5)} />
        </FilterGroup>

        <FilterGroup title="Formato disponível">
          <Chip label="Qualquer" active={formato === 'all'} onPress={() => setFormato('all')} />
          <Chip label="Tem áudio" active={formato === 'audio'} onPress={() => setFormato('audio')} />
          <Chip label="Tem vídeo" active={formato === 'video'} onPress={() => setFormato('video')} />
          <Chip
            label="Tem texto p/ criança"
            active={formato === 'crianca'}
            onPress={() => setFormato('crianca')}
          />
        </FilterGroup>

        <Text style={styles.resultsCount} testID="busca-count">
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
        </Text>

        <View style={styles.grid}>
          {results.map((h) => (
            <View key={h.id} style={{ marginBottom: spacing.md }}>
              <StoryCard story={h} size="md" />
            </View>
          ))}
          {results.length === 0 && (
            <Text style={styles.empty}>Nada por aqui. Tente afrouxar os filtros.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={fg.wrap}>
      <Text style={fg.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={fg.row}
      >
        {children}
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[chip.base, active ? chip.active : chip.inactive]}
      testID={`chip-${label}`}
    >
      <Text style={[chip.text, active ? chip.textActive : null]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.violetaCrepusculo,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.08)',
  },
  searchInput: {
    flex: 1,
    color: colors.cremeLencol,
    fontFamily: fonts.texto,
    fontSize: 15,
    padding: 0,
  },
  resultsCount: {
    fontFamily: fonts.textoBold,
    color: colors.douradoEstrela,
    fontSize: 13,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  empty: {
    fontFamily: fonts.texto,
    color: colors.lilasSonho,
    textAlign: 'center',
    width: '100%',
    paddingVertical: spacing.xl,
  },
});

const fg = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  title: { fontFamily: fonts.textoExtra, color: colors.cremeLencol, fontSize: 11, paddingHorizontal: spacing.lg, marginBottom: 6, letterSpacing: 0.6 },
  row: { paddingHorizontal: spacing.lg, gap: spacing.sm, height: 56, alignItems: 'center' },
});

const chip = StyleSheet.create({
  base: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
  },
  inactive: { backgroundColor: 'transparent', borderColor: 'rgba(246,239,225,0.18)' },
  active: { backgroundColor: colors.douradoEstrela, borderColor: colors.douradoEstrela },
  text: { fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 12 },
  textActive: { color: colors.noiteAmeixa },
});
