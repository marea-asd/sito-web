// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

// Meta Pixel: caricato da ~/components/common/CookieConsent.astro dopo il consenso
// marketing (Iubenda), quindi presente su window solo a runtime.
interface Window {
  fbq?: (...args: unknown[]) => void;
}
