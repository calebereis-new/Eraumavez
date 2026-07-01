// Tela de FIM da história — Lua + "Fim" + valor de hoje + gostei/não + ações.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowCounterClockwise, CaretRight, ThumbsDown, ThumbsUp } from 'phosphor-react-native';
import { useEffect, useState } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { MoonMark } from '@/src/components/brand/MoonMark';
import { api, Historia } from '@/src/api/catalog';
import { setLike, LikeState } from '@/src/store/history';
import { getActiveProfileId } from '@/src/store/profiles';
import { useCatalog } from '@/src/hooks/use-catalog';
import { colors, fonts, radius, spacing } from '@/src/theme/tokens';

export default function FimHistoria() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories } = useCatalog();
  const [historia, setHistoria] = useState<Historia | null>(null);
  const [like, setLikeUI] = useState<LikeState>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setProfileId(await getActiveProfileId());
      if (id) {
        const h = await api.getStory(id);
        setHistoria(h);
      }
    })();
  }, [id]);

  const proxima = (() => {
    if (!historia || !stories.length) return null;
    const idx = stories.findIndex((s) => s.id === historia.id);
    if (idx < 0) return null;
    return stories[(idx + 1) % stories.length];
  })();

  const onLike = async (v: LikeState) => {
    setLikeUI(v);
    if (profileId && historia) {
      await setLike(profileId, historia.id, v);
    }
  };

  return (
    <ScreenBg seed={`fim-${id}`} density={36}>
      <View style={[styles.wrap, { paddingTop: insets.top + 60 }]}>
        <View style={styles.moonGlow}>
          <MoonMark size={58} />
        </View>
        <Text style={styles.fim}>Fim</Text>

        {historia ? (
          <View style={styles.valorCard}>
            <Text style={styles.valorLabel}>O VALOR DE HOJE</Text>
            <Text style={styles.valorNome}>{historia.valor_principal}</Text>
            <Text style={styles.valorTxt}>
              {historia.pergunta || `Hoje aprendemos sobre ${historia.valor_principal.toLowerCase()}.`}
            </Text>
          </View>
        ) : null}

        <Text style={styles.ask}>Você gostou desta história?</Text>

        <View style={styles.likeRow}>
          <Pressable
            onPress={() => onLike(like === 'like' ? null : 'like')}
            style={[styles.likeBtn, like === 'like' && styles.likeBtnPrimary]}
            testID="fim-like"
          >
            <ThumbsUp
              size={22}
              color={like === 'like' ? colors.violetaProfundo : colors.cremeLencol}
              weight={like === 'like' ? 'fill' : 'regular'}
            />
            <Text style={[styles.likeTxt, like === 'like' && styles.likeTxtPrimary]}>Gostei</Text>
          </Pressable>
          <Pressable
            onPress={() => onLike(like === 'dislike' ? null : 'dislike')}
            style={[styles.likeBtn, like === 'dislike' && styles.likeBtnDislike]}
            testID="fim-dislike"
          >
            <ThumbsDown
              size={22}
              color={like === 'dislike' ? colors.cremeLencol : colors.lavanda}
              weight={like === 'dislike' ? 'fill' : 'regular'}
            />
            <Text style={[styles.likeTxt, like === 'dislike' && { color: colors.cremeLencol }]}>Não gostei</Text>
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.action} onPress={() => router.replace(`/historia/${id}`)} testID="fim-replay">
            <ArrowCounterClockwise size={15} color={colors.lilasSonho} weight="regular" />
            <Text style={styles.actionTxt}>De novo</Text>
          </Pressable>
          <Pressable
            style={[styles.action, styles.actionPrimary]}
            onPress={() => proxima && router.replace(`/historia/${proxima.id}`)}
            disabled={!proxima}
            testID="fim-next"
          >
            <Text style={styles.actionTxtPrimary}>Próxima história</Text>
            <CaretRight size={15} color={colors.douradoEstrela} weight="bold" />
          </Pressable>
        </View>

        <Pressable style={styles.toHome} onPress={() => router.replace('/(tabs)')} testID="fim-home">
          <Text style={styles.toHomeTxt}>Voltar ao início</Text>
        </Pressable>
      </View>
    </ScreenBg>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', paddingHorizontal: 28 },
  moonGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(233,178,76,0.10)',
  },
  fim: { fontFamily: fonts.tituloNarrativa, fontStyle: 'italic', fontSize: 36, color: colors.cremeForte, marginTop: 16 },

  valorCard: {
    marginTop: 26,
    width: '100%',
    padding: 18,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(233,178,76,0.22)',
  },
  valorLabel: { fontFamily: fonts.textoExtra, fontSize: 11, letterSpacing: 1.6, color: colors.lavanda },
  valorNome: { fontFamily: fonts.titulo, fontSize: 26, color: colors.douradoEstrela, marginTop: 4 },
  valorTxt: { fontFamily: fonts.texto, fontSize: 13, lineHeight: 19, color: colors.lilasSonho, marginTop: 10 },

  ask: { fontFamily: fonts.tituloNarrativa, fontStyle: 'italic', fontSize: 18, color: colors.cremeLencol, marginTop: 24 },
  likeRow: { flexDirection: 'row', gap: 12, marginTop: 14, width: '100%' },
  likeBtn: {
    flex: 1,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.2)',
  },
  likeBtnPrimary: { backgroundColor: colors.douradoEstrela, borderColor: colors.douradoEstrela },
  likeBtnDislike: { backgroundColor: 'rgba(154,134,192,0.35)', borderColor: 'rgba(154,134,192,0.5)' },
  likeTxt: { fontFamily: fonts.textoExtra, fontSize: 12, color: colors.lilasSonho },
  likeTxtPrimary: { color: colors.violetaProfundo },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 18, width: '100%' },
  action: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.2)',
  },
  actionPrimary: { flex: 1.4, backgroundColor: 'rgba(233,178,76,0.16)', borderColor: 'rgba(233,178,76,0.4)' },
  actionTxt: { fontFamily: fonts.textoBold, color: colors.lilasSonho, fontSize: 12 },
  actionTxtPrimary: { fontFamily: fonts.textoExtra, color: colors.douradoEstrela, fontSize: 12 },

  toHome: { marginTop: 18, paddingVertical: 10 },
  toHomeTxt: { fontFamily: fonts.textoBold, color: colors.lavanda, fontSize: 12 },
});
