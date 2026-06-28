// Marca: a lua-berço dourada (crescente) embalando uma estrela.
// Reproduz fielmente icone-lua.svg em SVG nativo.
import { ColorValue } from 'react-native';
import Svg, { Circle, Defs, Mask, Path, Rect } from 'react-native-svg';

import { colors } from '@/src/theme/tokens';

export function MoonMark({
  size = 28,
  color = colors.douradoEstrela,
}: {
  size?: number;
  color?: ColorValue;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <Mask id="m">
          <Rect width="48" height="48" fill="#fff" />
          <Circle cx="30" cy="20" r="13" fill="#000" />
        </Mask>
      </Defs>
      <Circle cx="24" cy="24" r="14" fill={color as string} mask="url(#m)" />
      <Path
        d="M24 5l1.5 3.3 3.6.4-2.7 2.4.8 3.5L24 12.3 20.8 14.6l.8-3.5-2.7-2.4 3.6-.4z"
        fill={color as string}
      />
    </Svg>
  );
}
