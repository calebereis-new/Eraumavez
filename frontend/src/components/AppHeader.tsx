// Cabeçalho recorrente do app. Mostra o wordmark "Era uma vez" como logo,
// com saudação e subtítulo opcionais.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';

import { colors, fonts, radius, spacing } from '@/src/theme/tokens';
import { MoonMark } from './brand/MoonMark';
import { Wordmark } from './brand/Wordmark';

export function AppHeader({
  greeting,
  subtitle,
  showBack,
  showLogo,
  rightSlot,
  testID,
}: {
  greeting?: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightSlot?: React.ReactNode;
  testID?: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.wrap} testID={testID}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn} testID="header-back">
            <CaretLeft size={20} color={colors.cremeLencol} weight="light" />
          </Pressable>
        ) : (
          <View style={styles.logoMark}>
            <MoonMark size={22} />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          {showLogo ? (
            <Wordmark width={160} />
          ) : (
            <>
              {greeting ? <Text style={styles.greet}>{greeting}</Text> : null}
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </>
          )}
        </View>
        {rightSlot}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(233,178,76,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greet: {
    fontFamily: fonts.tituloNarrativa,
    color: colors.cremeLencol,
    fontSize: 22,
    lineHeight: 26,
  },
  subtitle: { fontFamily: fonts.texto, color: colors.lilasSonho, fontSize: 12, marginTop: 2 },
});
