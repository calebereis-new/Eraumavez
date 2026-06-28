// Tela "Sobre o Era Uma Vez"
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AppHeader } from '@/src/components/AppHeader';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { StarrySky } from '@/src/components/brand/StarrySky';
import { Wordmark } from '@/src/components/brand/Wordmark';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

const APP_VERSION = '1.0.0';

export default function SobreScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="sobre-screen">
      <StarrySky seed="sobre-bg" density={48} opacity={0.16} />
      <AppHeader showBack />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.violetaCrepusculo, colors.noiteAmeixa]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <StarrySky seed="sobre-hero" density={28} opacity={0.28} />
          <View style={styles.brandRow}>
            <MoonMark size={64} />
          </View>
          <View style={{ alignItems: 'center', marginTop: spacing.md }}>
            <Wordmark width={200} />
          </View>
        </LinearGradient>

        <Text style={styles.spirit}>
          “Toda história começa com{' '}
          <Text style={styles.spiritEm}>‘Era uma vez’</Text> — o ritual que acende
          a imaginação da criança e tranquiliza o coração dos pais.”
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Para quem é</Text>
          <Text style={styles.cardText}>
            Para famílias com crianças de 3 a 6 anos que querem transformar a hora
            de dormir num momento de carinho, escuta e formação. Cada história tem
            menos de 5 minutos, começa com “Era uma vez” e ensina um valor — coragem,
            humildade, generosidade, gratidão e muitos outros.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como navegar</Text>
          <Text style={styles.cardText}>
            Explore as prateleiras na <Text style={styles.cardEm}>Início</Text>,
            mergulhe nos universos pelo <Text style={styles.cardEm}>Universos</Text>,
            descubra histórias por <Text style={styles.cardEm}>Valor</Text> e guarde
            as preferidas em <Text style={styles.cardEm}>Favoritos</Text>. A qualquer
            momento, ative o <Text style={styles.cardEm}>Modo Noite</Text> dentro
            de uma história para deixar a tela ainda mais aconchegante.
          </Text>
        </View>

        <View style={styles.versionBox}>
          <Text style={styles.versionLabel}>Versão</Text>
          <Text style={styles.versionValue}>{APP_VERSION}</Text>
        </View>

        <Text style={styles.signature}>Feito com carinho para a hora mais bonita do dia.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  heroCard: {
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.25)',
    marginBottom: spacing.xl,
  },
  brandRow: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(233,178,76,0.12)',
    borderWidth: 1, borderColor: 'rgba(233,178,76,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  spirit: {
    fontFamily: fonts.tituloNarrativa,
    color: colors.cremeLencol,
    fontSize: 20, lineHeight: 30,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  spiritEm: { color: colors.douradoEstrela },
  card: {
    backgroundColor: colors.violetaCrepusculo,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.08)',
  },
  cardTitle: {
    fontFamily: fonts.titulo,
    color: colors.cremeLencol,
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  cardText: { fontFamily: fonts.texto, color: colors.lilasSonho, fontSize: 14, lineHeight: 22 },
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
  versionLabel: { fontFamily: fonts.textoExtra, color: colors.cremeLencol, fontSize: 11, letterSpacing: 0.6 },
  versionValue: { fontFamily: fonts.textoBold, color: colors.douradoEstrela, fontSize: 14 },
  signature: {
    fontFamily: fonts.tituloNarrativa,
    color: colors.lilasSonho,
    fontSize: 14, textAlign: 'center',
    marginTop: spacing.xl,
  },
});
