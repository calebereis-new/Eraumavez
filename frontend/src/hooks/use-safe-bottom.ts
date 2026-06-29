// Inset bottom robusto para iOS PWA (lê env(safe-area-inset-bottom) via probe DOM)
// e cai no react-native-safe-area-context em ambiente nativo.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useSafeBottom(): number {
  const insets = useSafeAreaInsets();
  const [webInset, setWebInset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof document === 'undefined') return;
    try {
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom);';
      document.body.appendChild(probe);
      const cs = getComputedStyle(probe);
      const v = parseInt(cs.paddingBottom || '0', 10) || 0;
      probe.remove();
      setWebInset(v);
    } catch (err) {
      console.warn('[useSafeBottom] probe failed', err);
    }
  }, []);

  if (Platform.OS === 'web') {
    // No iPhone (Safari / PWA standalone) o home indicator reserva ~34px.
    // Em desktop/Android web normalmente é 0.
    const isIosLike =
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !('MSStream' in window);
    return Math.max(webInset, isIosLike ? 28 : 0);
  }
  return insets.bottom;
}
