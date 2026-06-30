// Aba EXPLORAR — unifica "Por valor" e "Por universo" com toggle no topo.
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretRight, MagnifyingGlass, Star } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { StarrySky } from '@/src/components/brand/StarrySky';
import { UniverseIcon } from '@/src/components/brand/UniverseIcon';
import { useCatalog } from '@/src/hooks/use-catalog';
import { todosValores, valoresSecundariosArr } from '@/src/api/catalog';
import { colors, fonts, radius, spacing, universoCor } from '@/src/theme/tokens';

type Mode = 'valor' | 'universo';

export default function Explorar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories, meta } = useCatalog();
  const [mode, setMode] = useState<Mode>('valor');

  const valores = useMemo(() => {
    const list = todosValores(stories);
    return list.map((v) => ({
      valor: v,
      count: stories.filter(
        (h) =>
          h.valor_principal === v ||
          valoresSecundariosArr(h).some((x) => x === v),
      ).length,
    }));
  }, [stories]);

  const universos = useMemo(() => {
    const u = meta?.universos ?? {};
    return Object.keys(u).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [meta]);

  return (
    <ScreenBg seed="explorar-bg">
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg }}>
        <Text style={styles.h1}>Explorar</Text>

        {/* SEARCH SHORTCUT */}
        <Pressable
          onPress={() => router.push('/busca')}
          style={styles.searchBtn}
          testID="explorar-search-btn"
        >
          <MagnifyingGlass size={16} color={colors.lavanda} weight="light" />
          <Text style={styles.searchTxt}>Buscar histórias…</Text>
        </Pressable>

        {/* TOGGLE */}
        <View style={styles.toggle} testID="explorar-toggle">
          {(['valor', 'universo'] as const).map((m) => {
            const active = mode === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                testID={`explorar-toggle-${m}`}
              >
                <Text style={[styles.toggleTxt, active && styles.toggleTxtActive]}>
                  Por {m}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {mode === 'valor' ? (
        <FlatList
          data={valores}
          keyExtractor={(it) => it.valor}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 140 }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/valor/[nome]', params: { nome: item.valor } })}
              style={({ pressed }) => [styles.valorRow, { opacity: pressed ? 0.85 : 1 }]}
              testID={`valor-row-${item.valor}`}
            >
              <View style={styles.valorIcon}>
                <Star size={14} color={colors.douradoEstrela} weight="fill" />
              </View>
              <Text style={styles.valorLabel} numberOfLines={1}>
                {item.valor}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countTxt}>{item.count}</Text>
              </View>
              <CaretRight size={16} color={colors.lavanda} weight="light" />
            </Pressable>
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {universos.map((uni) => {
            const colecoes = Object.entries(meta?.universos?.[uni] ?? {}).sort((a, b) =>
              a[0].localeCompare(b[0], 'pt-BR'),
            );
            const total = stories.filter((h) => h.universo === uni).length;
            const accent = universoCor(uni);
            return (
              <View key={uni} style={styles.universeBlock} testID={`universo-block-${uni}`}>
                <LinearGradient
                  colors={[accent, colors.violetaCrepusculo]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.universeHeader}
                >
                  <StarrySky seed={`uni-${uni}`} density={22} opacity={0.22} />
                  <View style={styles.universeIconBubble}>
                    <UniverseIcon universo={uni} size={26} color={colors.cremeLencol} weight="light" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.universeTitle}>{uni}</Text>
                    <Text style={styles.universeMeta}>
                      {total} {total === 1 ? 'história' : 'histórias'} · {colecoes.length} coleção
                      {colecoes.length === 1 ? '' : 'ões'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => router.push({ pathname: '/universo/[nome]', params: { nome: uni } })}
                    hitSlop={10}
                    style={styles.openBtn}
                    testID={`universo-open-${uni}`}
                  >
                    <Text style={styles.openBtnTxt}>Abrir</Text>
                    <CaretRight size={12} color={colors.violetaProfundo} weight="bold" />
                  </Pressable>
                </LinearGradient>
                <View style={styles.collectionList}>
                  {colecoes.slice(0, 5).map(([c, n]) => (
                    <Pressable
                      key={c}
                      onPress={() =>
                        router.push({
                          pathname: '/colecao',
                          params: { universo: uni, colecao: c },
                        })
                      }
                      style={({ pressed }) => [styles.collectionRow, { opacity: pressed ? 0.85 : 1 }]}
                      testID={`colecao-row-${uni}-${c}`}
                    >
                      <View style={[styles.collectionDot, { backgroundColor: accent }]} />
                      <Text style={styles.collectionName} numberOfLines={1}>
                        {c}
                      </Text>
                      <Text style={styles.collectionCount}>{n}</Text>
                      <CaretRight size={12} color={colors.lavanda} weight="light" />
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: fonts.titulo, color: colors.cremeForte, fontSize: 28 },
  searchBtn: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.14)',
  },
  searchTxt: { color: colors.lavanda, fontFamily: fonts.texto, fontSize: 13 },
  toggle: {
    marginTop: spacing.md,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.md,
    padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: radius.sm },
  toggleBtnActive: { backgroundColor: colors.douradoEstrela },
  toggleTxt: { color: colors.lilasSonho, fontFamily: fonts.textoBold, fontSize: 13 },
  toggleTxtActive: { color: colors.violetaProfundo, fontFamily: fonts.textoExtra },

  // Valor rows
  valorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.14)',
    gap: spacing.sm,
  },
  valorIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(233,178,76,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valorLabel: { flex: 1, color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 15 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(246,239,225,0.1)',
  },
  countTxt: { color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 12 },

  // Universe blocks
  universeBlock: { marginBottom: spacing.xl, borderRadius: radius.lg, overflow: 'hidden' },
  universeHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, overflow: 'hidden' },
  universeIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  universeTitle: { fontFamily: fonts.titulo, color: colors.cremeLencol, fontSize: 22 },
  universeMeta: { fontFamily: fonts.texto, color: 'rgba(246,239,225,0.85)', fontSize: 12, marginTop: 2 },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.douradoEstrela,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  openBtnTxt: { fontFamily: fonts.textoExtra, color: colors.violetaProfundo, fontSize: 12 },
  collectionList: { backgroundColor: 'rgba(255,255,255,0.04)', padding: spacing.sm },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  collectionDot: { width: 8, height: 8, borderRadius: 4 },
  collectionName: { flex: 1, fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 13 },
  collectionCount: {
    fontFamily: fonts.textoBold,
    color: colors.lavanda,
    fontSize: 12,
    minWidth: 18,
    textAlign: 'right',
  },
});
