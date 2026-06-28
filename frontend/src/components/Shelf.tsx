// Prateleira horizontal estilo streaming.
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing } from '@/src/theme/tokens';
import { Historia } from '@/src/api/catalog';
import { StoryCard } from './StoryCard';

export function Shelf({
  title,
  subtitle,
  stories,
  size = 'md',
  onSeeAll,
  testID,
}: {
  title: string;
  subtitle?: string;
  stories: Historia[];
  size?: 'sm' | 'md' | 'lg';
  onSeeAll?: () => void;
  testID?: string;
}) {
  if (!stories || stories.length === 0) return null;
  return (
    <View style={styles.wrap} testID={testID}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onSeeAll && (
          <Pressable onPress={onSeeAll} hitSlop={10} style={styles.seeAll} testID={`shelf-see-all-${title}`}>
            <Text style={styles.seeAllText}>Ver mais</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.douradoEstrela} />
          </Pressable>
        )}
      </View>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <StoryCard story={item} size={size} />}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.titulo,
    color: colors.cremeLencol,
    fontSize: 22,
    lineHeight: 26,
  },
  subtitle: {
    fontFamily: fonts.texto,
    color: colors.lilasSonho,
    fontSize: 12,
    marginTop: 2,
  },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { color: colors.douradoEstrela, fontFamily: fonts.textoBold, fontSize: 12 },
  list: { paddingHorizontal: spacing.lg },
});
