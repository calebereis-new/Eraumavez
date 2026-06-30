// Aba PERFIL — perfil ativo com avatar, stats, histórico de leituras
// (gostei/não gostei) e sub-aba Favoritos. Permite trocar de perfil.
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowsLeftRight, Star, ThumbsDown, ThumbsUp } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';

import { ScreenBg } from '@/src/components/ScreenBg';
import { StoryCard } from '@/src/components/StoryCard';
import { useCatalog } from '@/src/hooks/use-catalog';
import { useFavorites } from '@/src/store/favorites';
import {
  Profile,
  getActiveProfileId,
  listProfiles,
  setActiveProfileId,
} from '@/src/store/profiles';
import { computeStats, HistoryEntry, listHistory } from '@/src/store/history';
import { colors, fonts, radius, spacing, universoCor } from '@/src/theme/tokens';

type Tab = 'lidas' | 'favoritos';

function relTime(iso: string): string {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff <= 0) return 'hoje';
  if (diff === 1) return 'ontem';
  return `${diff} dias`;
}

function initials(nome: string): string {
  return (nome.trim().split(/\s+/)[0]?.[0] ?? '?').toUpperCase();
}

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stories } = useCatalog();
  const { ids: favIds, refresh: refreshFav } = useFavorites();
  const [tab, setTab] = useState<Tab>('lidas');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [active, setActive] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(async () => {
    const [list, actId] = await Promise.all([listProfiles(), getActiveProfileId()]);
    setProfiles(list);
    const cur = list.find((p) => p.id === actId) ?? null;
    setActive(cur);
    if (cur) {
      setEntries(await listHistory(cur.id));
    } else {
      setEntries([]);
    }
    await refreshFav();
  }, [refreshFav]);

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  const stats = useMemo(() => computeStats(entries), [entries]);
  const favStories = useMemo(
    () => favIds.map((id) => stories.find((s) => s.id === id)).filter(Boolean) as typeof stories,
    [favIds, stories],
  );

  const trocar = () => {
    Alert.alert(
      'Trocar de perfil',
      profiles.length > 1
        ? 'Quem vai sonhar agora?'
        : 'Quer voltar para a tela de seleção de perfis?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Trocar',
          onPress: async () => {
            await setActiveProfileId(null);
            router.replace('/auth/perfis');
          },
        },
      ],
    );
  };

  if (!active) {
    return (
      <ScreenBg seed="perfil-empty">
        <View style={styles.emptyAll}>
          <Text style={styles.emptyTitle}>Nenhum perfil ativo</Text>
          <Pressable style={styles.cta} onPress={() => router.push('/auth/perfis')} testID="perfil-go-select">
            <Text style={styles.ctaTxt}>Escolher perfil</Text>
          </Pressable>
        </View>
      </ScreenBg>
    );
  }

  const [from, to] = active.cor.split('|');

  return (
    <ScreenBg seed="perfil-bg">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER perfil */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing.lg }]}>
          <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
            <Text style={styles.avatarTxt}>{initials(active.nome)}</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{active.nome}</Text>
            <Text style={styles.sub}>
              {active.idade ? `${active.idade} anos · ` : ''}desde {new Date(active.desdeISO).toLocaleDateString('pt-BR', { month: 'long' })}
            </Text>
          </View>
          <Pressable onPress={trocar} hitSlop={10} style={styles.switchBtn} testID="perfil-trocar">
            <ArrowsLeftRight size={18} color={colors.lilasSonho} weight="regular" />
          </Pressable>
        </View>

        {/* STATS */}
        <View style={[styles.statsRow, { paddingHorizontal: spacing.lg }]}>
          <Stat n={stats.total} label="histórias" />
          <Stat n={stats.streak} label="noites seguidas" />
          <Stat n={stats.valores} label="valores" />
        </View>

        {/* TABS */}
        <View style={[styles.tabs, { marginHorizontal: spacing.lg }]} testID="perfil-tabs">
          {(['lidas', 'favoritos'] as const).map((t) => {
            const a = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tabBtn, a && styles.tabBtnActive]}
                testID={`perfil-tab-${t}`}
              >
                {t === 'lidas' ? (
                  <ThumbsUp size={13} color={a ? colors.violetaProfundo : colors.lilasSonho} weight={a ? 'fill' : 'regular'} />
                ) : (
                  <Star size={13} color={a ? colors.violetaProfundo : colors.lilasSonho} weight={a ? 'fill' : 'regular'} />
                )}
                <Text style={[styles.tabTxt, a && styles.tabTxtActive]}>
                  {t === 'lidas' ? 'Histórias lidas' : 'Favoritos'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'lidas' ? (
          entries.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Ainda nenhuma noite registrada</Text>
              <Text style={styles.emptyTxt}>
                Abra uma história e ela aparece aqui — com botão de gostei.
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: spacing.lg, gap: 10, marginTop: spacing.md }}>
              {entries.map((e) => (
                <Pressable
                  key={`${e.storyId}-${e.whenISO}`}
                  onPress={() => router.push(`/historia/${e.storyId}`)}
                  style={styles.entry}
                  testID={`history-entry-${e.storyId}`}
                >
                  <View style={[styles.entryThumb, { backgroundColor: universoCor(e.universo) }]} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={styles.entryTitle}>{e.storyTitulo}</Text>
                    <Text style={styles.entryMeta}>{e.valor} · {relTime(e.whenISO)}</Text>
                  </View>
                  {e.like === 'like' ? (
                    <ThumbsUp size={19} color={colors.douradoEstrela} weight="fill" />
                  ) : e.like === 'dislike' ? (
                    <ThumbsDown size={19} color={colors.lavanda} weight="fill" />
                  ) : null}
                </Pressable>
              ))}
            </View>
          )
        ) : favStories.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Ainda não há favoritas</Text>
            <Text style={styles.emptyTxt}>
              Toque na estrelinha de uma história para guardá-la aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favStories}
            keyExtractor={(it) => it.id}
            numColumns={3}
            columnWrapperStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
            contentContainerStyle={{ paddingTop: spacing.md, rowGap: spacing.md }}
            renderItem={({ item }) => <StoryCard story={item} size="sm" />}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </ScreenBg>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: spacing.sm },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: colors.cremeForte, fontFamily: fonts.titulo, fontSize: 30 },
  name: { color: colors.cremeForte, fontFamily: fonts.titulo, fontSize: 24, lineHeight: 26 },
  sub: { color: colors.lavanda, fontFamily: fonts.texto, fontSize: 12, marginTop: 3, textTransform: 'capitalize' },
  switchBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(200,178,230,0.2)',
  },

  statsRow: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(200,178,230,0.14)',
    alignItems: 'center',
  },
  statN: { fontFamily: fonts.titulo, fontSize: 26, color: colors.douradoEstrela, lineHeight: 26 },
  statLabel: { fontFamily: fonts.textoExtra, fontSize: 10, color: colors.lavanda, marginTop: 5 },

  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radius.md, padding: 4, marginTop: spacing.lg },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6, borderRadius: radius.sm },
  tabBtnActive: { backgroundColor: colors.douradoEstrela },
  tabTxt: { color: colors.lilasSonho, fontFamily: fonts.textoBold, fontSize: 12 },
  tabTxtActive: { color: colors.violetaProfundo, fontFamily: fonts.textoExtra },

  entry: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    paddingVertical: 6,
  },
  entryThumb: { width: 48, height: 48, borderRadius: radius.md },
  entryTitle: { fontFamily: fonts.textoBold, fontSize: 13, color: colors.cremeLencol },
  entryMeta: { fontFamily: fonts.texto, fontSize: 11, color: colors.lavanda, marginTop: 2 },

  emptyAll: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  emptyTitle: { fontFamily: fonts.titulo, color: colors.cremeLencol, fontSize: 22, textAlign: 'center' },
  emptyTxt: { fontFamily: fonts.texto, color: colors.lavanda, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  cta: { height: 46, paddingHorizontal: 24, borderRadius: radius.md, backgroundColor: colors.douradoEstrela, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { fontFamily: fonts.textoExtra, color: colors.violetaProfundo, fontSize: 14 },
});
