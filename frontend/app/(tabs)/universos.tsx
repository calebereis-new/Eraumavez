// Navegação por UNIVERSO — mostra cada universo + as coleções dentro.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';

import { AppHeader } from '@/src/components/AppHeader';
import { useCatalog } from '@/src/hooks/use-catalog';
import { colors, fonts, radius, spacing, universoCor } from '@/src/theme/tokens';

export default function Universos() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories, meta } = useCatalog();

  const universos = useMemo(() => {
    const u = meta?.universos ?? {};
    return Object.keys(u).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [meta]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="universos-screen">
      <AppHeader greeting="Universos" subtitle="Mundos onde tudo pode acontecer" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.openBtnText}>Abrir</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.noiteAmeixa} />
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
                    <Ionicons name="chevron-forward" size={14} color={colors.lilasSonho} />
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  universeBlock: { marginBottom: spacing.xl, borderRadius: radius.lg, overflow: 'hidden' },
  universeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
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
  openBtnText: { fontFamily: fonts.textoExtra, color: colors.noiteAmeixa, fontSize: 12 },
  collectionList: { backgroundColor: colors.violetaCrepusculo, padding: spacing.sm },
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
    color: colors.lilasSonho,
    fontSize: 12,
    minWidth: 18,
    textAlign: 'right',
  },
});
