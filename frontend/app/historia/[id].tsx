// Tela da HISTÓRIA — a peça principal.
// Seletor de formato: Ler (adulto), Ler (criança), Ouvir, Assistir.
// Modo Noite acionável aqui.
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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

import { api, Historia, valoresSecundariosArr } from '@/src/api/catalog';
import { useFavorites } from '@/src/store/favorites';
import { useNightMode } from '@/src/store/nightMode';
import { colors, fonts, radius, spacing, universoCor } from '@/src/theme/tokens';

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <LinearGradient
          colors={night ? [colors.violetaCrepusculo, colors.noiteProfunda] : [accent, colors.noiteAmeixa]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
        >
          <View style={styles.heroTopRow}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn} testID="historia-back">
              <Ionicons name="chevron-back" size={22} color={colors.cremeLencol} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={toggleNight}
              style={[styles.iconBtn, night ? styles.iconBtnActive : null]}
              hitSlop={10}
              testID="historia-night-toggle"
            >
              <Ionicons
                name={night ? 'moon' : 'moon-outline'}
                size={20}
                color={night ? colors.noiteAmeixa : colors.cremeLencol}
              />
            </Pressable>
            <Pressable
              onPress={() => toggleFav(historia.id)}
              style={[styles.iconBtn, fav ? styles.iconBtnActive : null]}
              hitSlop={10}
              testID="historia-fav-toggle"
            >
              <Ionicons
                name={fav ? 'star' : 'star-outline'}
                size={20}
                color={fav ? colors.noiteAmeixa : colors.cremeLencol}
              />
            </Pressable>
          </View>

          <Text style={styles.eraUmaVez}>Era uma vez</Text>
          <Text style={styles.title}>{historia.titulo}</Text>

          <View style={styles.metaWrap}>
            <Badge icon="planet" text={historia.universo} />
            <Badge icon="bookmark" text={historia.colecao} />
            <Badge icon="heart" text={historia.valor_principal} highlight />
            <Badge icon="happy" text={historia.faixa_etaria} />
            <Badge icon="moon" text={`${historia.duracao_min} min`} />
            {historia.camada === 'Premium' && <Badge icon="sparkles" text="Premium" gold />}
          </View>
        </LinearGradient>

        {/* SELETOR DE FORMATO */}
        <View style={styles.tabs}>
          <FormatTab label="Ler (adulto)" icon="book" active={formato === 'adulto'} onPress={() => setFormato('adulto')} />
          <FormatTab
            label="Ler (criança)"
            icon="happy"
            active={formato === 'crianca'}
            disabled={!hasCrianca}
            onPress={() => hasCrianca && setFormato('crianca')}
          />
          <FormatTab
            label="Ouvir"
            icon="headset"
            active={formato === 'audio'}
            disabled={!hasAudio}
            onPress={() => hasAudio && setFormato('audio')}
          />
          <FormatTab
            label="Assistir"
            icon="play-circle"
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
              <Ionicons name="headset" size={48} color={colors.douradoEstrela} />
              <Text style={styles.playerTitle}>Áudio narrado</Text>
              <Text style={styles.playerHint}>
                {hasAudio
                  ? 'Aperte o botão para ouvir.'
                  : 'O áudio chega em breve. Por enquanto, leia em voz alta.'}
              </Text>
              {hasAudio && (
                <Pressable style={styles.playBtn} testID="audio-play-btn">
                  <Ionicons name="play" size={20} color={colors.noiteAmeixa} />
                  <Text style={styles.playBtnText}>Tocar</Text>
                </Pressable>
              )}
            </View>
          )}

          {formato === 'video' && (
            <View style={styles.player} testID="video-player">
              <Ionicons name="play-circle" size={48} color={colors.douradoEstrela} />
              <Text style={styles.playerTitle}>Vídeo da história</Text>
              <Text style={styles.playerHint}>Em breve. Estamos preparando com carinho.</Text>
            </View>
          )}

          {/* PARA CONVERSAR */}
          {historia.pergunta ? (
            <View style={styles.talkCard} testID="pergunta-card">
              <View style={styles.talkHeader}>
                <Ionicons name="chatbubble-ellipses" size={16} color={colors.douradoEstrela} />
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
                  <View key={v} style={styles.valoresChip}>
                    <Ionicons name="heart" size={10} color={colors.douradoEstrela} />
                    <Text style={styles.valoresChipText}>{v}</Text>
                  </View>
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
  icon,
  active,
  disabled,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
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
      <Ionicons
        name={icon}
        size={16}
        color={active ? colors.noiteAmeixa : disabled ? 'rgba(246,239,225,0.35)' : colors.cremeLencol}
      />
      <Text style={[ft.tabText, active ? ft.tabTextActive : null, disabled ? ft.tabTextDisabled : null]}>
        {label}
      </Text>
      {disabled ? <Text style={ft.soon}>em breve</Text> : null}
    </Pressable>
  );
}

function Badge({
  icon,
  text,
  highlight,
  gold,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  highlight?: boolean;
  gold?: boolean;
}) {
  return (
    <View style={[badge.b, highlight ? badge.highlight : null, gold ? badge.gold : null]}>
      <Ionicons
        name={icon}
        size={11}
        color={gold ? colors.noiteAmeixa : colors.cremeLencol}
      />
      <Text style={[badge.t, gold ? badge.tGold : null]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
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
  valoresChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(233,178,76,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.3)',
  },
  valoresChipText: { fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 11 },
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
  highlight: { borderWidth: 1, borderColor: colors.douradoEstrela },
  gold: { backgroundColor: colors.douradoEstrela },
  t: { fontFamily: fonts.textoBold, color: colors.cremeLencol, fontSize: 11 },
  tGold: { color: colors.noiteAmeixa },
});
