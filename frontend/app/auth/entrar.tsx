// Tela de Entrar / Criar conta — apenas visual. Qualquer clique entra.
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Envelope, Eye, Lock } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { setAuthed } from '@/src/store/profiles';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

type Mode = 'login' | 'signup';

export default function Entrar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fakeEnter = async () => {
    await setAuthed(true);
    router.replace('/auth/perfis');
  };

  return (
    <ScreenBg seed="auth-bg" density={42}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 40, paddingHorizontal: spacing.xl, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <MoonMark size={40} />
          <Text style={styles.brand}>
            Era uma <Text style={{ color: colors.douradoEstrela }}>vez</Text>
          </Text>
          <Text style={styles.sub}>Boa noite. Vamos começar?</Text>
        </View>

        {/* Tabs Entrar / Criar */}
        <View style={styles.tabs} testID="auth-tabs">
          {(['login', 'signup'] as const).map((m) => {
            const active = mode === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[styles.tab, active && styles.tabActive]}
                testID={`auth-tab-${m}`}
              >
                <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>
                  {m === 'login' ? 'Entrar' : 'Criar conta'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>E-MAIL</Text>
        <View style={styles.field}>
          <Envelope size={16} color={colors.lavanda} weight="light" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu-email@email.com"
            placeholderTextColor="rgba(216,204,236,0.5)"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="auth-email"
          />
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>SENHA</Text>
        <View style={styles.field}>
          <Lock size={16} color={colors.lavanda} weight="light" />
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••••"
            placeholderTextColor="rgba(216,204,236,0.5)"
            style={styles.input}
            secureTextEntry
            testID="auth-senha"
          />
          <Eye size={17} color={colors.lavanda} weight="light" />
        </View>

        {mode === 'login' && (
          <Text style={styles.forgot} testID="auth-forgot">Esqueci a senha</Text>
        )}

        <Pressable style={styles.cta} onPress={fakeEnter} testID="auth-submit">
          <Text style={styles.ctaTxt}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn} onPress={fakeEnter} testID="auth-google">
            <Text style={styles.socialTxt}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialBtn} onPress={fakeEnter} testID="auth-apple">
            <Text style={styles.socialTxt}>Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.terms}>
          Ao continuar, você concorda com os Termos e a Política de Privacidade.
        </Text>
      </ScrollView>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginBottom: spacing.lg },
  brand: { fontFamily: fonts.tituloNarrativa, fontSize: 28, color: colors.cremeLencol, fontStyle: 'italic', marginTop: 10 },
  sub: { fontFamily: fonts.tituloNarrativa, fontSize: 16, color: colors.lilasSonho, fontStyle: 'italic', marginTop: 10 },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radius.md, padding: 4, marginTop: spacing.md },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.douradoEstrela },
  tabTxt: { color: colors.lilasSonho, fontFamily: fonts.textoBold, fontSize: 13 },
  tabTxtActive: { color: colors.violetaProfundo, fontFamily: fonts.textoExtra },
  label: { fontFamily: fonts.textoExtra, fontSize: 11, color: colors.lavanda, letterSpacing: 1, marginTop: spacing.md, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.16)',
  },
  input: { flex: 1, color: colors.cremeLencol, fontFamily: fonts.texto, fontSize: 13, outlineStyle: 'none' as any },
  forgot: { textAlign: 'right', fontSize: 12, fontFamily: fonts.textoBold, color: colors.douradoEstrela, marginTop: 10 },
  cta: {
    marginTop: spacing.md,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.douradoEstrela,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(233,178,76,0.3)' as any,
  },
  ctaTxt: { fontFamily: fonts.textoExtra, fontSize: 15, color: colors.violetaProfundo },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(200,178,230,0.18)' },
  dividerTxt: { color: colors.lavanda, fontFamily: fonts.textoBold, fontSize: 11 },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialTxt: { fontFamily: fonts.textoBold, fontSize: 12, color: colors.cremeLencol },
  terms: { fontSize: 10, color: colors.ameixaPro, fontFamily: fonts.texto, marginTop: 18, lineHeight: 15, textAlign: 'center' },
});
