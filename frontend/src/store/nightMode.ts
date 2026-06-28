// Toggle persistente para "Modo Noite / Hora de Dormir".
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import React from 'react';

const KEY = '@euv:night-mode:v1';

type Ctx = {
  night: boolean;
  setNight: (v: boolean) => Promise<void>;
  toggle: () => Promise<void>;
};

const NightCtx = createContext<Ctx>({
  night: false,
  setNight: async () => {},
  toggle: async () => {},
});

export function NightModeProvider({ children }: { children: React.ReactNode }) {
  const [night, setNightState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw === '1') setNightState(true);
      } catch {
        // ignore
      }
    })();
  }, []);

  const setNight = useCallback(async (v: boolean) => {
    setNightState(v);
    await AsyncStorage.setItem(KEY, v ? '1' : '0');
  }, []);

  const toggle = useCallback(async () => {
    setNightState((cur) => {
      const next = !cur;
      AsyncStorage.setItem(KEY, next ? '1' : '0').catch(() => {});
      return next;
    });
  }, []);

  return React.createElement(NightCtx.Provider, { value: { night, setNight, toggle } }, children);
}

export const useNightMode = () => useContext(NightCtx);
