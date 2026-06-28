// Tela: histórias de UM valor.
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/components/AppHeader';
import { StoryGrid } from '@/src/components/StoryGrid';
import { useCatalog } from '@/src/hooks/use-catalog';
import { historiasPorValor } from '@/src/api/catalog';
import { colors } from '@/src/theme/tokens';

export default function ValorScreen() {
  const { nome } = useLocalSearchParams<{ nome: string }>();
  const insets = useSafeAreaInsets();
  const { stories } = useCatalog();

  const list = useMemo(() => (nome ? historiasPorValor(stories, nome) : []), [stories, nome]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="valor-screen">
      <AppHeader showBack />
      <StoryGrid
        title={nome ?? ''}
        subtitle="Histórias que cultivam esse valor"
        badge="Valor"
        accent={colors.coralEntardecer}
        stories={list}
        testID="valor-grid"
      />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.noiteAmeixa } });
