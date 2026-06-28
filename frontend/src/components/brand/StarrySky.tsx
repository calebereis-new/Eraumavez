// Céu pontilhado: estrelinhas dispersas, bem leves, como pano de fundo.
// Determinístico via seed → mesmo card sempre tem o mesmo céu.
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/src/theme/tokens';

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function StarrySky({
  seed = 'euv',
  density = 26,
  opacity = 0.18,
  starColor = colors.cremeLencol,
}: {
  seed?: string;
  density?: number;
  opacity?: number;
  starColor?: string;
}) {
  const dots = useMemo(() => {
    const r = rng(hashSeed(seed));
    return Array.from({ length: density }, (_, i) => ({
      key: i,
      cx: r() * 100,
      cy: r() * 100,
      rad: 0.35 + r() * 1.0,
      o: 0.3 + r() * 0.7,
    }));
  }, [seed, density]);

  return (
    <View style={[StyleSheet.absoluteFillObject, { opacity }]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {dots.map((d) => (
          <Circle key={d.key} cx={d.cx} cy={d.cy} r={d.rad} fill={starColor} opacity={d.o} />
        ))}
      </Svg>
    </View>
  );
}
