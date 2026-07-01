// Persistência local de perfis (crianças) e do usuário "pai" simulado.
// Tudo via AsyncStorage — sem backend de autenticação por enquanto.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEY_AUTH = '@euv:auth:v1';
const KEY_USER = '@euv:user:v1';
const KEY_PROFILES = '@euv:profiles:v1';
const KEY_ACTIVE = '@euv:active-profile:v1';

export type Profile = {
  id: string;
  nome: string;
  cor: string; // gradiente "from-to" (ver palettes abaixo)
  idade?: number;
  desdeISO: string;
};

export const profilePalettes: { from: string; to: string }[] = [
  { from: '#D87B9C', to: '#8A3E5A' },
  { from: '#4E84A6', to: '#274A63' },
  { from: '#6E8E63', to: '#3C5234' },
  { from: '#C99A3A', to: '#6E521A' },
  { from: '#7A5DAE', to: '#3D2363' },
  { from: '#E98B6B', to: '#8A4C36' },
];

function uid(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// Helpers de derivação de chaves escopadas por usuário
async function getProfilesKey(): Promise<string> {
  const email = await AsyncStorage.getItem(KEY_USER);
  if (email) {
    const sanitized = email.replace(/[^a-zA-Z0-9]/g, '_');
    return `@euv:profiles:${sanitized}:v1`;
  }
  return KEY_PROFILES;
}

async function getActiveKey(): Promise<string> {
  const email = await AsyncStorage.getItem(KEY_USER);
  if (email) {
    const sanitized = email.replace(/[^a-zA-Z0-9]/g, '_');
    return `@euv:active-profile:${sanitized}:v1`;
  }
  return KEY_ACTIVE;
}

// ─────────────── AUTH (simulado) ───────────────
export async function getAuthed(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY_AUTH);
  return v === '1';
}

export async function setAuthed(v: boolean, userEmail?: string): Promise<void> {
  await AsyncStorage.setItem(KEY_AUTH, v ? '1' : '0');
  if (v && userEmail) {
    await AsyncStorage.setItem(KEY_USER, userEmail);
  } else if (!v) {
    await AsyncStorage.removeItem(KEY_USER);
  }
}

export async function clearAuth(): Promise<void> {
  const actKey = await getActiveKey();
  await AsyncStorage.multiRemove([KEY_AUTH, KEY_USER, actKey]);
}

// ─────────────── PROFILES ───────────────
async function readProfiles(): Promise<Profile[]> {
  try {
    const key = await getProfilesKey();
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[profiles] read failed', err);
    return [];
  }
}

async function writeProfiles(list: Profile[]): Promise<void> {
  const key = await getProfilesKey();
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

export async function listProfiles(): Promise<Profile[]> {
  return readProfiles();
}

export async function addProfile(input: { nome: string; idade?: number }): Promise<Profile> {
  const list = await readProfiles();
  const palette = profilePalettes[list.length % profilePalettes.length];
  const p: Profile = {
    id: uid(),
    nome: input.nome.trim(),
    cor: `${palette.from}|${palette.to}`,
    idade: input.idade,
    desdeISO: new Date().toISOString(),
  };
  await writeProfiles([...list, p]);
  return p;
}

export async function updateProfile(id: string, patch: Partial<Pick<Profile, 'nome' | 'idade'>>): Promise<void> {
  const list = await readProfiles();
  const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p));
  await writeProfiles(next);
}

export async function deleteProfile(id: string): Promise<void> {
  const list = await readProfiles();
  await writeProfiles(list.filter((p) => p.id !== id));
  const key = await getActiveKey();
  const active = await AsyncStorage.getItem(key);
  if (active === id) await AsyncStorage.removeItem(key);
}

// ─────────────── ACTIVE PROFILE ───────────────
export async function getActiveProfileId(): Promise<string | null> {
  const key = await getActiveKey();
  return AsyncStorage.getItem(key);
}

export async function setActiveProfileId(id: string | null): Promise<void> {
  const key = await getActiveKey();
  if (id == null) await AsyncStorage.removeItem(key);
  else await AsyncStorage.setItem(key, id);
}

// ─────────────── React hook ───────────────
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const aKey = await getActiveKey();
    const [list, act] = await Promise.all([readProfiles(), AsyncStorage.getItem(aKey)]);
    setProfiles(list);
    setActive(act);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const active = profiles.find((p) => p.id === activeId) ?? null;
  return { profiles, activeId, active, ready, refresh };
}
