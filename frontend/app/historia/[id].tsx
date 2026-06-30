// Tela da HISTÓRIA — a peça principal.
// Seletor de formato: Ler (adulto), Ler (criança), Ouvir, Assistir.
// Modo Noite acionável aqui.
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  CaretLeft,
  ChatCircleDots,
  Headphones,
  IconProps,
  Moon,
  Play,
  PlayCircle,
  Smiley,
  Sparkle,
  Star,
} from 'phosphor-react-native';

import { api, Historia, valoresSecundariosArr } from '@/src/api/catalog';
import { useFavorites } from '@/src/store/favorites';
import { useNightMode } from '@/src/store/nightMode';
import { colors, fonts, radius, spacing, universoCor } from '@/src/theme/tokens';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { StarrySky } from '@/src/components/brand/StarrySky';
import { UniverseIcon } from '@/src/components/brand/UniverseIcon';
import { ValorBadge } from '@/src/components/brand/ValorBadge';
import { AudioPlayer } from '@/src/components/AudioPlayer';

type Formato = 'adulto' | 'crianca' | 'audio' | 'video';

export default function HistoriaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { night, toggle: toggleNight } = useNightMode();
  const { isFavorite, toggle: toggleFav } = useFavorites();

  const [historia, setHistoria] = useState<Historia | null>(null);
  const [loading, setLoading] = useState(true);
  const [formato, setFormato] = useState<Formato>('adulto');
  const [fontSize, setFontSize] = useState(17);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      let alive = true;
      (async () => {
        try {
          setLoading(true);
          const h = await api.getStory(id);
          if (alive) setHistoria(h);
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, [id]),
  );

  const accent = useMemo(() => universoCor(historia?.universo ?? ''), [historia]);
  const fav = historia ? isFavorite(historia.id) : false;
  const hasCrianca = !!historia?.texto_simplificado;
  const hasAudio = !!historia?.link_audio;
  const hasVideo = !!historia?.link_video;

  // FUTURO: bloqueio Premium aqui (se !user.isPremium && historia.camada === 'Premium')
  //         redireciona para tela de assinatura.

  const bg = night ? colors.noiteProfunda : colors.noiteAmeixa;

  if (loading || !historia) {
    return (
      <View style={[styles.root, { backgroundColor: bg, paddingTop: insets.top }]}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.douradoEstrela} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: bg }]} testID="historia-screen">
      <StarrySky seed={`hist-${historia.id}`} density={38} opacity={night ? 0.2 : 0.1} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View>
          <LinearGradient
            colors={night ? [colors.violetaCrepusculo, colors.noiteProfunda] : [accent, colors.noiteAmeixa]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
          >
            <StarrySky seed={`hist-hero-${historia.id}`} density={32} opacity={0.22} />

            <View style={styles.heroTopRow}>
              <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn} testID="historia-back">
                <CaretLeft size={20} color={colors.cremeLencol} weight="light" />
              </Pressable>
              <View style={{ flex: 1 }} />
              <Pressable
                onPress={toggleNight}
                style={[styles.iconBtn, night ? styles.iconBtnActive : null]}
                hitSlop={10}
                testID="historia-night-toggle"
              >
                <Moon
                  size={20}
                  color={night ? colors.noiteAmeixa : colors.cremeLencol}
                  weight={night ? 'fill' : 'light'}
                />
              </Pressable>
              <Pressable
                onPress={() => toggleFav(historia.id)}
                style={[styles.iconBtn, fav ? styles.iconBtnActive : null]}
                hitSlop={10}
                testID="historia-fav-toggle"
              >
                <Star
                  size={20}
                  color={fav ? colors.noiteAmeixa : colors.cremeLencol}
                  weight={fav ? 'fill' : 'light'}
                />
              </Pressable>
            </View>

            <View style={styles.heroIconRow}>
              <View style={styles.heroIconBubble}>
                <UniverseIcon universo={historia.universo} size={28} color={colors.cremeLencol} weight="light" />
              </View>
              <MoonMark size={28} />
            </View>

            <Text style={styles.eraUmaVez}>Era uma vez</Text>
            <Text style={styles.title}>{historia.titulo}</Text>

            <View style={styles.valorRow}>
              <ValorBadge valor={historia.valor_principal} variant="highlight" />
            </View>

            <View style={styles.metaWrap}>
              <Badge Icon={UniverseIconAsCmp(historia.universo)} text={historia.universo} />
              <Badge Icon={BookOpen} text={historia.colecao} />
              <Badge Icon={Smiley} text={historia.faixa_etaria} />
              <BadgeMoon text={`${historia.duracao_min} min`} />
              {historia.camada === 'Premium' && <Badge Icon={Sparkle} text="Premium" gold />}
            </View>
          </LinearGradient>
        </View>

        {/* PLAYER DE NARRAÇÃO — aparece apenas se a história tem link_audio */}
        {hasAudio && historia.link_audio ? (
          <AudioPlayer url={historia.link_audio} night={night} />
        ) : null}

        {/* SELETOR DE FORMATO */}
        <View style={styles.tabs}>
          <FormatTab label="Ler (adulto)" Icon={BookOpen} active={formato === 'adulto'} onPress={() => setFormato('adulto')} />
          <FormatTab
            label="Ler (criança)"
            Icon={Smiley}
            active={formato === 'crianca'}
            disabled={!hasCrianca}
            onPress={() => hasCrianca && setFormato('crianca')}
          />
          <FormatTab
            label="Ouvir"
            Icon={Headphones}
            active={formato === 'audio'}
            disabled={!hasAudio}
            onPress={() => hasAudio && setFormato('audio')}
          />
          <FormatTab
            label="Assistir"
            Icon={PlayCircle}
            active={formato === 'video'}
            disabled={!hasVideo}
            onPress={() => hasVideo && setFormato('video')}
          />
        </View>

        {/* CONTEÚDO POR FORMATO */}
        <View style={styles.content}>
          {formato === 'adulto' && (
            <>
              <View style={styles.fontControls} testID="font-controls">
                <Text style={styles.controlLabel}>Tamanho do texto</Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Pressable
                    onPress={() => setFontSize((s) => Math.max(14, s - 1))}
                    style={styles.fontBtn}
                    testID="font-decrease"
                  >
                    <Text style={styles.fontBtnText}>A−</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFontSize((s) => Math.min(24, s + 1))}
                    style={styles.fontBtn}
                    testID="font-increase"
                  >
                    <Text style={styles.fontBtnText}>A+</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={[styles.bodyText, { fontSize, lineHeight: fontSize * 1.7 }]} testID="texto-adulto">
                {historia.texto}
              </Text>
            </>
          )}

          {formato === 'crianca' && hasCrianca && (
            <Text style={[styles.bodyText, styles.kidText]} testID="texto-crianca">
              {historia.texto_simplificado}
            </Text>
          )}

          {formato === 'audio' && (
            <View style={styles.player} testID="audio-player">
              <Headphones size={48} color={colors.douradoEstrela} weight="light" />
              <Text style={styles.playerTitle}>Áudio narrado</Text>
              <Text style={styles.playerHint}>
                {hasAudio
                  ? 'Aperte o botão para ouvir.'
                  : 'O áudio chega em breve. Por enquanto, leia em voz alta.'}
              </Text>
              {hasAudio && (
                <Pressable style={styles.playBtn} testID="audio-play-btn">
                  <Play size={18} color={colors.noiteAmeixa} weight="fill" />
                  <Text style={styles.playBtnText}>Tocar</Text>
                </Pressable>
              )}
            </View>
          )}

          {formato === 'video' && (
            <View style={styles.player} testID="video-player">
              <PlayCircle size={48} color={colors.douradoEstrela} weight="light" />
              <Text style={styles.playerTitle}>Vídeo da história</Text>
              <Text style={styles.playerHint}>Em breve. Estamos preparando com carinho.</Text>
            </View>
          )}

          {/* PARA CONVERSAR */}
          {historia.pergunta ? (
            <View style={styles.talkCard} testID="pergunta-card">
              <View style={styles.talkHeader}>
                <ChatCircleDots size={16} color={colors.douradoEstrela} weight="light" />
                <Text style={styles.talkTitle}>Para conversar</Text>
              </View>
              <Text style={styles.talkText}>{historia.pergunta}</Text>
            </View>
          ) : null}

          {/* Valores secundários */}
          {valoresSecundariosArr(historia).length > 0 && (
            <View style={styles.valoresWrap}>
              <Text style={styles.valoresLabel}>Esta história também fala de</Text>
              <View style={styles.valoresChips}>
                {valoresSecundariosArr(historia).map((v) => (
                  <ValorBadge key={v} valor={v} size="sm" variant="on-dark" />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function FormatTab({
  label,
  Icon,
  active,
  disabled,
  onPress,
}: {
  label: string;
  Icon: ComponentType<IconProps>;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        ft.tab,
        active ? ft.tabActive : null,
        disabled ? ft.tabDisabled : null,
      ]}
      testID={`format-tab-${label}`}
    >
      <Icon
        size={16}
        color={active ? colors.noiteAmeixa : disabled ? 'rgba(246,239,225,0.35)' : colors.cremeLencol}
        weight="light"
      />
      <Text style={[ft.tabText, active ? ft.tabTextActive : null, disabled ? ft.tabTextDisabled : null]}>
        {label}
      </Text>
      {disabled ? <Text style={ft.soon}>em breve</Text> : null}
    </Pressable>
  );
}

function Badge({
  Icon,
  text,
  gold,
}: {
  Icon: ComponentType<IconProps>;
  text: string;
  gold?: boolean;
}) {
  return (
    <View style={[badge.b, gold ? badge.gold : null]}>
      <Icon size={11} color={gold ? colors.noiteAmeixa : colors.cremeLencol} weight="light" />
      <Text style={[badge.t, gold ? badge.tGold : null]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function BadgeMoon({ text }: { text: string }) {
  return (
    <View style={badge.b}>
      <MoonMark size={10} />
      <Text style={badge.t} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

// Helper para passar o UniverseIcon como tipo de Icon em <Badge />
function UniverseIconAsCmp(universo: string): ComponentType<IconProps> {
  const Cmp = (props: IconProps) => <UniverseIcon universo={universo} {...props} color={props.color as string} />;
  Cmp.displayName = 'UniverseIconAsCmp';
  return Cmp;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: 'hidden',
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  heroIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  heroIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: { backgroundColor: colors.douradoEstrela },
  eraUmaVez: {
    fontFamily: fonts.tituloNarrativa,
    color: colors.douradoEstrela,
    fontSize: 16,
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: fonts.titulo,
    color: colors.cremeLencol,
    fontSize: 34,
    lineHeight: 38,
    marginTop: 2,
  },
  valorRow: { marginTop: spacing.md, flexDirection: 'row' },
  metaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  content: { padding: spacing.lg },
  fontControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  controlLabel: { color: colors.lilasSonho, fontFamily: fonts.textoBold, fontSize: 11 },
  fontBtn: {
    backgroundColor: colors.violetaCrepusculo,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.25)',
  },
  fontBtnText: { color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 12 },
  bodyText: { fontFamily: fonts.texto, color: colors.cremeLencol },
  kidText: { fontSize: 22, lineHeight: 36, fontFamily: fonts.textoBold, letterSpacing: 0.2 },
  player: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
    backgroundColor: colors.violetaCrepusculo,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.18)',
  },
  playerTitle: { fontFamily: fonts.titulo, color: colors.cremeLencol, fontSize: 20 },
  playerHint: { fontFamily: fonts.texto, color: colors.lilasSonho, textAlign: 'center', paddingHorizontal: spacing.lg },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.douradoEstrela,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  playBtnText: { fontFamily: fonts.textoExtra, color: colors.noiteAmeixa },
  talkCard: {
    backgroundColor: colors.cremeLencol,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    borderWidth: 2,
    borderColor: colors.douradoEstrela,
  },
  talkHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  talkTitle: { fontFamily: fonts.textoExtra, color: colors.noiteAmeixa, fontSize: 12, letterSpacing: 0.6 },
  talkText: { fontFamily: fonts.tituloNarrativa, color: colors.tinta, fontSize: 18, lineHeight: 26 },
  valoresWrap: { marginTop: spacing.xl },
  valoresLabel: { fontFamily: fonts.textoExtra, color: colors.cremeLencol, fontSize: 11, letterSpacing: 0.6, marginBottom: spacing.sm },
  valoresChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});

const ft = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.violetaCrepusculo,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.12)',
  },
  tabActive: { backgroundColor: colors.douradoEstrela, borderColor: colors.douradoEstrela },
  tabDisabled: { opacity: 0.6 },
  tabText: { fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 12 },
  tabTextActive: { color: colors.noiteAmeixa },
  tabTextDisabled: { color: 'rgba(246,239,225,0.6)' },
  soon: { fontFamily: fonts.texto, color: colors.lilasSonho, fontSize: 9, fontStyle: 'italic' },
});

const badge = StyleSheet.create({
  b: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  gold: { backgroundColor: colors.douradoEstrela },
  t: { fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 11 },
  tGold: { color: colors.noiteAmeixa },
});
