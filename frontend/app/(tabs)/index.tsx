// Home — saudação calorosa e prateleiras estilo streaming.
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Info, MagnifyingGlass } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { AppHeader } from '@/src/components/AppHeader';
import { Shelf } from '@/src/components/Shelf';
import { ScreenBg } from '@/src/components/ScreenBg';
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
  const paraDormir = useMemo(() => {
    const ids = new Set<string>();
    const out = [
      ...historiasPorValor(stories, 'Humildade'),
      ...historiasPorValor(stories, 'Gratidão'),
    ].filter((h) => {
      if (ids.has(h.id)) return false;
      ids.add(h.id);
      return true;
    });
    return out;
  }, [stories]);
  const rapidas = useMemo(() => curtas(stories, 3), [stories]);
  const biblicas = useMemo(() => historiasPorUniverso(stories, 'Bíblicas'), [stories]);
  const herois = useMemo(() => historiasPorUniverso(stories, 'Super-heróis'), [stories]);
  const princesas = useMemo(() => historiasPorUniverso(stories, 'Princesas e Reinos'), [stories]);
  const animais = useMemo(() => historiasPorUniverso(stories, 'Animais'), [stories]);

  return (
    <ScreenBg seed="home-bg">
      <View style={{ paddingTop: insets.top }} testID="home-screen">
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
          <Shelf
            title="Em destaque"
            subtitle="Histórias que abrem o coração"
            stories={destaque}
            size="md"
            testID="shelf-destaque"
          />
          <Shelf
            title="Para dormir tranquilo"
            subtitle="Quietude antes do sono"
            stories={paraDormir.length ? paraDormir : destaque.slice(0, 6)}
            size="md"
            testID="shelf-dormir"
          />
          <Shelf
            title="Histórias rápidas"
            subtitle="Em até 3 minutinhos"
            stories={rapidas}
            size="md"
            testID="shelf-rapidas"
          />
          <Shelf title="Histórias Bíblicas" stories={biblicas} size="md" testID="shelf-biblicas" />
          <Shelf title="Super-heróis" stories={herois} size="md" testID="shelf-herois" />
          <Shelf title="Princesas e Reinos" stories={princesas} size="md" testID="shelf-princesas" />
          <Shelf title="Animais" stories={animais} size="md" testID="shelf-animais" />
        </ScrollView>
      )}
      </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
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
});
