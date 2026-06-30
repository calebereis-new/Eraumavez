// Player de áudio para narração das histórias.
// Web-first (PWA): usa HTMLAudioElement. Em nativo cai num aviso visual,
// pois o app web é o alvo primário do "Era Uma Vez".
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Pause, Play } from 'phosphor-react-native';

import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

type Props = {
  url: string; // ex: "/api/audio/EUV-0031.mp3"
  night?: boolean;
  testID?: string;
};

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL ?? '';

function fmt(t: number): string {
  if (!isFinite(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ url, night = false, testID }: Props) {
  const isWeb = Platform.OS === 'web';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<View | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const fullUrl = url.startsWith('http') ? url : `${BASE}${url}`;

  useEffect(() => {
    if (!isWeb) return;
    const a = new Audio(fullUrl);
    a.preload = 'metadata';
    audioRef.current = a;

    const onLoaded = () => {
      setDuration(a.duration || 0);
      setReady(true);
    };
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);

    return () => {
      a.pause();
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, [fullUrl, isWeb]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch((err) => console.warn('[AudioPlayer] play failed', err));
    } else {
      a.pause();
    }
  };

  const seekFromEvent = (e: { nativeEvent: { locationX?: number; offsetX?: number; pageX?: number } }) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    // No web, react-native-web entrega offsetX no nativeEvent
    const ne: any = e.nativeEvent;
    const x = ne.offsetX ?? ne.locationX ?? 0;
    const target: any = ne.currentTarget ?? ne.target;
    const w = target?.clientWidth ?? target?.offsetWidth ?? 0;
    if (!w) return;
    const ratio = Math.max(0, Math.min(1, x / w));
    a.currentTime = ratio * duration;
    setCurrent(a.currentTime);
  };

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  const trackBg = night ? 'rgba(246,239,225,0.10)' : 'rgba(246,239,225,0.14)';
  const cardBg = night ? 'rgba(20,12,36,0.55)' : 'rgba(20,12,36,0.40)';
  const borderCol = night ? 'rgba(233,178,76,0.18)' : 'rgba(233,178,76,0.28)';

  return (
    <View
      style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}
      testID={testID ?? 'audio-narration-player'}
    >
      <View style={styles.row}>
        <Pressable
          onPress={toggle}
          disabled={!ready && isWeb}
          style={({ pressed }) => [
            styles.playBtn,
            { opacity: pressed ? 0.85 : !ready && isWeb ? 0.55 : 1 },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={playing ? 'Pausar narração' : 'Tocar narração'}
          testID="audio-play-pause"
        >
          {playing ? (
            <Pause size={28} color={colors.noiteAmeixa} weight="fill" />
          ) : (
            <Play size={28} color={colors.noiteAmeixa} weight="fill" />
          )}
        </Pressable>

        <View style={styles.info}>
          <Text style={styles.label} numberOfLines={1}>
            Ouvir esta história 🌙
          </Text>
          <Text style={styles.hint} numberOfLines={1}>
            Narração suave para a hora de dormir
          </Text>
        </View>
      </View>

      <View>
        <Pressable
          ref={barRef as any}
          onPress={seekFromEvent}
          style={[styles.track, { backgroundColor: trackBg }]}
          testID="audio-progress-track"
        >
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </Pressable>
        <View style={styles.times}>
          <Text style={styles.timeTxt}>{fmt(current)}</Text>
          <Text style={styles.timeTxt}>{fmt(duration)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.douradoEstrela,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  info: { flex: 1, minWidth: 0 },
  label: {
    fontFamily: fonts.titulo,
    color: colors.cremeLencol,
    fontSize: 17,
  },
  hint: {
    fontFamily: fonts.texto,
    color: 'rgba(246,239,225,0.65)',
    fontSize: 12,
    marginTop: 2,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.douradoEstrela,
    borderRadius: 2,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeTxt: {
    fontFamily: fonts.texto,
    color: 'rgba(246,239,225,0.55)',
    fontSize: 11,
  },
});
