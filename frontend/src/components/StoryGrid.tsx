// Lista de histórias com cabeçalho reutilizável (usada por Valor, Universo, Coleção).
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius, spacing } from '@/src/theme/tokens';
import { Historia } from '@/src/api/catalog';
import { StoryCard } from './StoryCard';

export function StoryGrid({
  title,
  subtitle,
  badge,
  accent,
  stories,
  testID,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  accent: string;
  stories: Historia[];
  testID?: string;
}) {
  return (
    <FlatList
      data={stories}
      keyExtractor={(it) => it.id}
      numColumns={3}
      columnWrapperStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
      contentContainerStyle={{ paddingBottom: 140, rowGap: spacing.md }}
      renderItem={({ item }) => <StoryCard story={item} size="sm" />}
      ListHeaderComponent={
        <LinearGradient
          colors={[accent, colors.noiteAmeixa]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {badge ? (
            <View style={styles.badge} testID={`${testID}-badge`}>
              <Ionicons name="moon" size={10} color={colors.douradoEstrela} />
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          <Text style={styles.heroTitle} testID={`${testID}-title`}>{title}</Text>
          {subtitle ? <Text style={styles.heroSub}>{subtitle}</Text> : null}
          <Text style={styles.count} testID={`${testID}-count`}>
            {stories.length} {stories.length === 1 ? 'história' : 'histórias'}
          </Text>
        </LinearGradient>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>Ainda não há histórias aqui. Em breve, mais aventuras!</Text>
      }
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
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
  heroSub: { fontFamily: fonts.tituloNarrativa, color: 'rgba(246,239,225,0.85)', fontSize: 16, marginTop: spacing.xs },
  count: { fontFamily: fonts.textoBold, color: colors.douradoEstrela, fontSize: 12, marginTop: spacing.md },
  empty: {
    fontFamily: fonts.texto,
    color: colors.lilasSonho,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
});
