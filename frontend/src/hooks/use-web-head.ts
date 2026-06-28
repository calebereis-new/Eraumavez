// Era Uma Vez — injeção runtime das meta tags / manifest / favicons / splash.
// Funciona em DEV e em PROD (no preview a Expo gera um <head> mínimo;
// aqui completamos as tags do PWA quando estamos na web).
import { useEffect } from 'react';
import { Platform } from 'react-native';

type Tag =
  | { type: 'meta'; name?: string; property?: string; httpEquiv?: string; content: string }
  | { type: 'link'; rel: string; href: string; sizes?: string; mime?: string }
  | { type: 'title'; content: string }
  | { type: 'lang'; content: string };

const TAGS: Tag[] = [
  { type: 'title', content: 'Era Uma Vez · Histórias para dormir' },
  { type: 'lang', content: 'pt-BR' },
  {
    type: 'meta',
    name: 'description',
    content: 'Histórias curtas para a hora de dormir, que encantam a criança e formam o caráter.',
  },
  { type: 'meta', name: 'application-name', content: 'Era Uma Vez' },
  { type: 'meta', name: 'theme-color', content: '#2A1844' },
  { type: 'meta', name: 'color-scheme', content: 'dark' },
  {
    type: 'meta',
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no',
  },
  // Favicons
  { type: 'link', rel: 'icon', href: '/favicon.svg', mime: 'image/svg+xml' },
  { type: 'link', rel: 'icon', href: '/favicon-32.png', mime: 'image/png', sizes: '32x32' },
  { type: 'link', rel: 'icon', href: '/favicon-16.png', mime: 'image/png', sizes: '16x16' },
  { type: 'link', rel: 'shortcut icon', href: '/favicon-32.png' },
  // PWA
  { type: 'link', rel: 'manifest', href: '/manifest.webmanifest' },
  { type: 'link', rel: 'apple-touch-icon', href: '/apple-touch-icon-180.png', sizes: '180x180' },
  { type: 'meta', name: 'apple-mobile-web-app-capable', content: 'yes' },
  { type: 'meta', name: 'mobile-web-app-capable', content: 'yes' },
  { type: 'meta', name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  { type: 'meta', name: 'apple-mobile-web-app-title', content: 'Era Uma Vez' },
  // Open Graph
  { type: 'meta', property: 'og:type', content: 'website' },
  { type: 'meta', property: 'og:title', content: 'Era Uma Vez · Histórias para dormir' },
  {
    type: 'meta',
    property: 'og:description',
    content: 'Histórias curtas para a hora de dormir, que encantam a criança e formam o caráter.',
  },
  { type: 'meta', property: 'og:image', content: '/og-image.png' },
  { type: 'meta', property: 'og:image:width', content: '1200' },
  { type: 'meta', property: 'og:image:height', content: '630' },
  { type: 'meta', property: 'og:locale', content: 'pt_BR' },
  { type: 'meta', property: 'og:site_name', content: 'Era Uma Vez' },
  // Twitter
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:title', content: 'Era Uma Vez · Histórias para dormir' },
  {
    type: 'meta',
    name: 'twitter:description',
    content: 'Histórias curtas para a hora de dormir, que encantam a criança e formam o caráter.',
  },
  { type: 'meta', name: 'twitter:image', content: '/og-image.png' },
];

const SPLASH_HTML = `
  <div id="euv-splash" aria-hidden="true">
    <div class="euv-splash-stars"></div>
    <div class="euv-splash-mark">
      <svg viewBox="0 0 48 48" width="120" height="120" aria-label="Era Uma Vez">
        <defs>
          <mask id="splash-moon-mask">
            <rect width="48" height="48" fill="#fff" />
            <circle cx="30" cy="20" r="13" fill="#000" />
          </mask>
        </defs>
        <circle cx="24" cy="24" r="14" fill="#E9B24C" mask="url(#splash-moon-mask)" />
        <path d="M24 5l1.5 3.3 3.6.4-2.7 2.4.8 3.5L24 12.3 20.8 14.6l.8-3.5-2.7-2.4 3.6-.4z" fill="#E9B24C" />
      </svg>
      <div class="euv-splash-wordmark">Era uma vez</div>
    </div>
  </div>
`;

const SPLASH_CSS = `
  html, body { background-color: #2A1844 !important; }
  #euv-splash {
    position: fixed; inset: 0; z-index: 99999;
    background: #2A1844;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
    animation: euv-splash-out 700ms ease-out 1600ms forwards;
  }
  .euv-splash-stars {
    position: absolute; inset: 0; opacity: 0;
    background-image:
      radial-gradient(1.4px 1.4px at 12% 18%, rgba(246,239,225,.9), transparent 60%),
      radial-gradient(1.2px 1.2px at 78% 22%, rgba(246,239,225,.7), transparent 60%),
      radial-gradient(1.6px 1.6px at 30% 80%, rgba(246,239,225,.85), transparent 60%),
      radial-gradient(1.0px 1.0px at 65% 70%, rgba(246,239,225,.7), transparent 60%),
      radial-gradient(1.3px 1.3px at 50% 35%, rgba(246,239,225,.75), transparent 60%),
      radial-gradient(1.1px 1.1px at 88% 60%, rgba(246,239,225,.6), transparent 60%),
      radial-gradient(1.0px 1.0px at 20% 55%, rgba(246,239,225,.6), transparent 60%),
      radial-gradient(1.4px 1.4px at 90% 88%, rgba(246,239,225,.7), transparent 60%),
      radial-gradient(1.2px 1.2px at 8% 70%, rgba(246,239,225,.5), transparent 60%),
      radial-gradient(1.0px 1.0px at 42% 12%, rgba(246,239,225,.65), transparent 60%);
    animation: euv-stars-in 1400ms ease-out 200ms forwards;
  }
  .euv-splash-mark {
    position: relative;
    display: flex; flex-direction: column; align-items: center; gap: 18px;
    opacity: 0; transform: translateY(8px);
    animation: euv-mark-in 900ms ease-out 250ms forwards;
  }
  .euv-splash-wordmark {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic; font-size: 26px; color: #F6EFE1; letter-spacing: 0.6px;
    opacity: 0.95;
  }
  @keyframes euv-stars-in { from { opacity: 0 } to { opacity: 0.85 } }
  @keyframes euv-mark-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes euv-splash-out { from { opacity: 1 } to { opacity: 0; visibility: hidden } }
`;

function ensureTag(t: Tag) {
  const doc = document;
  if (t.type === 'title') {
    doc.title = t.content;
    return;
  }
  if (t.type === 'lang') {
    doc.documentElement.lang = t.content;
    return;
  }
  let selector = '';
  if (t.type === 'meta') {
    if (t.name) selector = `meta[name="${t.name}"]`;
    else if (t.property) selector = `meta[property="${t.property}"]`;
    else if (t.httpEquiv) selector = `meta[http-equiv="${t.httpEquiv}"]`;
  } else if (t.type === 'link') {
    selector = `link[rel="${t.rel}"]${t.sizes ? `[sizes="${t.sizes}"]` : ''}`;
  }
  const existing = selector ? doc.head.querySelector(selector) : null;
  const el = (existing as HTMLElement) ?? doc.createElement(t.type);
  if (t.type === 'meta') {
    if (t.name) el.setAttribute('name', t.name);
    if (t.property) el.setAttribute('property', t.property);
    if (t.httpEquiv) el.setAttribute('http-equiv', t.httpEquiv);
    el.setAttribute('content', t.content);
  } else if (t.type === 'link') {
    el.setAttribute('rel', t.rel);
    el.setAttribute('href', t.href);
    if (t.sizes) el.setAttribute('sizes', t.sizes);
    if (t.mime) el.setAttribute('type', t.mime);
  }
  if (!existing) doc.head.appendChild(el);
}

function injectSplash() {
  if (document.getElementById('euv-splash')) return;
  const style = document.createElement('style');
  style.id = 'euv-splash-style';
  style.textContent = SPLASH_CSS;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.innerHTML = SPLASH_HTML;
  document.body.appendChild(wrap.firstElementChild as HTMLElement);

  // Remove o nó após a animação para liberar pointer-events
  setTimeout(() => {
    const el = document.getElementById('euv-splash');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }, 2600);
}

export function useWebHead() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      for (const t of TAGS) ensureTag(t);
      injectSplash();
    } catch {
      // ignore — não bloqueia o app
    }
  }, []);
}
