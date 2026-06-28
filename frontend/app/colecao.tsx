// Tela: histórias de UMA coleção dentro de um universo.
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/components/AppHeader';
import { StoryGrid } from '@/src/components/StoryGrid';
import { useCatalog } from '@/src/hooks/use-catalog';
import { historiasPorColecao } from '@/src/api/catalog';
import { colors, universoCor } from '@/src/theme/tokens';

export default function ColecaoScreen() {
  const { universo, colecao } = useLocalSearchParams<{ universo: string; colecao: string }>();
  const insets = useSafeAreaInsets();
  const { stories } = useCatalog();

  const list = useMemo(
    () => historiasPorColecao(stories, universo ?? '', colecao ?? ''),
    [stories, universo, colecao],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="colecao-screen">
      <AppHeader showBack />
      <StoryGrid
        title={colecao ?? ''}
        subtitle={universo ?? ''}
        badge="COLEÇÃO"
        accent={universoCor(universo ?? '')}
        stories={list}
        testID="colecao-grid"
      />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.noiteAmeixa } });
