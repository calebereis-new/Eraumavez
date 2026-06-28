// Card de história enriquecido: céu pontilhado, lua-berço, ícone do universo, selo de valor.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Sparkle } from 'phosphor-react-native';

import { colors, fonts, radius, shadows, spacing, universoCor } from '@/src/theme/tokens';
import { Historia } from '@/src/api/catalog';
import { MoonMark } from './brand/MoonMark';
import { StarrySky } from './brand/StarrySky';
import { UniverseIcon } from './brand/UniverseIcon';
import { ValorBadge } from './brand/ValorBadge';

type Size = 'sm' | 'md' | 'lg';

const DIMS: Record<Size, { w: number; h: number }> = {
  sm: { w: 130, h: 180 },
  md: { w: 156, h: 216 },
  lg: { w: 192, h: 268 },
};

export function StoryCard({
  story,
  size = 'md',
  testID,
}: {
  story: Historia;
  size?: Size;
  testID?: string;
}) {
  const router = useRouter();
  const { w, h } = DIMS[size];
  const accent = universoCor(story.universo);
  const hasImg = !!story.link_imagem;
  const titleSize = size === 'lg' ? 19 : size === 'md' ? 16 : 14;

  return (
    <Pressable
      testID={testID ?? `story-card-${story.id}`}
      onPress={() => router.push(`/historia/${story.id}`)}
      style={({ pressed }) => [
        styles.card,
        { width: w, height: h, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {hasImg ? (
        <Image source={{ uri: story.link_imagem }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <>
          <LinearGradient
            colors={[accent, colors.violetaCrepusculo, colors.noiteAmeixa]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <StarrySky seed={story.id} density={size === 'sm' ? 18 : 28} opacity={0.28} />
        </>
      )}

      {/* lua-berço no canto */}
      <View style={styles.moonCorner} pointerEvents="none">
        <MoonMark size={size === 'sm' ? 18 : 22} />
      </View>

      {/* ícone-tema do universo */}
      <View style={styles.universeCorner} pointerEvents="none">
        <UniverseIcon universo={story.universo} size={size === 'sm' ? 14 : 16} color={colors.cremeLencol} weight="light" />
      </View>

      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(23,10,40,0.92)"]}
        style={styles.shade}
      />

      <View style={styles.inner}>
        <Text style={[styles.eraUmaVez, { color: colors.douradoEstrela }]}>Era uma vez</Text>
        <Text numberOfLines={2} style={[styles.title, { fontSize: titleSize }]}>
          {story.titulo}
        </Text>
        <View style={{ marginTop: 6, alignItems: 'flex-start' }}>
          <ValorBadge valor={story.valor_principal} size="sm" variant="on-dark" />
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.timeBadge}>
            <MoonMark size={9} />
            <Text style={styles.timeText}>{story.duracao_min} min</Text>
          </View>
          {story.camada === 'Premium' && (
            <View style={styles.premiumBadge}>
              <Sparkle size={9} color={colors.noiteAmeixa} weight="fill" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.violetaCrepusculo,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.18)',
    ...shadows.card,
  },
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '72%' },
  moonCorner: { position: 'absolute', top: 10, left: 10 },
  universeCorner: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.18)',
  },
  inner: { flex: 1, padding: spacing.md, justifyContent: 'flex-end' },
  eraUmaVez: {
    fontFamily: fonts.tituloNarrativa,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.titulo,
    color: colors.cremeLencol,
    lineHeight: 22,
  },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  timeText: { color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 10 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.douradoEstrela,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  premiumText: { color: colors.noiteAmeixa, fontFamily: fonts.textoExtra, fontSize: 9 },
});
