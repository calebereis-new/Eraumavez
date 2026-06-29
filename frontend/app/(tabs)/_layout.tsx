import { Tabs } from 'expo-router';
import { Heart, IconProps, Planet, Star } from 'phosphor-react-native';
import { ComponentType } from 'react';

import { colors } from '@/src/theme/tokens';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { BottomBar } from '@/src/components/BottomBar';

const makeIcon = (Cmp: ComponentType<IconProps>) => {
  const TabIcon = ({ color, focused }: { color: string; focused: boolean }) => (
    <Cmp size={24} color={color} weight={focused ? 'fill' : 'light'} />
  );
  TabIcon.displayName = `Tab_${Cmp.displayName ?? 'Icon'}`;
  return TabIcon;
};

const MoonIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <MoonMark size={24} color={focused ? colors.douradoEstrela : color} />
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: MoonIcon }} />
      <Tabs.Screen name="valores" options={{ title: 'Valores', tabBarIcon: makeIcon(Heart) }} />
      <Tabs.Screen name="universos" options={{ title: 'Universos', tabBarIcon: makeIcon(Planet) }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos', tabBarIcon: makeIcon(Star) }} />
    </Tabs>
  );
}
