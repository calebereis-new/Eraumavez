// Ícone-tema de cada universo (Phosphor "Light" para traço fino consistente).
import {
  BookOpen,
  Castle,
  Compass,
  Crown,
  House,
  IconProps,
  Lightning,
  PawPrint,
  Planet,
  Sparkle,
  Star,
} from 'phosphor-react-native';

import { colors, universoCor } from '@/src/theme/tokens';

export type UniverseIconName =
  | 'biblicas'
  | 'super-herois'
  | 'princesas'
  | 'animais'
  | 'contos'
  | 'historicos'
  | 'mundo-real'
  | 'outros';

export function keyFromUniverso(u: string): UniverseIconName {
  const k = (u || '').toLowerCase();
  if (k.includes('bíblic') || k.includes('biblic')) return 'biblicas';
  if (k.includes('super')) return 'super-herois';
  if (k.includes('princes')) return 'princesas';
  if (k.includes('animais') || k.includes('animal')) return 'animais';
  if (k.includes('conto')) return 'contos';
  if (k.includes('históric') || k.includes('historic')) return 'historicos';
  if (k.includes('mundo')) return 'mundo-real';
  return 'outros';
}

const MAP: Record<UniverseIconName, React.ComponentType<IconProps>> = {
  biblicas: BookOpen,
  'super-herois': Lightning,
  princesas: Crown,
  animais: PawPrint,
  contos: Castle,
  historicos: Compass,
  'mundo-real': House,
  outros: Sparkle,
};

export function UniverseIcon({
  universo,
  size = 22,
  color,
  weight = 'light',
}: {
  universo: string;
  size?: number;
  color?: string;
  weight?: 'light' | 'regular' | 'bold' | 'duotone';
}) {
  const Cmp = MAP[keyFromUniverso(universo)];
  return <Cmp size={size} color={color ?? universoCor(universo)} weight={weight} />;
}

// Reexports úteis para o restante do app
export { Star, Planet, Sparkle, BookOpen, Crown, PawPrint, Castle, Compass, House, Lightning };
export const brandColors = colors;
