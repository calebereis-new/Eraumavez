// Cabeçalho recorrente do app.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

export function AppHeader({
  greeting,
  subtitle,
  showBack,
  rightSlot,
  testID,
}: {
  greeting?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
  testID?: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.wrap} testID={testID}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn} testID="header-back">
            <Ionicons name="chevron-back" size={22} color={colors.cremeLencol} />
          </Pressable>
        ) : (
          <View style={styles.logoMark}>
            <Ionicons name="moon" size={18} color={colors.douradoEstrela} />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          {greeting ? <Text style={styles.greet}>{greeting}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
    backgroundColor: colors.noiteAmeixa,
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
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(233,178,76,0.14)',
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
