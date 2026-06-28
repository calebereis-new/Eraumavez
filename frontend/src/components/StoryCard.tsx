// Card de história com fallback elegante quando não há link_imagem.
// Mantém proporções constantes para alinhar prateleiras.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius, shadows, spacing, universoCor } from '@/src/theme/tokens';
import { Historia } from '@/src/api/catalog';

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
  const titleSize = size === 'lg' ? 18 : size === 'md' ? 16 : 14;

  return (
    <Pressable
      testID={testID ?? `story-card-${story.id}`}
      onPress={() => router.push(`/historia/${story.id}`)}
      style={({ pressed }) => [
        styles.card,
        { width: w, height: h, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {hasImg ? (
        <Image source={{ uri: story.link_imagem }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <LinearGradient
          colors={[accent, colors.noiteAmeixa]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* moldura/estrelinhas decorativas */}
      <View style={styles.starsLayer} pointerEvents="none">
        <Ionicons name="star" size={10} color={colors.douradoEstrela} style={{ position: 'absolute', top: 10, right: 12, opacity: 0.85 }} />
        <Ionicons name="star" size={6} color={colors.douradoEstrela} style={{ position: 'absolute', top: 26, right: 24, opacity: 0.6 }} />
        <Ionicons name="star" size={8} color={colors.douradoEstrela} style={{ position: 'absolute', top: 42, right: 14, opacity: 0.4 }} />
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
        <View style={styles.metaRow}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <Text style={styles.meta} numberOfLines={1}>
            {story.valor_principal}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.timeBadge}>
            <Ionicons name="moon" size={10} color={colors.cremeLencol} />
            <Text style={styles.timeText}>{story.duracao_min} min</Text>
          </View>
          {story.camada === 'Premium' && (
            <View style={styles.premiumBadge}>
              <Ionicons name="sparkles" size={10} color={colors.noiteAmeixa} />
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
    ...shadows.card,
  },
  starsLayer: { ...StyleSheet.absoluteFillObject },
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' },
  inner: { flex: 1, padding: spacing.md, justifyContent: 'flex-end' },
  eraUmaVez: {
    fontFamily: fonts.tituloNarrativa,
    fontSize: 12,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.titulo,
    color: colors.cremeLencol,
    lineHeight: 22,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  meta: { fontFamily: fonts.texto, color: colors.cremeLencol, opacity: 0.85, fontSize: 11, flex: 1 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
