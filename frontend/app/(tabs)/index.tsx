// Home — saudação calorosa e prateleiras estilo streaming.
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Info, MagnifyingGlass, Planet, Star } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { AppHeader } from '@/src/components/AppHeader';
import { Shelf } from '@/src/components/Shelf';
import { StarrySky } from '@/src/components/brand/StarrySky';
import { useCatalog } from '@/src/hooks/use-catalog';
import {
  curtas,
  destaques,
  historiasPorUniverso,
  historiasPorValor,
} from '@/src/api/catalog';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

function saudacao(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories, loading, error } = useCatalog();

  const destaque = useMemo(() => destaques(stories), [stories]);
  const paraDormir = useMemo(
    () => historiasPorValor(stories, 'Humildade').concat(historiasPorValor(stories, 'Gratidão')),
    [stories],
  );
  const rapidas = useMemo(() => curtas(stories, 3), [stories]);
  const biblicas = useMemo(() => historiasPorUniverso(stories, 'Bíblicas'), [stories]);
  const herois = useMemo(() => historiasPorUniverso(stories, 'Super-heróis'), [stories]);
  const princesas = useMemo(() => historiasPorUniverso(stories, 'Princesas e Reinos'), [stories]);
  const animais = useMemo(() => historiasPorUniverso(stories, 'Animais'), [stories]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="home-screen">
      <StarrySky seed="home-bg" density={42} opacity={0.14} />
      <AppHeader
        greeting={`${saudacao()}!`}
        subtitle="Qual história hoje?"
        testID="home-header"
        rightSlot={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => router.push('/sobre')}
              style={styles.searchBtn}
              hitSlop={10}
              testID="home-sobre-button"
            >
              <Info size={20} color={colors.cremeLencol} weight="light" />
            </Pressable>
            <Pressable
              onPress={() => router.push('/busca')}
              style={styles.searchBtn}
              hitSlop={10}
              testID="home-search-button"
            >
              <MagnifyingGlass size={20} color={colors.cremeLencol} weight="light" />
            </Pressable>
          </View>
        }
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.douradoEstrela} />
          <Text style={styles.muted}>Acendendo as estrelas…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Não consegui acordar o catálogo.</Text>
          <Text style={styles.muted}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          testID="home-scroll"
        >
          {/* atalhos */}
          <View style={styles.shortcuts}>
            <Pressable
              onPress={() => router.push('/(tabs)/valores')}
              style={[styles.shortcut, { backgroundColor: colors.violetaCrepusculo }]}
              testID="shortcut-valores"
            >
              <Heart size={18} color={colors.douradoEstrela} weight="light" />
              <Text style={styles.shortcutText}>Por valor</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/universos')}
              style={[styles.shortcut, { backgroundColor: colors.violetaCrepusculo }]}
              testID="shortcut-universos"
            >
              <Planet size={18} color={colors.douradoEstrela} weight="light" />
              <Text style={styles.shortcutText}>Por universo</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/favoritos')}
              style={[styles.shortcut, { backgroundColor: colors.violetaCrepusculo }]}
              testID="shortcut-favoritos"
            >
              <Star size={18} color={colors.douradoEstrela} weight="light" />
              <Text style={styles.shortcutText}>Favoritos</Text>
            </Pressable>
          </View>

          <Shelf
            title="Em destaque"
            subtitle="Histórias que abrem o coração"
            stories={destaque}
            size="lg"
            testID="shelf-destaque"
          />
          <Shelf
            title="Para dormir tranquilo"
            subtitle="Quietude antes do sono"
            stories={paraDormir.length ? paraDormir : destaque.slice(0, 6)}
            testID="shelf-dormir"
          />
          <Shelf
            title="Histórias rápidas"
            subtitle="Em até 3 minutinhos"
            stories={rapidas}
            size="sm"
            testID="shelf-rapidas"
          />
          <Shelf title="Histórias Bíblicas" stories={biblicas} testID="shelf-biblicas" />
          <Shelf title="Super-heróis" stories={herois} testID="shelf-herois" />
          <Shelf title="Princesas e Reinos" stories={princesas} testID="shelf-princesas" />
          <Shelf title="Animais" stories={animais} testID="shelf-animais" />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  muted: { color: colors.lilasSonho, fontFamily: fonts.texto },
  errorText: { color: colors.coralEntardecer, fontFamily: fonts.textoBold, fontSize: 16 },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcuts: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  shortcut: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.18)',
  },
  shortcutText: { color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 12 },
});
