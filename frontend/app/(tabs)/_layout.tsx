import { Tabs } from 'expo-router';
import { Heart, IconProps, Planet, Star } from 'phosphor-react-native';
import { ComponentType } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/src/theme/tokens';
import { MoonMark } from '@/src/components/brand/MoonMark';

// Wrapper que garante centralização do ícone dentro do slot da tab,
// independente de plataforma (iOS, Android, Web).
function IconSlot({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
      }}
    >
      {children}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Altura total = conteúdo (44px) + área segura do dispositivo.
  const baseContent = 44;
  const extraBottom = Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : Math.max(insets.bottom, 10);
  const tabBarHeight = baseContent + extraBottom + 20; // 20 = paddingTop p/ ar

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
          paddingTop: 10,
          paddingBottom: extraBottom,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 2,
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
