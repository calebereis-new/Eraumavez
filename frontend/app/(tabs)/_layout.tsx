import { Tabs } from 'expo-router';
import { Heart, IconProps, Planet, Star } from 'phosphor-react-native';
import { ComponentType } from 'react';
import { Platform, View } from 'react-native';

import { colors, fonts } from '@/src/theme/tokens';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { useSafeBottom } from '@/src/hooks/use-safe-bottom';

function IconSlot({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 30,
      }}
    >
      {children}
    </View>
  );
}

export default function TabsLayout() {
  const safeBottom = useSafeBottom();

  // Quanto de respiro abaixo dos labels. Em iPhone PWA usamos ao menos 28.
  const padBottom =
    Platform.OS === 'ios' ? Math.max(safeBottom, 22) : Math.max(safeBottom, 10);

  // Altura total: ícone (28) + label (~16) + padding cima (12) + padBottom + folga
  const tabBarHeight = 64 + padBottom;

  const makeIcon = (Cmp: ComponentType<IconProps>) => {
    const TabIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
      <IconSlot>
        <Cmp size={size ?? 22} color={color} weight={focused ? 'fill' : 'light'} />
      </IconSlot>
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
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 12,
          paddingBottom: padBottom,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.textoBold,
          fontSize: 11,
          marginTop: 0,
          marginBottom: 0,
          includeFontPadding: false,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused, size }) => (
            <IconSlot>
              <MoonMark size={size ?? 22} color={focused ? colors.douradoEstrela : color} />
            </IconSlot>
          ),
        }}
      />
      <Tabs.Screen name="valores" options={{ title: 'Valores', tabBarIcon: makeIcon(Heart) }} />
      <Tabs.Screen name="universos" options={{ title: 'Universos', tabBarIcon: makeIcon(Planet) }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos', tabBarIcon: makeIcon(Star) }} />
    </Tabs>
  );
}
