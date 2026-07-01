// Tela de abertura — lua dourada + "Era uma vez…". Roteia baseado no estado:
// não autenticado → /auth/entrar; sem perfil ativo → /auth/perfis; senão → /(tabs)
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { getAuthed, getActiveProfileId } from '@/src/store/profiles';
import { colors, fonts } from '@/src/theme/tokens';

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const t = setTimeout(async () => {
      const authed = await getAuthed();
      if (!authed) {
        router.replace('/auth/entrar' as any);
        return;
      }
      const active = await getActiveProfileId();
      if (!active) {
        router.replace('/auth/perfis' as any);
        return;
      }
      router.replace('/(tabs)');
    }, 1900);

    return () => clearTimeout(t);
  }, [router, fade, lift]);

  return (
    <ScreenBg seed="splash-bg" density={64}>
      <View style={styles.center}>
        <Animated.View style={{ opacity: fade, transform: [{ translateY: lift }], alignItems: 'center' }}>
          <View style={styles.moonGlow}>
            <MoonMark size={84} />
          </View>
          <Text style={styles.title}>
            Era uma <Text style={{ color: colors.douradoEstrela }}>vez</Text>
            <Text style={{ color: colors.douradoEstrela }}>…</Text>
          </Text>
          <Text style={styles.sub}>histórias para a hora de dormir</Text>
        </Animated.View>
      </View>
      <View style={styles.dots} testID="splash-dots">
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  moonGlow: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
    backgroundColor: 'rgba(233,178,76,0.10)',
    marginBottom: 30,
  },
  title: {
    fontFamily: fonts.tituloNarrativa,
    fontSize: 40,
    color: colors.cremeForte,
    lineHeight: 42,
    fontStyle: 'italic',
  },
  sub: {
    fontFamily: fonts.textoBold,
    fontSize: 13,
    letterSpacing: 0.8,
    color: colors.lilasSonho,
    marginTop: 14,
  },
  dots: { position: 'absolute', bottom: 46, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(233,178,76,0.4)' },
  dotActive: { backgroundColor: colors.douradoEstrela },
});
