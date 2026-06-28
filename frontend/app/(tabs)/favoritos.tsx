// Favoritos locais.
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { AppHeader } from '@/src/components/AppHeader';
import { StoryCard } from '@/src/components/StoryCard';
import { useCatalog } from '@/src/hooks/use-catalog';
import { useFavorites } from '@/src/store/favorites';
import { colors, fonts, spacing } from '@/src/theme/tokens';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const { stories } = useCatalog();
  const { ids, refresh } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const favStories = useMemo(
    () => ids.map((id) => stories.find((s) => s.id === id)).filter(Boolean) as typeof stories,
    [ids, stories],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="favoritos-screen">
      <AppHeader greeting="Favoritos" subtitle="As histórias que viraram tradição em casa" />
      {favStories.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ainda não há favoritas</Text>
          <Text style={styles.emptyText}>
            Toque na estrelinha de uma história para guardá-la aqui. Elas ficam salvas neste dispositivo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favStories}
          keyExtractor={(it) => it.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: spacing.lg }}
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: 120, gap: spacing.md }}
          renderItem={({ item }) => <StoryCard story={item} size="md" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  emptyTitle: { fontFamily: fonts.titulo, color: colors.cremeLencol, fontSize: 22 },
  emptyText: {
    fontFamily: fonts.texto,
    color: colors.lilasSonho,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
