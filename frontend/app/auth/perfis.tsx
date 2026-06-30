// Seleção de perfil "Quem vai sonhar hoje?" — começa vazio com botão Adicionar.
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gear, Plus } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { MoonMark } from '@/src/components/brand/MoonMark';
import {
  addProfile,
  listProfiles,
  Profile,
  setActiveProfileId,
} from '@/src/store/profiles';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '?').toUpperCase();
}

export default function Perfis() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adding, setAdding] = useState(false);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const refresh = useCallback(async () => {
    const list = await listProfiles();
    setProfiles(list);
  }, []);

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  const pick = async (p: Profile) => {
    await setActiveProfileId(p.id);
    router.replace('/(tabs)');
  };

  const submitNew = async () => {
    if (!nome.trim()) {
      Alert.alert('Nome', 'Conta pra mim como a criança se chama.');
      return;
    }
    const idadeN = idade.trim() ? Number(idade.replace(/\D/g, '')) : undefined;
    const p = await addProfile({ nome: nome.trim(), idade: idadeN });
    setAdding(false);
    setNome('');
    setIdade('');
    await setActiveProfileId(p.id);
    router.replace('/(tabs)');
  };

  return (
    <ScreenBg seed="perfis-bg" density={32}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingHorizontal: spacing.xl, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <MoonMark size={28} />
          <Text style={styles.eraVez}>Era uma vez</Text>
          <Text style={styles.h1}>Quem vai sonhar hoje?</Text>
        </View>

        <View style={styles.grid} testID="profiles-grid">
          {profiles.map((p) => {
            const [from, to] = p.cor.split('|');
            return (
              <Pressable
                key={p.id}
                style={styles.profileItem}
                onPress={() => pick(p)}
                testID={`profile-${p.id}`}
              >
                <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
                  <Text style={styles.avatarLetter}>{initials(p.nome)}</Text>
                </LinearGradient>
                <Text style={styles.profileName}>{p.nome}</Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.profileItem} onPress={() => setAdding(true)} testID="profile-add">
            <View style={styles.addAvatar}>
              <Plus size={28} color={colors.lavanda} weight="light" />
            </View>
            <Text style={styles.addName}>Adicionar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable style={[styles.parents, { bottom: insets.bottom + 24 }]} testID="cantinho-pais">
        <Gear size={16} color={colors.lilasSonho} weight="light" />
        <Text style={styles.parentsTxt}>Cantinho dos pais</Text>
      </Pressable>

      <Modal visible={adding} transparent animationType="fade" onRequestClose={() => setAdding(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo perfil</Text>
            <Text style={styles.modalSub}>Quem mais vai sonhar com a gente?</Text>

            <Text style={styles.label}>NOME</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Joana"
              placeholderTextColor="rgba(216,204,236,0.5)"
              style={styles.input}
              testID="new-profile-nome"
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>IDADE (opcional)</Text>
            <TextInput
              value={idade}
              onChangeText={setIdade}
              placeholder="Ex: 5"
              placeholderTextColor="rgba(216,204,236,0.5)"
              style={styles.input}
              keyboardType="number-pad"
              testID="new-profile-idade"
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.lg }}>
              <Pressable style={[styles.modalBtn, styles.modalBtnGhost]} onPress={() => setAdding(false)} testID="new-profile-cancel">
                <Text style={styles.modalBtnTxtGhost}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={submitNew} testID="new-profile-submit">
                <Text style={styles.modalBtnTxt}>Adicionar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginBottom: spacing.xl },
  eraVez: { fontFamily: fonts.tituloNarrativa, fontStyle: 'italic', fontSize: 15, color: colors.douradoEstrela, marginTop: 8 },
  h1: { fontFamily: fonts.titulo, fontSize: 30, color: colors.cremeForte, marginTop: 2, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 24, rowGap: 18, marginTop: spacing.lg },
  profileItem: { alignItems: 'center', gap: 9, width: 110 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontFamily: fonts.titulo, fontSize: 36, color: colors.cremeForte },
  addAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(200,178,230,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.cremeLencol },
  addName: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.lavanda },
  parents: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.18)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  parentsTxt: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.lilasSonho },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(11,7,23,0.85)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.noiteMeio,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.2)',
  },
  modalTitle: { fontFamily: fonts.titulo, fontSize: 22, color: colors.cremeForte },
  modalSub: { fontFamily: fonts.texto, fontSize: 13, color: colors.lavanda, marginTop: 4 },
  label: { fontFamily: fonts.textoExtra, fontSize: 11, color: colors.lavanda, letterSpacing: 1, marginTop: spacing.md, marginBottom: 6 },
  input: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.16)',
    color: colors.cremeLencol,
    fontFamily: fonts.texto,
    fontSize: 14,
    outlineStyle: 'none' as any,
  },
  modalBtn: { flex: 1, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  modalBtnPrimary: { backgroundColor: colors.douradoEstrela },
  modalBtnGhost: { borderWidth: 1, borderColor: 'rgba(200,178,230,0.2)' },
  modalBtnTxt: { fontFamily: fonts.textoExtra, color: colors.violetaProfundo, fontSize: 14 },
  modalBtnTxtGhost: { fontFamily: fonts.textoBold, color: colors.lilasSonho, fontSize: 14 },
});
