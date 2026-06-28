import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Heart, Planet, Star, IconProps } from 'phosphor-react-native';
import { ComponentType } from 'react';

import { colors, fonts } from '@/src/theme/tokens';
import { MoonMark } from '@/src/components/brand/MoonMark';

export default function TabsLayout() {
  const makeIcon = (Cmp: ComponentType<IconProps>) => {
    const TabIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
      <Cmp size={size ?? 22} color={color} weight={focused ? 'fill' : 'light'} />
    );
    return TabIcon;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.douradoEstrela,
        tabBarInactiveTintColor: colors.lilasSonho,
        tabBarStyle: {
          backgroundColor: colors.noiteAmeixa,
          borderTopColor: 'rgba(246,239,225,0.08)',
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: { fontFamily: fonts.textoBold, fontSize: 11, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused, size }) => (
            <MoonMark size={size ?? 22} color={focused ? colors.douradoEstrela : color} />
          ),
        }}
      />
      <Tabs.Screen name="valores" options={{ title: 'Valores', tabBarIcon: makeIcon(Heart) }} />
      <Tabs.Screen name="universos" options={{ title: 'Universos', tabBarIcon: makeIcon(Planet) }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos', tabBarIcon: makeIcon(Star) }} />
    </Tabs>
  );
}
