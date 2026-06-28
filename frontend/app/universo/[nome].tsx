// Tela: histórias de UM universo (todas, sem filtrar por coleção).
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '@/src/components/AppHeader';
import { Shelf } from '@/src/components/Shelf';
import { useCatalog } from '@/src/hooks/use-catalog';
import {
  colecoesDoUniverso,
  historiasPorColecao,
  historiasPorUniverso,
} from '@/src/api/catalog';
import { colors, fonts, radius, spacing, universoCor } from '@/src/theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';

export default function UniversoScreen() {
  const { nome } = useLocalSearchParams<{ nome: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories } = useCatalog();

  const uni = nome ?? '';
  const all = useMemo(() => historiasPorUniverso(stories, uni), [stories, uni]);
  const colecoes = useMemo(() => colecoesDoUniverso(stories, uni), [stories, uni]);
  const accent = universoCor(uni);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="universo-screen">
      <AppHeader showBack />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[accent, colors.noiteAmeixa]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.badge}>
            <Ionicons name="planet" size={10} color={colors.douradoEstrela} />
            <Text style={styles.badgeText}>UNIVERSO</Text>
          </View>
          <Text style={styles.heroTitle}>{uni}</Text>
          <Text style={styles.count}>
            {all.length} {all.length === 1 ? 'história' : 'histórias'} · {colecoes.length} coleção
            {colecoes.length === 1 ? '' : 'ões'}
          </Text>
        </LinearGradient>

        <View style={styles.collectionChips}>
          {colecoes.map((c) => (
            <Pressable
              key={c}
              onPress={() =>
                router.push({ pathname: '/colecao', params: { universo: uni, colecao: c } })
              }
              style={styles.chip}
              testID={`universo-chip-${c}`}
            >
              <Text style={styles.chipText}>{c}</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.cremeLencol} />
            </Pressable>
          ))}
        </View>

        {colecoes.map((c) => (
          <Shelf
            key={c}
            title={c}
            stories={historiasPorColecao(stories, uni, c)}
            size="md"
            onSeeAll={() =>
              router.push({ pathname: '/colecao', params: { universo: uni, colecao: c } })
            }
            testID={`universo-shelf-${c}`}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  badgeText: { fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 10, letterSpacing: 0.5 },
  heroTitle: { fontFamily: fonts.titulo, color: colors.cremeLencol, fontSize: 32, lineHeight: 36 },
  count: { fontFamily: fonts.textoBold, color: colors.douradoEstrela, fontSize: 12, marginTop: spacing.sm },
  collectionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.violetaCrepusculo,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.25)',
  },
  chipText: { color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 12 },
});
