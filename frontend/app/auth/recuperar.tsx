// Tela de Recuperação de Senha com integração real ao backend.
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Envelope, CaretLeft, CheckCircle } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { api } from '@/src/api/catalog';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

export default function Recuperar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMsg('Por favor, insira o seu e-mail cadastrado.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await api.forgotPassword(email.trim());
      setSuccess(true);
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Ocorreu um erro, tente novamente.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.sub}>Recuperar senha</Text>
        </View>

        {success ? (
          <View style={styles.successCard}>
            <CheckCircle size={44} color={colors.douradoEstrela} weight="light" style={{ marginBottom: spacing.md }} />
            <Text style={styles.successTitle}>E-mail verificado!</Text>
            <Text style={styles.successText}>
              Encontramos seu cadastro. Um link de redefinição de senha foi simulado para {email.trim()}.
            </Text>
            <Pressable style={styles.cta} onPress={() => router.replace('/auth/entrar' as any)}>
              <Text style={styles.ctaTxt}>Ir para o Login</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.instructions}>
              Digite seu e-mail cadastrado para enviarmos as instruções de redefinição de senha.
            </Text>

            <Text style={styles.label}>E-MAIL</Text>
            <View style={styles.field}>
              <Envelope size={16} color={colors.lavanda} weight="light" />
              <TextInput
                value={email}
                onChangeText={(txt) => { setEmail(txt); setErrorMsg(null); }}
                placeholder="seu-email@email.com"
                placeholderTextColor="rgba(216,204,236,0.5)"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="auth-email-recovery"
              />
            </View>

            {errorMsg && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText} testID="auth-error-message-recovery">{errorMsg}</Text>
              </View>
            )}

            <Pressable
              style={[styles.cta, loading && { opacity: 0.8 }]}
              onPress={loading ? undefined : handleSubmit}
              testID="auth-submit-recovery"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.violetaProfundo} />
              ) : (
                <Text style={styles.ctaTxt}>Enviar Instruções</Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.replace('/auth/entrar' as any)} style={styles.backLink}>
              <CaretLeft size={14} color={colors.douradoEstrela} weight="bold" />
              <Text style={styles.backTxt}>Voltar para o Login</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginBottom: spacing.lg },
  brand: { fontFamily: fonts.tituloNarrativa, fontSize: 28, color: colors.cremeLencol, fontStyle: 'italic', marginTop: 10 },
  sub: { fontFamily: fonts.tituloNarrativa, fontSize: 16, color: colors.lilasSonho, fontStyle: 'italic', marginTop: 10 },
  instructions: {
    fontFamily: fonts.texto,
    fontSize: 13,
    color: colors.cremeLencol,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.lg,
    opacity: 0.85,
  },
  label: { fontFamily: fonts.textoExtra, fontSize: 11, color: colors.lavanda, letterSpacing: 1, marginTop: spacing.sm, marginBottom: 6 },
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
  cta: {
    marginTop: spacing.lg,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.douradoEstrela,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(233,178,76,0.3)' as any,
    width: '100%',
  },
  ctaTxt: { fontFamily: fonts.textoExtra, fontSize: 15, color: colors.violetaProfundo },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.xl,
    paddingVertical: 10,
  },
  backTxt: {
    fontFamily: fonts.textoBold,
    fontSize: 13,
    color: colors.douradoEstrela,
  },
  errorContainer: {
    backgroundColor: 'rgba(233,139,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(233,139,107,0.3)',
    borderRadius: radius.md,
    padding: 10,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  errorText: {
    color: colors.coralEntardecer,
    fontFamily: fonts.textoBold,
    fontSize: 12,
    textAlign: 'center',
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.1)',
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  successTitle: {
    fontFamily: fonts.titulo,
    fontSize: 20,
    color: colors.cremeLencol,
    marginBottom: spacing.sm,
  },
  successText: {
    fontFamily: fonts.texto,
    fontSize: 13,
    color: colors.lavanda,
    textAlign: 'center',
    lineHeight: 20,
  },
});
