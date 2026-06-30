// Era Uma Vez — design tokens
// Fonte de verdade: identidade visual refinada (2026).
// Use SEMPRE essas variáveis, nunca hex soltos.

export const colors = {
  // Principais — fundo base muito escuro azulado violeta
  noiteAmeixa: '#0B0717', // base fundo (~60%) — passou a ser o noite-profundo
  douradoEstrela: '#E9B24C', // acento precioso (logo, estrelas, chamadas) (~10%)

  // Secundárias do gradiente noturno
  violetaCrepusculo: '#3D2363', // topo do gradiente de tela
  noiteMeio: '#1B1030', // meio do gradiente
  noiteFundo: '#160E2A', // bg de barras (nav inferior, modais)
  violetaProfundo: '#241541', // tinta escura/textos sobre claro

  // Lavandas
  lavanda: '#9A86C0', // texto secundário
  lilasSonho: '#C8B2E6', // texto subtítulo
  ameixaPro: '#7C68A8', // texto inativo

  coralEntardecer: '#E98B6B',
  azulAnoitecer: '#4E84A6',
  cremeLencol: '#F6EFE1', // textos/cards sobre escuro (~30%)
  cremeForte: '#FBF5E8', // títulos cremes mais brancos

  // Apoio
  tinta: '#241541', // texto sobre claro
  cremeFundo: '#EFE4CE',

  // Modo Noite (ainda mais profundo)
  noiteProfunda: '#070410',

  // Seções
  secBiblicas: '#C99A3A',
  secHerois: '#4E84A6',
  secPrincesas: '#D87B9C',
  secAnimais: '#6E8E63',
  secContos: '#7A5DAE',
  secOutros: '#9A86C0',
} as const;

export const universoCor = (universo: string): string => {
  const k = (universo || '').toLowerCase();
  if (k.includes('bíblic') || k.includes('biblic')) return colors.secBiblicas;
  if (k.includes('super')) return colors.secHerois;
  if (k.includes('princes')) return colors.secPrincesas;
  if (k.includes('animais') || k.includes('animal')) return colors.secAnimais;
  if (k.includes('conto')) return colors.secContos;
  if (k.includes('históric') || k.includes('historic')) return colors.violetaCrepusculo;
  if (k.includes('mundo')) return colors.azulAnoitecer;
  return colors.secOutros;
};

export const fonts = {
  titulo: 'Cormorant_600SemiBold',
  tituloNarrativa: 'Cormorant_600SemiBold_Italic',
  texto: 'Nunito_400Regular',
  textoBold: 'Nunito_700Bold',
  textoExtra: 'Nunito_800ExtraBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

export const shadows = {
  card: {
    boxShadow: '0 8px 22px rgba(0, 0, 0, 0.42)',
    elevation: 6,
  },
};

// Gradiente padrão de fundo das telas — topo violeta → fundo escuro.
export const gradientNoiteTela = [colors.violetaCrepusculo, colors.noiteMeio, colors.noiteAmeixa] as const;

export type FontKey = keyof typeof fonts;
