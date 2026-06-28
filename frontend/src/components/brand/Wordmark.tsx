// Wordmark "Era uma vez" — reproduz logo-secundario.svg em React Native.
// "Era uma" em creme e "vez" em dourado, com a lua-berço à esquerda.
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Mask, Path, Rect, Text as SvgText } from 'react-native-svg';

import { colors, fonts } from '@/src/theme/tokens';

export function Wordmark({
  width = 200,
  variant = 'duo',
}: {
  width?: number;
  variant?: 'duo' | 'mono-light';
}) {
  const h = width * (200 / 560);
  const monoColor = colors.cremeLencol;
  const eraColor = variant === 'mono-light' ? monoColor : colors.cremeLencol;
  const vezColor = variant === 'mono-light' ? monoColor : colors.douradoEstrela;
  const moonColor = variant === 'mono-light' ? monoColor : colors.douradoEstrela;

  return (
    <View style={[styles.wrap, { width, height: h }]} pointerEvents="none">
      <Svg width={width} height={h} viewBox="0 0 560 200">
        <Defs>
          <Mask id="wm">
            <Rect width="48" height="48" fill="#fff" />
            <Circle cx="30" cy="20" r="13" fill="#000" />
          </Mask>
        </Defs>
        <Svg x={40} y={52} width={96} height={96} viewBox="0 0 48 48">
          <Circle cx="24" cy="24" r="14" fill={moonColor} mask="url(#wm)" />
          <Path
            d="M24 5l1.5 3.3 3.6.4-2.7 2.4.8 3.5L24 12.3 20.8 14.6l.8-3.5-2.7-2.4 3.6-.4z"
            fill={moonColor}
          />
        </Svg>
        <SvgText x={160} y={96} fontSize={74} fontFamily={fonts.titulo} fill={eraColor}>
          Era uma
        </SvgText>
        <SvgText x={160} y={166} fontSize={74} fontFamily={fonts.titulo} fill={vezColor}>
          vez
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignSelf: 'flex-start' } });
