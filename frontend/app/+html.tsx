// Era Uma Vez — documento HTML customizado para a versão web do Expo Router.
// Define <title>, favicons, meta tags (SEO + Open Graph + Twitter Card),
// vincula o PWA manifest e injeta a splash screen estilizada da marca.
// @ts-nocheck
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no"
        />

        <title>Era Uma Vez · Histórias para dormir</title>

        {/* SEO */}
        <meta
          name="description"
          content="Histórias curtas para a hora de dormir, que encantam a criança e formam o caráter."
        />
        <meta name="application-name" content="Era Uma Vez" />
        <meta name="theme-color" content="#2A1844" />
        <meta name="color-scheme" content="dark" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="shortcut icon" href="/favicon-32.png" />

        {/* PWA / iOS Add to Home Screen */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Era Uma Vez" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Era Uma Vez · Histórias para dormir" />
        <meta
          property="og:description"
          content="Histórias curtas para a hora de dormir, que encantam a criança e formam o caráter."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Era Uma Vez" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Era Uma Vez · Histórias para dormir" />
        <meta
          name="twitter:description"
          content="Histórias curtas para a hora de dormir, que encantam a criança e formam o caráter."
        />
        <meta name="twitter:image" content="/og-image.png" />

        <ScrollViewStyleReset />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body { background-color: #2A1844; }
              body > div:first-child { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; }
              [role="tablist"] [role="tab"] * { overflow: visible !important; }
              [role="heading"], [role="heading"] * { overflow: visible !important; }

              /* Splash screen */
              #euv-splash {
                position: fixed; inset: 0; z-index: 9999;
                background: #2A1844;
                display: flex; align-items: center; justify-content: center;
                pointer-events: none;
                animation: euv-splash-out 700ms ease-out 1600ms forwards;
              }
              .euv-splash-stars {
                position: absolute; inset: 0;
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
                opacity: 0;
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
            `,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#2A1844',
        }}
      >
        <div id="euv-splash" aria-hidden="true">
          <div className="euv-splash-stars" />
          <div className="euv-splash-mark">
            <svg viewBox="0 0 48 48" width="120" height="120" aria-label="Era Uma Vez">
              <defs>
                <mask id="splash-moon-mask">
                  <rect width="48" height="48" fill="#fff" />
                  <circle cx="30" cy="20" r="13" fill="#000" />
                </mask>
              </defs>
              <circle cx="24" cy="24" r="14" fill="#E9B24C" mask="url(#splash-moon-mask)" />
              <path
                d="M24 5l1.5 3.3 3.6.4-2.7 2.4.8 3.5L24 12.3 20.8 14.6l.8-3.5-2.7-2.4 3.6-.4z"
                fill="#E9B24C"
              />
            </svg>
            <div className="euv-splash-wordmark">Era uma vez</div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
