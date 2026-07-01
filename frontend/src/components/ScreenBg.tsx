// Fundo padrão de tela — gradiente noite + céu pontilhado.
// Use como wrapper raiz das telas para garantir identidade visual consistente.
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { gradientNoiteTela } from '@/src/theme/tokens';
import { StarrySky } from './brand/StarrySky';

type Props = {
  children: React.ReactNode;
  seed?: string;
  density?: number;
  style?: ViewStyle;
};

export function ScreenBg({ children, seed = 'screen', density = 38, style }: Props) {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[...gradientNoiteTela]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <StarrySky seed={seed} density={density} opacity={0.18} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0717' },
});
