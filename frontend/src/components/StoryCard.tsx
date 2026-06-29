// Card de história — sistema de capas por seção (conforme guia de marca):
// Moldura ameixa · painel superior na cor da seção com ícone-tema grande +
// estrelinhas · painel inferior creme com "Era uma vez", título Cormorant em
// tinta escura, selo de valor e duração. Cumpre a regra 60-30-10 e dá contraste.
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

// Cards mais compactos e padronizados. Diferença sutil de tamanho para hierarquia
// (destaque um pouco maior), mas todos com a mesma proporção/aspecto.
const DIMS: Record<Size, { w: number; h: number; topH: number; titleSize: number }> = {
  sm: { w: 114, h: 172, topH: 82, titleSize: 13 },
  md: { w: 122, h: 184, topH: 88, titleSize: 14 },
  lg: { w: 138, h: 208, topH: 100, titleSize: 15 },
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
  const { w, h, topH, titleSize } = DIMS[size];
  const accent = universoCor(story.universo);
  const hasImg = !!story.link_imagem;

  return (
    <Pressable
      testID={testID ?? `story-card-${story.id}`}
      onPress={() => router.push(`/historia/${story.id}`)}
      style={({ pressed }) => [
        styles.card,
        { width: w, height: h, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {/* PAINEL SUPERIOR — cor da seção + arte */}
      <View style={[styles.top, { height: topH, backgroundColor: accent }]}>
        {hasImg ? (
          <Image source={{ uri: story.link_imagem }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <>
            <LinearGradient
              colors={[accent, shade(accent)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <StarrySky seed={`tc-${story.id}`} density={size === 'sm' ? 14 : 22} opacity={0.45} starColor={colors.cremeLencol} />
            {/* ícone-tema grande como arte de fundo */}
            {/* ícone-tema grande como arte de fundo */}
            <View style={[styles.heroIconWrap, styles.noPointer, { right: -8, bottom: -6 }]}>
              <UniverseIcon
                universo={story.universo}
                size={size === 'lg' ? 78 : size === 'md' ? 70 : 64}
                color="rgba(246,239,225,0.5)"
                weight="light"
              />
            </View>
            {/* lua-berço no canto */}
            <View style={[styles.moonCorner, styles.noPointer]}>
              <MoonMark size={size === 'sm' ? 14 : 16} />
            </View>
          </>
        )}
      </View>

      {/* DIVISOR DOURADO */}
      <View style={styles.divider} />

      {/* PAINEL INFERIOR — creme com tipografia hierárquica */}
      <View style={styles.bottom}>
        <Text style={styles.eraUmaVez}>Era uma vez</Text>
        <Text numberOfLines={2} style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.15 }]}>
          {story.titulo}
        </Text>
        <View style={styles.metaRow}>
          <ValorBadge valor={story.valor_principal} size="sm" variant="on-light" />
          <View style={styles.timeBadge}>
            <MoonMark size={9} color={colors.tinta} />
            <Text style={styles.timeText}>{story.duracao_min}m</Text>
          </View>
        </View>
        {story.camada === 'Premium' && (
          <View style={styles.premiumBadge}>
            <Sparkle size={9} color={colors.noiteAmeixa} weight="fill" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

// Escurece levemente uma cor hex (#RRGGBB)
function shade(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((n >> 16) & 255) - 36);
  const g = Math.max(0, ((n >> 8) & 255) - 36);
  const b = Math.max(0, (n & 255) - 36);
  return `rgb(${r},${g},${b})`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.cremeLencol,
    borderWidth: 2,
    borderColor: colors.noiteAmeixa,
    ...shadows.card,
  },
  top: { width: '100%', overflow: 'hidden', position: 'relative' },
  noPointer: { pointerEvents: 'none' },
  moonCorner: { position: 'absolute', top: 10, left: 10 },
  heroIconWrap: { position: 'absolute' },
  divider: { height: 2, backgroundColor: colors.douradoEstrela },
  bottom: {
    flex: 1,
    backgroundColor: colors.cremeLencol,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  eraUmaVez: {
    fontFamily: fonts.tituloNarrativa,
    color: colors.douradoEstrela,
    fontSize: 10,
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  title: {
    fontFamily: fonts.titulo,
    color: colors.tinta,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(42,24,68,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  timeText: { color: colors.tinta, fontFamily: fonts.textoBold, fontSize: 10 },
  premiumBadge: {
    position: 'absolute',
    top: -16,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.douradoEstrela,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cremeLencol,
  },
  premiumText: { color: colors.noiteAmeixa, fontFamily: fonts.textoExtra, fontSize: 9 },
});
