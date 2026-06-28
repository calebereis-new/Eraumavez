// Navegação por VALOR — lista de valores com contagem; toque mostra histórias.
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretRight, Star } from 'phosphor-react-native';
import { useMemo } from 'react';

import { AppHeader } from '@/src/components/AppHeader';
import { useCatalog } from '@/src/hooks/use-catalog';
import { todosValores, valoresSecundariosArr } from '@/src/api/catalog';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

export default function Valores() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories, loading } = useCatalog();

  const items = useMemo(() => {
    const valores = todosValores(stories);
    return valores.map((v) => {
      const count = stories.filter(
        (h) =>
          h.valor_principal === v ||
          valoresSecundariosArr(h).some((x) => x === v),
      ).length;
      return { valor: v, count };
    });
  }, [stories]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="valores-screen">
      <AppHeader greeting="Por valor" subtitle="Escolha o que vai colorir essa noite" />
      <FlatList
        data={items}
        keyExtractor={(it) => it.valor}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/valor/[nome]', params: { nome: item.valor } })}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}
            testID={`valor-row-${item.valor}`}
          >
            <View style={styles.icon}>
              <Star size={14} color={colors.douradoEstrela} weight="fill" />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.valor}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{item.count}</Text>
            </View>
            <CaretRight size={16} color={colors.lilasSonho} weight="light" />
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>Quando houver histórias, os valores aparecem aqui.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.noiteAmeixa },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.violetaCrepusculo,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(246,239,225,0.06)',
    gap: spacing.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(233,178,76,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 15 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(246,239,225,0.1)',
  },
  countText: { color: colors.cremeLencol, fontFamily: fonts.textoBold, fontSize: 12 },
  empty: { color: colors.lilasSonho, fontFamily: fonts.texto, textAlign: 'center', marginTop: spacing.xl },
});
