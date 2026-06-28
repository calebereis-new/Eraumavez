import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { colors, fonts } from '@/src/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ color, focused, size }) => {
          let name: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'index') name = focused ? 'moon' : 'moon-outline';
          else if (route.name === 'valores') name = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'universos') name = focused ? 'planet' : 'planet-outline';
          else if (route.name === 'favoritos') name = focused ? 'star' : 'star-outline';
          return <Ionicons name={name} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="valores" options={{ title: 'Valores' }} />
      <Tabs.Screen name="universos" options={{ title: 'Universos' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
    </Tabs>
  );
}
