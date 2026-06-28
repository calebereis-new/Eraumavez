// Selo de valor — estrelinha dourada + nome do valor. Estilo do guia.
import { StyleSheet, Text, View } from 'react-native';
import { Star } from 'phosphor-react-native';

import { colors, fonts, radius } from '@/src/theme/tokens';

export function ValorBadge({
  valor,
  variant = 'on-dark',
  size = 'md',
}: {
  valor: string;
  variant?: 'on-dark' | 'highlight' | 'on-light';
  size?: 'sm' | 'md';
}) {
  const dims = size === 'sm' ? { iconSize: 10, ...small } : { iconSize: 12, ...normal };
  const palette =
    variant === 'highlight'
      ? { bg: colors.douradoEstrela, fg: colors.noiteAmeixa, star: colors.noiteAmeixa, border: colors.douradoEstrela }
      : variant === 'on-light'
        ? { bg: colors.cremeFundo, fg: colors.tinta, star: colors.douradoEstrela, border: colors.douradoEstrela }
        : {
            bg: 'rgba(233,178,76,0.12)',
            fg: colors.cremeLencol,
            star: colors.douradoEstrela,
            border: 'rgba(233,178,76,0.45)',
          };
  return (
    <View style={[dims.wrap, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Star size={dims.iconSize} color={palette.star} weight="fill" />
      <Text style={[dims.text, { color: palette.fg }]} numberOfLines={1}>
        {valor}
      </Text>
    </View>
  );
}

const normal = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  text: { fontFamily: fonts.textoBold, fontSize: 12, letterSpacing: 0.2 },
});

const small = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  text: { fontFamily: fonts.textoBold, fontSize: 10, letterSpacing: 0.2 },
});
