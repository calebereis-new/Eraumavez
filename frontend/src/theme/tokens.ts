// Era Uma Vez — design tokens
// Fonte de verdade: cores.css e tipografia.css fornecidos pela marca.
// Use SEMPRE essas variáveis, nunca hex soltos.

export const colors = {
  // Principais
  noiteAmeixa: '#2A1844', // base de quase tudo (~60%)
  douradoEstrela: '#E9B24C', // acento precioso (logo, estrelas, chamadas) (~10%)

  // Secundárias
  violetaCrepusculo: '#3D2363',
  lilasSonho: '#C8B2E6',
  coralEntardecer: '#E98B6B',
  azulAnoitecer: '#4E84A6',
  cremeLencol: '#F6EFE1', // textos/cards sobre escuro (~30%)

  // Apoio
  tinta: '#241541', // texto sobre claro
  cremeFundo: '#EFE4CE',

  // Modo Noite (mais profundo que ameixa)
  noiteProfunda: '#170A28',

  // Seções
  secBiblicas: '#C99A3A',
  secHerois: '#4E84A6',
  secPrincesas: '#D87B9C',
  secAnimais: '#6E8E63',
  secContos: '#5B3A8C',
  secOutros: '#7A5BB0',
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
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const shadows = {
  card: {
    // Versão moderna (web + RN >=0.76)
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.35)',
    // Fallback Android
    elevation: 6,
  },
};

export type FontKey = keyof typeof fonts;
