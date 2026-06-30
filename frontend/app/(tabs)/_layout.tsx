import { Tabs } from 'expo-router';
import { Compass, House, User } from 'phosphor-react-native';
import { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react-native';

const makeIcon = (Cmp: ComponentType<IconProps>) => {
  const TabIcon = ({ color, focused }: { color: string; focused: boolean }) => (
    <Cmp size={24} color={color} weight={focused ? 'fill' : 'regular'} />
  );
  TabIcon.displayName = `Tab_${Cmp.displayName ?? 'Icon'}`;
  return TabIcon;
};

import { BottomBar } from '@/src/components/BottomBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: makeIcon(House) }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar', tabBarIcon: makeIcon(Compass) }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: makeIcon(User) }} />
    </Tabs>
  );
}
