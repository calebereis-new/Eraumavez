// KidReader — modo "Ler (criança)": mostra uma frase curta por página,
// com botões grandes de anterior/próxima e progresso visível.
// Feito para crianças que estão aprendendo a ler: tipografia generosa,
// alto contraste, respiro amplo, uma coisa acontecendo por vez.
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, CaretRight, Sparkle } from 'phosphor-react-native';

import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

type Props = {
  textoSimplificado: string;
  storyId: string;
  night?: boolean;
};

// Parser tolerante: separa por "|", limpa espaços, remove vazios.
function parseFrases(txt: string): string[] {
  return (txt || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function KidReader({ textoSimplificado, storyId, night = false }: Props) {
  const router = useRouter();
  const frases = useMemo(() => parseFrases(textoSimplificado), [textoSimplificado]);
  const [i, setI] = useState(0);

  if (frases.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTxt}>
          Esta história ainda não tem o modo criança. Em breve!
        </Text>
      </View>
    );
  }

  const total = frases.length;
  const atual = frases[i];
  const isLast = i === total - 1;
  const isFirst = i === 0;
  const progresso = ((i + 1) / total) * 100;

  const cardBg = night ? 'rgba(20,12,36,0.55)' : 'rgba(255,255,255,0.06)';
  const cardBorder = night ? 'rgba(233,178,76,0.16)' : 'rgba(233,178,76,0.24)';

  return (
    <View style={styles.wrap} testID="kid-reader">
      {/* PROGRESSO — linha fina + contador em pill */}
      <View style={styles.progressRow}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progresso}%` }]} />
        </View>
        <View style={styles.counter} testID="kid-counter">
          <Sparkle size={12} color={colors.douradoEstrela} weight="fill" />
          <Text style={styles.counterTxt}>
            {i + 1} <Text style={styles.counterOf}>de {total}</Text>
          </Text>
        </View>
      </View>

      {/* CARD DA FRASE ATUAL */}
      <View
        style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
        testID="kid-frase-card"
      >
        <Text style={styles.frase} testID="kid-frase">
          {atual}
        </Text>
      </View>

      {/* NAVEGAÇÃO */}
      <View style={styles.nav}>
        <Pressable
          onPress={() => setI((v) => Math.max(0, v - 1))}
          disabled={isFirst}
          style={({ pressed }) => [
            styles.navBtn,
            styles.navBtnGhost,
            (isFirst || pressed) && { opacity: isFirst ? 0.35 : 0.75 },
          ]}
          hitSlop={10}
          accessibilityLabel="Frase anterior"
          testID="kid-prev"
        >
          <CaretLeft size={26} color={colors.cremeLencol} weight="bold" />
        </Pressable>

        {isLast ? (
          <Pressable
            onPress={() => router.push(`/historia/fim/${storyId}`)}
            style={({ pressed }) => [
              styles.navBtn,
              styles.navBtnPrimary,
              styles.navBtnFinish,
              { opacity: pressed ? 0.9 : 1 },
            ]}
            testID="kid-finish"
          >
            <Text style={styles.finishTxt}>Terminamos!</Text>
            <Sparkle size={18} color={colors.violetaProfundo} weight="fill" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setI((v) => Math.min(total - 1, v + 1))}
            style={({ pressed }) => [
              styles.navBtn,
              styles.navBtnPrimary,
              { opacity: pressed ? 0.9 : 1 },
            ]}
            hitSlop={10}
            accessibilityLabel="Próxima frase"
            testID="kid-next"
          >
            <Text style={styles.nextTxt}>Próxima</Text>
            <CaretRight size={22} color={colors.violetaProfundo} weight="bold" />
          </Pressable>
        )}
      </View>

      {/* dica sutil */}
      <Text style={styles.hint}>
        Cada tela tem uma frase. Leia bem devagar. ✨
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(246,239,225,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.douradoEstrela,
    borderRadius: 3,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(233,178,76,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.3)',
  },
  counterTxt: {
    fontFamily: fonts.textoExtra,
    color: colors.cremeForte,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  counterOf: { color: colors.lavanda, fontFamily: fonts.textoBold },

  card: {
    minHeight: 260,
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 32px rgba(0,0,0,0.28)' as any,
  },
  frase: {
    fontFamily: fonts.textoExtra,
    color: colors.cremeForte,
    fontSize: 30,
    lineHeight: 46,
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: spacing.sm,
  },
  navBtn: {
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  navBtnGhost: {
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.22)',
  },
  navBtnPrimary: {
    flex: 1,
    backgroundColor: colors.douradoEstrela,
    paddingHorizontal: spacing.lg,
    boxShadow: '0 10px 24px rgba(233,178,76,0.35)' as any,
  },
  navBtnFinish: {
    backgroundColor: colors.douradoEstrela,
  },
  nextTxt: {
    fontFamily: fonts.textoExtra,
    color: colors.violetaProfundo,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  finishTxt: {
    fontFamily: fonts.tituloNarrativa,
    fontStyle: 'italic',
    color: colors.violetaProfundo,
    fontSize: 20,
  },
  hint: {
    fontFamily: fonts.texto,
    color: colors.lavanda,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },

  emptyCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.18)',
  },
  emptyTxt: {
    fontFamily: fonts.texto,
    color: colors.lilasSonho,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
