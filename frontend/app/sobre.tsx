// Tela "Sobre o Era Uma Vez"
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/components/AppHeader';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { ScreenBg } from '@/src/components/ScreenBg';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

const APP_VERSION = '1.0.0';

export default function SobreScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScreenBg seed="sobre-bg" density={40}>
      <View style={{ paddingTop: insets.top }} testID="sobre-screen">
        <AppHeader showBack />
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: 80 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header compacto — só a lua dourada + título italicizado */}
          <View style={styles.hero}>
            <MoonMark size={44} />
            <Text style={styles.heroTitle}>
              Era uma <Text style={styles.heroTitleAccent}>vez</Text>
            </Text>
          </View>

          <Text style={styles.spirit}>
            “Toda história começa com{' '}
            <Text style={styles.spiritEm}>‘Era uma vez’</Text> — o ritual que acende
            a imaginação da criança e tranquiliza o coração dos pais.”
          </Text>

          <View style={styles.card} testID="sobre-card-oque">
            <Text style={styles.cardTitle}>O que é</Text>
            <Text style={styles.cardText}>
              Histórias infantis criadas com um modelo previamente treinado para
              trazer uma linguagem adequada, histórias bem estruturadas e sempre
              ensinar valores para nossos filhos.
            </Text>
          </View>

          <View style={styles.card} testID="sobre-card-paraquem">
            <Text style={styles.cardTitle}>Para quem é</Text>
            <Text style={styles.cardText}>
              Famílias que querem transformar a hora de dormir num momento de
              carinho, escuta e formação.
            </Text>
          </View>

          <View style={styles.card} testID="sobre-card-comonavegar">
            <Text style={styles.cardTitle}>Como navegar</Text>
            <Text style={styles.cardText}>
              Percorra as prateleiras no{' '}
              <Text style={styles.cardEm}>Início</Text>, use o{' '}
              <Text style={styles.cardEm}>Explorar</Text> para navegar entre
              universos e valores e veja em seu{' '}
              <Text style={styles.cardEm}>Perfil</Text> as histórias que já leu,
              curtiu e suas favoritas.
            </Text>
          </View>

          <View style={styles.versionBox}>
            <Text style={styles.versionLabel}>Versão</Text>
            <Text style={styles.versionValue}>{APP_VERSION}</Text>
          </View>

          <Text style={styles.signature}>
            Feito com carinho para a hora mais bonita do dia.
          </Text>
        </ScrollView>
      </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontFamily: fonts.tituloNarrativa,
    fontStyle: 'italic',
    fontSize: 30,
    color: colors.cremeForte,
    lineHeight: 34,
  },
  heroTitleAccent: { color: colors.douradoEstrela },

  spirit: {
    fontFamily: fonts.tituloNarrativa,
    fontStyle: 'italic',
    color: colors.cremeLencol,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  spiritEm: { color: colors.douradoEstrela },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.16)',
  },
  cardTitle: {
    fontFamily: fonts.titulo,
    color: colors.douradoEstrela,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontFamily: fonts.texto,
    color: colors.lilasSonho,
    fontSize: 14,
    lineHeight: 22,
  },
  cardEm: { color: colors.cremeLencol, fontFamily: fonts.textoBold },

  versionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(233,178,76,0.08)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.3)',
    marginTop: spacing.md,
  },
  versionLabel: {
    fontFamily: fonts.textoExtra,
    color: colors.cremeLencol,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  versionValue: {
    fontFamily: fonts.textoBold,
    color: colors.douradoEstrela,
    fontSize: 14,
  },
  signature: {
    fontFamily: fonts.tituloNarrativa,
    fontStyle: 'italic',
    color: colors.lilasSonho,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
