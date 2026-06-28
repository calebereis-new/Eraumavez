import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';

import { useIconFonts } from '@/src/hooks/use-icon-fonts';
import { useWebHead } from '@/src/hooks/use-web-head';
import { NightModeProvider } from '@/src/store/nightMode';

LogBox.ignoreAllLogs(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useWebHead();
  const [iconsLoaded, iconsError] = useIconFonts();
  const [appFontsLoaded, setAppFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          Cormorant_600SemiBold: require('../assets/fonts/Cormorant-SemiBold.ttf'),
          Cormorant_600SemiBold_Italic: require('../assets/fonts/Cormorant-SemiBoldItalic.ttf'),
          Nunito_400Regular: require('../assets/fonts/Nunito-Regular.ttf'),
          Nunito_700Bold: require('../assets/fonts/Nunito-Bold.ttf'),
          Nunito_800ExtraBold: require('../assets/fonts/Nunito-ExtraBold.ttf'),
        });
      } catch {
        // se cair, seguimos com fallback de sistema
      } finally {
        setAppFontsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if ((iconsLoaded || iconsError) && appFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [iconsLoaded, iconsError, appFontsLoaded]);

  if ((!iconsLoaded && !iconsError) || !appFontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NightModeProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#2A1844' } }} />
      </NightModeProvider>
    </SafeAreaProvider>
  );
}
