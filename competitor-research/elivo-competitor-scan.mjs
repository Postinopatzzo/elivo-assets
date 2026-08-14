#!/usr/bin/env node
/**
 * elivo-competitor-scan.mjs
 *
 * Scanner competitor su 8 dimensioni: backend, frontend, database, api,
 * cookies, policy, termini e condizioni, blueprint.
 *
 * Node puro, zero dipendenze. Stesse convenzioni di elivo-prospector.mjs.
 *
 * Uso:
 *   node elivo-competitor-scan.mjs                       # legge competitors.json
 *   node elivo-competitor-scan.mjs --input lista.json
 *   node elivo-competitor-scan.mjs --site esempio.it
 *   node elivo-competitor-scan.mjs --concurrency 3 --out ./report
 *
 * Output in ./report:
 *   scan-<data>.html   report dark, ordinato per punteggio
 *   scan-<data>.csv    una riga per sito, per Excel e CRM
 *   scan-<data>.json   dati grezzi completi
 *
 * Limite noto e dichiarato: legge solo i cookie impostati via header HTTP e
 * gli script presenti nell'HTML iniziale. I cookie scritti da JavaScript dopo
 * il render non vengono visti. Per quelli serve un passaggio con browser
 * headless. Il campo cookies.metodo lo segnala in ogni riga di output.
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const UA =
  'Mozilla/5.0 (compatible; ElivoCompetitorScan/1.0; +https://elivostudio.com)';

const TIMEOUT_MS = 20000;
const DELAY_MS = 400; // cortesia tra richieste allo stesso host

// ---------------------------------------------------------------------------
// Pesi. Somma 100. I cookie pesano piu di tutto perche sono l'esposizione
// legale piu concreta e la leva di vendita piu diretta in fase di audit.
// ---------------------------------------------------------------------------
const PESI = {
  backend: 15,
  frontend: 15,
  database: 10,
  api: 10,
  cookies: 20,
  policy: 10,
  termini: 8,
  blueprint: 12,
};

// ---------------------------------------------------------------------------
// Firme di riconoscimento
// ---------------------------------------------------------------------------
const CMP = [
  [/iubenda/i, 'Iubenda'],
  [/cookiebot|consent\.cookiebot/i, 'Cookiebot'],
  [/cookieyes|cky-consent/i, 'CookieYes'],
  [/onetrust|optanon/i, 'OneTrust'],
  [/complianz|cmplz/i, 'Complianz'],
  [/usercentrics/i, 'Usercentrics'],
  [/myagileprivacy|agile-?privacy/i, 'MyAgilePrivacy'],
  [/termly/i, 'Termly'],
  [/didomi/i, 'Didomi'],
  [/quantcast|cmp\.choice/i, 'Quantcast'],
  [/borlabs/i, 'Borlabs'],
  [/klaro/i, 'Klaro'],
];

const TRACKER = [
  [/googletagmanager\.com\/gtm\.js|dataLayer/i, 'Google Tag Manager'],
  [/gtag\/js|google-analytics\.com|analytics\.google\.com/i, 'Google Analytics'],
  [/connect\.facebook\.net|fbq\(/i, 'Meta Pixel'],
  [/static\.hotjar\.com|hjSetting/i, 'Hotjar'],
  [/clarity\.ms/i, 'Microsoft Clarity'],
  [/snap\.licdn\.com|linkedin\.com\/px/i, 'LinkedIn Insight'],
  [/analytics\.tiktok\.com/i, 'TikTok Pixel'],
  [/doubleclick\.net|googleadservices/i, 'Google Ads'],
  [/hs-scripts\.com|hubspot/i, 'HubSpot'],
  [/matomo|piwik/i, 'Matomo'],
  [/plausible\.io/i, 'Plausible (cookieless)'],
  [/cdn\.usefathom|fathom/i, 'Fathom (cookieless)'],
];

const FRONTEND = [
  [/\/_next\/|__NEXT_DATA__|next\/dist/i, 'Next.js'],
  [/\/_nuxt\/|__NUXT__/i, 'Nuxt'],
  [/astro-island|data-astro-cid|\/_astro\//i, 'Astro'],
  [/sveltekit|__sveltekit/i, 'SvelteKit'],
  [/\/_remix|remix-run/i, 'Remix'],
  [/gatsby-|___gatsby/i, 'Gatsby'],
  [/wp-content|wp-includes/i, 'WordPress'],
  [/webflow\.js|w-mod-js|assets\.website-files\.com/i, 'Webflow'],
  [/framerusercontent|framer\.com|__framer/i, 'Framer'],
  [/cdn\.shopify\.com|shopify/i, 'Shopify'],
  [/wix\.com|wixstatic|parastorage/i, 'Wix'],
  [/squarespace/i, 'Squarespace'],
  [/static\.parastorage/i, 'Wix Editor X'],
  [/elementor/i, 'WordPress + Elementor'],
  [/wpbakery|js_composer/i, 'WordPress + WPBakery'],
  [/et_pb_|divi/i, 'WordPress + Divi'],
  [/joomla/i, 'Joomla'],
  [/drupal/i, 'Drupal'],
  [/react|reactroot|data-reactid/i, 'React'],
  [/vue(\.min)?\.js|data-v-/i, 'Vue'],
  [/jquery/i, 'jQuery'],
];

const HOSTING = [
  [/cloudflare/i, 'Cloudflare'],
  [/vercel/i, 'Vercel'],
  [/netlify/i, 'Netlify'],
  [/x-amz|amazons3|cloudfront/i, 'AWS'],
  [/aruba/i, 'Aruba'],
  [/siteground/i, 'SiteGround'],
  [/kinsta/i, 'Kinsta'],
  [/wpengine/i, 'WP Engine'],
  [/fastly/i, 'Fastly'],
  [/akamai/i, 'Akamai'],
  [/github\.io|github/i, 'GitHub Pages'],
  [/register\.it|registerit/i, 'Register.it'],
  [/ovh/i, 'OVH'],
  [/hetzner/i, 'Hetzner'],
];

// Percorsi legali, in ordine di probabilita sul mercato italiano
const PATH_PRIVACY = [
  '/privacy-policy',
  '/privacy',
  '/informativa-privacy',
  '/privacy-policy/',
  '/it/privacy-policy',
  '/note-legali',
];
const PATH_COOKIE = [
  '/cookie-policy',
  '/cookie',
  '/informativa-cookie',
  '/cookie-policy/',
];
const PATH_TERMINI = [
  '/termini-e-condizioni',
  '/termini',
  '/condizioni-generali',
  '/terms',
  '/termini-condizioni',
  '/condizioni-di-servizio',
];

// Endpoint che rivelano il backend e la superficie API
const PROBE_API = [
  '/wp-json/',
  '/wp-json/wp/v2/users',
  '/api/',
  '/graphql',
  '/feed/',
];

// File che non dovrebbero mai essere pubblici.
// Attivi solo con --deep: cercare questi percorsi su un sito di terzi e a tutti
// gli effetti una scansione di vulnerabilita. Sul nostro sito e sui siti dei
// clienti si fa liberamente. Su un competitor va fatto con cognizione.
const PROBE_LEAK = ['/.env', '/.git/config', '/wp-config.php.bak', '/backup.zip'];

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalizzaUrl(input) {
  let s = String(input).trim();
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  return s.replace(/\/+$/, '');
}

function match(lista, testo) {
  const trovati = [];
  for (const [re, nome] of lista) {
    if (re.test(testo) && !trovati.includes(nome)) trovati.push(nome);
  }
  return trovati;
}

/**
 * Segue i redirect a mano invece di delegarli a fetch. Serve per i cookie:
 * con redirect automatico si vedono solo i Set-Cookie della risposta finale,
 * e molti siti piazzano i cookie di tracciamento proprio sul primo salto.
 */
async function richiesta(url, { metodo = 'GET', limite = 900000, maxSalti = 5 } = {}) {
  const iniziato = Date.now();
  const catena = [];
  const cookieTuttiISalti = [];
  let corrente = url;

  try {
    for (let salto = 0; salto <= maxSalti; salto++) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      let res;
      try {
        res = await fetch(corrente, {
          method: metodo,
          redirect: 'manual',
          signal: ctrl.signal,
          headers: { 'User-Agent': UA, Accept: '*/*', 'Accept-Language': 'it-IT,it;q=0.9' },
        });
      } finally {
        clearTimeout(t);
      }

      const headers = {};
      res.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));

      let setCookie = [];
      try {
        setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
      } catch {
        setCookie = [];
      }
      for (const c of setCookie) cookieTuttiISalti.push({ url: corrente, cookie: c });

      catena.push({ url: corrente, status: res.status });

      const posizione = headers['location'];
      const eRedirect = res.status >= 300 && res.status < 400 && posizione;

      if (eRedirect && salto < maxSalti) {
        corrente = new URL(posizione, corrente).toString();
        continue;
      }

      const ms = Date.now() - iniziato;
      let corpo = '';
      if (metodo === 'GET') {
        const buf = await res.arrayBuffer();
        corpo = Buffer.from(buf.slice(0, limite)).toString('utf8');
      }

      return {
        ok: true,
        status: res.status,
        // 2xx e la sola risposta che possiamo analizzare come pagina vera
        utile: res.status >= 200 && res.status < 300,
        urlFinale: corrente,
        catena,
        redirezionato: catena.length > 1,
        headers,
        setCookie,
        cookieTuttiISalti,
        corpo,
        ms,
        bytes: corpo.length,
      };
    }
    return { ok: false, errore: `troppi redirect (oltre ${maxSalti})`, catena, ms: Date.now() - iniziato };
  } catch (e) {
    return {
      ok: false,
      errore: e.name === 'AbortError' ? 'timeout' : e.message,
      catena,
      ms: Date.now() - iniziato,
    };
  }
}

/** Esiste davvero? Molti siti rispondono 200 con una pagina "non trovato". */
function esisteDavvero(res, sogliaCorpo = 600) {
  if (!res.ok || res.status !== 200) return false;
  if (res.bytes < sogliaCorpo) return false;
  if (/404|non trovat|not found|pagina non esiste/i.test(res.corpo.slice(0, 3000))) return false;
  return true;
}

async function primoCheEsiste(base, percorsi) {
  for (const p of percorsi) {
    const res = await richiesta(base + p, { limite: 40000 });
    await sleep(DELAY_MS);
    if (esisteDavvero(res)) return { trovato: true, url: base + p, status: res.status };
  }
  return { trovato: false, url: null, status: null };
}

// ---------------------------------------------------------------------------
// Le otto dimensioni
// ---------------------------------------------------------------------------

function valutaBackend(home) {
  const h = home.headers || {};
  const note = [];
  let punti = 0;

  const hosting = match(HOSTING, JSON.stringify(h) + ' ' + (h['server'] || ''));
  const server = h['server'] || 'non dichiarato';

  // HTTPS e redirect corretto
  const https = (home.urlFinale || '').startsWith('https://');
  if (https) punti += 15;
  else note.push('CRITICO: nessun HTTPS');

  // Header di sicurezza, 6 controlli
  const sec = {
    hsts: !!h['strict-transport-security'],
    csp: !!h['content-security-policy'],
    xcto: (h['x-content-type-options'] || '').toLowerCase().includes('nosniff'),
    xfo: !!h['x-frame-options'] || /frame-ancestors/i.test(h['content-security-policy'] || ''),
    referrer: !!h['referrer-policy'],
    permissions: !!h['permissions-policy'],
  };
  const nSec = Object.values(sec).filter(Boolean).length;
  punti += nSec * 6; // max 36
  if (!sec.hsts) note.push('manca HSTS');
  if (!sec.csp) note.push('manca Content-Security-Policy');

  // Compressione
  const enc = (h['content-encoding'] || '').toLowerCase();
  const compresso = /br|gzip|zstd/.test(enc);
  if (compresso) punti += 12;
  else note.push('risposta non compressa');

  // Cache
  if (h['cache-control'] || h['etag'] || h['last-modified']) punti += 8;

  // TTFB approssimato dal tempo totale della home
  const ms = home.ms || 9999;
  if (ms < 400) punti += 20;
  else if (ms < 800) punti += 15;
  else if (ms < 1500) punti += 9;
  else if (ms < 3000) punti += 4;
  else note.push(`risposta lenta: ${ms}ms`);

  // Banner di versione esposti: informazione regalata a chi cerca exploit
  const versione = /\d+\.\d+/.test(server) || !!h['x-powered-by'];
  if (versione) note.push(`versione software esposta (${server}${h['x-powered-by'] ? ' / ' + h['x-powered-by'] : ''})`);
  else punti += 9;

  return {
    punti: Math.min(100, punti),
    server,
    hosting: hosting.length ? hosting : ['non identificato'],
    https,
    headerSicurezza: sec,
    nHeaderSicurezza: nSec,
    compressione: enc || 'nessuna',
    ttfbMs: ms,
    note,
  };
}

function valutaFrontend(home) {
  const c = home.corpo || '';
  const h = home.headers || {};
  const note = [];
  let punti = 0;

  const stack = match(FRONTEND, c + ' ' + JSON.stringify(h));

  // Peso HTML
  const kb = Math.round(home.bytes / 1024);
  if (kb < 60) punti += 18;
  else if (kb < 150) punti += 13;
  else if (kb < 300) punti += 7;
  else note.push(`HTML pesante: ${kb}KB`);

  // Viewport mobile
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(c);
  if (viewport) punti += 12;
  else note.push('CRITICO: manca il meta viewport, sito non responsive');

  // Formati immagine moderni
  const webp = /\.webp|\.avif|image\/webp|image\/avif/i.test(c);
  if (webp) punti += 14;
  else note.push('nessuna immagine in webp o avif');

  // Lazy loading
  const lazy = /loading=["']lazy["']/i.test(c);
  if (lazy) punti += 10;
  else note.push('nessun lazy loading dichiarato');

  // Script che bloccano il render nel head
  const head = (c.match(/<head[\s\S]*?<\/head>/i) || [''])[0];
  const bloccanti = (head.match(/<script(?![^>]*(async|defer|type=["']application\/ld\+json["']|type=["']module["']))[^>]*src=/gi) || []).length;
  if (bloccanti === 0) punti += 16;
  else if (bloccanti <= 2) punti += 9;
  else note.push(`${bloccanti} script bloccanti nel head`);

  // Font: preconnect o self-host
  const fontEsterni = /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit/i.test(c);
  const preconnect = /rel=["']preconnect["']/i.test(c);
  if (!fontEsterni || preconnect) punti += 8;
  else note.push('font esterni senza preconnect');

  // Numero di script totali come proxy del peso JS
  const nScript = (c.match(/<script[^>]*src=/gi) || []).length;
  if (nScript <= 5) punti += 12;
  else if (nScript <= 12) punti += 7;
  else note.push(`${nScript} script esterni in pagina`);

  // Accessibilita minima: lang dichiarato
  const lang = /<html[^>]+lang=/i.test(c);
  if (lang) punti += 10;
  else note.push('manca attributo lang su <html>');

  return {
    punti: Math.min(100, punti),
    stack: stack.length ? stack : ['non identificato'],
    htmlKb: kb,
    viewport,
    immaginiModerne: webp,
    lazyLoading: lazy,
    scriptBloccanti: bloccanti,
    scriptEsterni: nScript,
    note,
  };
}

function valutaDatabase(home, probe, deep) {
  const c = home.corpo || '';
  const note = [];
  let punti = 60; // parte da neutro, si perde per esposizione

  const segnali = [];
  if (/wp-content|wp-json/i.test(c)) segnali.push('WordPress + MySQL');
  if (/supabase\.co/i.test(c)) segnali.push('Supabase (Postgres)');
  if (/cdn\.sanity\.io|sanity/i.test(c)) segnali.push('Sanity');
  if (/strapi/i.test(c)) segnali.push('Strapi');
  if (/contentful/i.test(c)) segnali.push('Contentful');
  if (/prismic/i.test(c)) segnali.push('Prismic');
  if (/shopify/i.test(c)) segnali.push('Shopify');
  if (/firebase|firestore/i.test(c)) segnali.push('Firebase');
  if (/airtable/i.test(c)) segnali.push('Airtable');

  const statico = segnali.length === 0 && /\/_next\/|\/_astro\/|\/_nuxt\//i.test(c);
  if (statico) {
    segnali.push('sito statico o pre-renderizzato, nessun DB esposto');
    punti += 25;
  }

  // Enumerazione utenti via API WordPress: nome utente admin regalato
  const utentiEsposti = probe['/wp-json/wp/v2/users']?.status === 200;
  if (utentiEsposti) {
    punti -= 40;
    note.push('CRITICO: /wp-json/wp/v2/users espone la lista degli utenti, primo passo per un attacco a forza bruta');
  }

  // File sensibili
  const leak = Object.entries(probe)
    .filter(([p, r]) => PROBE_LEAK.includes(p) && r.status === 200 && r.bytes > 20)
    .map(([p]) => p);
  if (leak.length) {
    punti -= 50;
    note.push(`CRITICO: file sensibili raggiungibili: ${leak.join(', ')}`);
  }

  if (punti >= 60 && !utentiEsposti && !leak.length) punti += 15;

  if (!deep) note.push('controllo sui file sensibili non eseguito, si attiva con --deep');

  return {
    punti: Math.max(0, Math.min(100, punti)),
    segnali: segnali.length ? segnali : ['non identificato'],
    utentiEsposti,
    fileEsposti: deep ? leak : 'non verificato',
    note,
  };
}

function valutaApi(home, probe, robots, sitemap) {
  const c = home.corpo || '';
  const note = [];
  let punti = 0;

  const superficie = [];
  for (const p of PROBE_API) {
    const r = probe[p];
    if (r && r.status === 200) superficie.push(p);
  }

  // robots.txt e sitemap sono il contratto pubblico con i crawler
  if (robots.esiste) punti += 18;
  else note.push('manca robots.txt');
  if (sitemap.esiste) punti += 22;
  else note.push('manca sitemap.xml');

  // Dati strutturati: e l'API semantica verso Google
  const jsonLd = (c.match(/application\/ld\+json/gi) || []).length;
  const tipi = [...c.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const tipiUnici = [...new Set(tipi)];
  if (jsonLd > 0) punti += 25;
  else note.push('nessun dato strutturato JSON-LD');
  if (tipiUnici.some((t) => /LocalBusiness|Organization|ProfessionalService/i.test(t))) punti += 10;
  if (tipiUnici.some((t) => /BreadcrumbList|FAQPage|Service/i.test(t))) punti += 8;

  // CORS permissivo su API pubbliche
  const cors = Object.values(probe).some((r) => r.headers && r.headers['access-control-allow-origin'] === '*');
  if (cors) note.push('almeno un endpoint risponde con Access-Control-Allow-Origin: *');
  else punti += 7;

  // API REST WordPress aperta senza necessita
  if (probe['/wp-json/']?.status === 200) {
    note.push('API REST WordPress pubblica su /wp-json/, da limitare se non serve');
  } else punti += 10;

  return {
    punti: Math.min(100, punti),
    superficie: superficie.length ? superficie : ['nessun endpoint pubblico rilevato'],
    jsonLd,
    tipiSchema: tipiUnici.slice(0, 12),
    robots: robots.esiste,
    sitemap: sitemap.esiste,
    note,
  };
}

function valutaCookies(home) {
  const c = home.corpo || '';
  const note = [];
  let punti = 0;

  const cmp = match(CMP, c);
  const tracker = match(TRACKER, c);

  // Cookie impostati dal server alla prima visita, prima di qualsiasi consenso.
  // Contano tutti i salti del redirect, non solo la risposta finale.
  const cookieServer = [
    ...new Set((home.cookieTuttiISalti || []).map((c) => c.cookie.split('=')[0].trim())),
  ];
  const cookieTecnici = cookieServer.filter((n) =>
    /^(PHPSESSID|wordpress_|wp-|csrf|XSRF|__Host|__Secure|session|SESS|JSESSIONID|cf_|_cfuvid|AWSALB)/i.test(n)
  );
  const cookieNonTecnici = cookieServer.filter((n) => !cookieTecnici.includes(n));

  // Presenza di un CMP
  if (cmp.length) punti += 30;
  else note.push('CRITICO: nessuna piattaforma di consenso rilevata nell HTML');

  // Tracker caricati nell HTML iniziale insieme a un CMP: va verificato che
  // siano bloccati prima del consenso, e il difetto piu diffuso in Italia
  const trackerNonCookieless = tracker.filter((t) => !/cookieless/i.test(t));
  if (trackerNonCookieless.length === 0) {
    punti += 30;
  } else if (cmp.length) {
    punti += 14;
    note.push(
      `${trackerNonCookieless.length} tracker nell HTML iniziale (${trackerNonCookieless.join(', ')}): verificare che il CMP li blocchi prima del consenso`
    );
  } else {
    note.push(`CRITICO: tracker senza CMP: ${trackerNonCookieless.join(', ')}`);
  }

  // Cookie non tecnici prima del consenso: violazione diretta
  if (cookieNonTecnici.length === 0) punti += 30;
  else {
    punti += 5;
    note.push(`cookie non tecnici impostati alla prima visita: ${cookieNonTecnici.join(', ')}`);
  }

  // Link alla cookie policy dalla home
  const linkCookie = /href=["'][^"']*cookie[^"']*["']/i.test(c);
  if (linkCookie) punti += 10;
  else note.push('nessun link alla cookie policy dalla home');

  return {
    punti: Math.min(100, punti),
    cmp: cmp.length ? cmp : ['nessuno rilevato'],
    tracker: tracker.length ? tracker : ['nessuno rilevato'],
    cookieServerPrimaDelConsenso: cookieServer,
    cookieNonTecnici,
    metodo:
      'solo header HTTP e HTML iniziale. I cookie scritti da JavaScript dopo il render richiedono un browser headless',
    note,
  };
}

function valutaPolicy(privacy, cookiePolicy, home) {
  const note = [];
  let punti = 0;
  const c = home.corpo || '';

  if (privacy.trovato) punti += 45;
  else note.push('CRITICO: privacy policy non raggiungibile ai percorsi standard');

  if (cookiePolicy.trovato) punti += 35;
  else note.push('cookie policy non raggiungibile ai percorsi standard (obbligatoria anche senza profilazione)');

  // Devono essere raggiungibili dal footer di ogni pagina
  const linkPrivacy = /href=["'][^"']*privacy[^"']*["']/i.test(c);
  if (linkPrivacy) punti += 20;
  else note.push('nessun link alla privacy policy dalla home');

  return {
    punti: Math.min(100, punti),
    privacyUrl: privacy.url,
    cookiePolicyUrl: cookiePolicy.url,
    linkInHome: linkPrivacy,
    note,
  };
}

function valutaTermini(termini, home) {
  const c = home.corpo || '';
  const note = [];
  let punti = 0;

  if (termini.trovato) punti += 50;
  else note.push('termini e condizioni non raggiungibili ai percorsi standard');

  // Obbligo informativo per le societa italiane: P.IVA visibile
  const piva = /p\.?\s?iva|partita iva|vat|c\.f\.|codice fiscale/i.test(c);
  const pivaNumero = /\b\d{11}\b/.test(c);
  if (piva && pivaNumero) punti += 35;
  else if (piva) punti += 18;
  else note.push('CRITICO: nessuna partita IVA visibile in home, obbligo informativo non assolto');

  // Sede o contatto legale
  const sede = /via\s|viale\s|piazza\s|sede legale/i.test(c);
  if (sede) punti += 15;
  else note.push('nessun indirizzo visibile in home');

  return {
    punti: Math.min(100, punti),
    terminiUrl: termini.url,
    partitaIvaVisibile: piva && pivaNumero,
    indirizzoVisibile: sede,
    note,
  };
}

function valutaBlueprint(home, sitemap) {
  const c = home.corpo || '';
  const note = [];
  let punti = 0;

  // Title e description
  const title = (c.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const desc = (c.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [, ''])[1].trim();
  if (title.length >= 25 && title.length <= 65) punti += 14;
  else if (title) punti += 7;
  else note.push('CRITICO: manca il tag title');
  if (desc.length >= 70 && desc.length <= 165) punti += 12;
  else if (desc) punti += 6;
  else note.push('manca la meta description');

  // Gerarchia dei titoli
  const h1 = (c.match(/<h1[\s>]/gi) || []).length;
  const h2 = (c.match(/<h2[\s>]/gi) || []).length;
  if (h1 === 1) punti += 12;
  else note.push(h1 === 0 ? 'nessun H1 in home' : `${h1} H1 in home, deve essere uno solo`);
  if (h2 >= 2) punti += 8;

  // Canonical
  if (/rel=["']canonical["']/i.test(c)) punti += 10;
  else note.push('manca il canonical');

  // Open Graph, condivisione social
  const og = /property=["']og:(title|image|description)["']/i.test(c);
  if (og) punti += 10;
  else note.push('manca Open Graph, le condivisioni social escono senza anteprima');

  // Ampiezza e profondita dell architettura
  const nPagine = sitemap.nUrl || 0;
  if (nPagine >= 40) punti += 16;
  else if (nPagine >= 15) punti += 12;
  else if (nPagine >= 6) punti += 8;
  else if (nPagine > 0) punti += 4;
  else note.push('architettura non leggibile: nessuna sitemap');

  // Chiarezza commerciale: la home deve chiedere qualcosa
  const cta = /(contatt|preventiv|richiedi|prenota|chiamaci|scrivici|parliamo)/i.test(c);
  if (cta) punti += 10;
  else note.push('nessuna call to action riconoscibile in home');

  // Prova sociale
  const prova = /(recension|testimonian|case study|caso studio|portfolio|clienti)/i.test(c);
  if (prova) punti += 8;
  else note.push('nessuna prova sociale in home');

  return {
    punti: Math.min(100, punti),
    title,
    titleLen: title.length,
    description: desc,
    descLen: desc.length,
    h1,
    h2,
    canonical: /rel=["']canonical["']/i.test(c),
    openGraph: og,
    paginaInSitemap: nPagine,
    ctaInHome: cta,
    provaSociale: prova,
    note,
  };
}

// ---------------------------------------------------------------------------
// Scansione di un singolo sito
// ---------------------------------------------------------------------------
async function scansiona(voce, opzioni = {}) {
  const base = normalizzaUrl(voce.url || voce);
  const nome = voce.nome || base.replace(/^https?:\/\//, '');
  const etichetta = voce.categoria || 'non classificato';

  process.stderr.write(`  scansione ${nome} ...\n`);

  const home = await richiesta(base + '/');
  if (!home.ok || !home.utile) {
    // Una home che risponde 403 o 500 non va analizzata come se fosse una
    // pagina vera: produrrebbe un punteggio basso e falso.
    return {
      nome,
      url: base,
      categoria: etichetta,
      raggiungibile: false,
      errore: home.ok ? `la home risponde ${home.status}` : home.errore,
      punteggio: 0,
    };
  }
  await sleep(DELAY_MS);

  // robots e sitemap
  const rRobots = await richiesta(base + '/robots.txt', { limite: 20000 });
  await sleep(DELAY_MS);
  const robots = {
    esiste: rRobots.ok && rRobots.status === 200 && /user-agent/i.test(rRobots.corpo),
    corpo: rRobots.ok ? rRobots.corpo.slice(0, 1500) : '',
  };

  // la sitemap puo essere dichiarata nel robots
  const dichiarata = (robots.corpo.match(/sitemap:\s*(\S+)/i) || [])[1];
  const rSitemap = await richiesta(dichiarata || base + '/sitemap.xml', { limite: 400000 });
  await sleep(DELAY_MS);
  const sitemapOk = rSitemap.ok && rSitemap.status === 200 && /<(urlset|sitemapindex)/i.test(rSitemap.corpo);
  const sitemap = {
    esiste: sitemapOk,
    url: sitemapOk ? dichiarata || base + '/sitemap.xml' : null,
    nUrl: sitemapOk ? (rSitemap.corpo.match(/<loc>/gi) || []).length : 0,
  };

  // sonde su API, piu i file sensibili solo se richiesto con --deep
  const probe = {};
  const percorsi = opzioni.deep ? [...PROBE_API, ...PROBE_LEAK] : [...PROBE_API];
  for (const p of percorsi) {
    const r = await richiesta(base + p, { limite: 8000 });
    probe[p] = { status: r.ok ? r.status : 0, bytes: r.bytes || 0, headers: r.headers || {} };
    await sleep(DELAY_MS);
  }

  // pagine legali
  const privacy = await primoCheEsiste(base, PATH_PRIVACY);
  const cookiePolicy = await primoCheEsiste(base, PATH_COOKIE);
  const termini = await primoCheEsiste(base, PATH_TERMINI);

  const d = {
    backend: valutaBackend(home),
    frontend: valutaFrontend(home),
    database: valutaDatabase(home, probe, !!opzioni.deep),
    api: valutaApi(home, probe, robots, sitemap),
    cookies: valutaCookies(home),
    policy: valutaPolicy(privacy, cookiePolicy, home),
    termini: valutaTermini(termini, home),
    blueprint: valutaBlueprint(home, sitemap),
  };

  const punteggio = Math.round(
    Object.entries(PESI).reduce((acc, [k, peso]) => acc + (d[k].punti * peso) / 100, 0)
  );

  const criticita = Object.values(d).flatMap((x) => x.note.filter((n) => /^CRITICO/.test(n)));

  return {
    nome,
    url: base,
    categoria: etichetta,
    raggiungibile: true,
    punteggio,
    dimensioni: d,
    criticita,
    scansionatoIl: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function colore(p) {
  if (p >= 75) return '#4ade80';
  if (p >= 55) return '#facc15';
  if (p >= 35) return '#fb923c';
  return '#f87171';
}

function generaHtml(risultati, data) {
  const ok = risultati.filter((r) => r.raggiungibile).sort((a, b) => b.punteggio - a.punteggio);
  const ko = risultati.filter((r) => !r.raggiungibile);
  const chiavi = Object.keys(PESI);

  const righe = ok
    .map((r, i) => {
      const celle = chiavi
        .map((k) => {
          const p = r.dimensioni[k].punti;
          return `<td style="text-align:center"><span class="pill" style="background:${colore(p)}22;color:${colore(p)}">${p}</span></td>`;
        })
        .join('');
      const note = chiavi
        .flatMap((k) => r.dimensioni[k].note.map((n) => `<li><b>${k}</b> ${esc(n)}</li>`))
        .join('');
      return `<tr class="riga" data-i="${i}">
        <td class="rank">${i + 1}</td>
        <td><div class="nome">${esc(r.nome)}</div><div class="url">${esc(r.url)}</div><div class="cat">${esc(r.categoria)}</div></td>
        <td style="text-align:center"><span class="score" style="color:${colore(r.punteggio)}">${r.punteggio}</span></td>
        ${celle}
      </tr>
      <tr class="dettaglio"><td colspan="${chiavi.length + 3}">
        <div class="grid">
          <div><h4>Stack rilevato</h4><p>${esc(r.dimensioni.frontend.stack.join(', '))}</p>
               <h4>Hosting</h4><p>${esc(r.dimensioni.backend.hosting.join(', '))} &middot; server: ${esc(r.dimensioni.backend.server)}</p>
               <h4>Database e CMS</h4><p>${esc(r.dimensioni.database.segnali.join(', '))}</p>
               <h4>Consenso cookie</h4><p>${esc(r.dimensioni.cookies.cmp.join(', '))}</p>
               <h4>Tracker in pagina</h4><p>${esc(r.dimensioni.cookies.tracker.join(', '))}</p></div>
          <div><h4>Pagine legali</h4>
               <p>privacy: ${r.dimensioni.policy.privacyUrl ? esc(r.dimensioni.policy.privacyUrl) : 'non trovata'}<br>
                  cookie: ${r.dimensioni.policy.cookiePolicyUrl ? esc(r.dimensioni.policy.cookiePolicyUrl) : 'non trovata'}<br>
                  termini: ${r.dimensioni.termini.terminiUrl ? esc(r.dimensioni.termini.terminiUrl) : 'non trovati'}</p>
               <h4>Architettura</h4><p>${r.dimensioni.blueprint.paginaInSitemap} URL in sitemap &middot; H1: ${r.dimensioni.blueprint.h1} &middot; title ${r.dimensioni.blueprint.titleLen} caratteri</p>
               <h4>Header di sicurezza</h4><p>${r.dimensioni.backend.nHeaderSicurezza} su 6 &middot; TTFB ${r.dimensioni.backend.ttfbMs}ms &middot; HTML ${r.dimensioni.frontend.htmlKb}KB</p></div>
        </div>
        <h4>Rilievi</h4><ul class="note">${note || '<li>nessun rilievo</li>'}</ul>
      </td></tr>`;
    })
    .join('');

  return `<!doctype html><html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Elivo - scansione competitor ${esc(data)}</title>
<style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0b0d10;color:#e6e8eb;font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:32px 20px;padding-bottom:max(32px,env(safe-area-inset-bottom))}
.wrap{max-width:1400px;margin:0 auto}
h1{font-size:24px;margin:0 0 6px}
.sub{color:#8b949e;margin:0 0 28px;font-size:14px}
.legenda{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:20px;font-size:13px;color:#8b949e}
.tabellaWrap{overflow-x:auto;border:1px solid #1e242c;border-radius:12px}
table{border-collapse:collapse;width:100%;min-width:1100px}
th{background:#11151a;text-align:left;padding:12px 10px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#8b949e;border-bottom:1px solid #1e242c;white-space:nowrap}
td{padding:12px 10px;border-bottom:1px solid #161b22;vertical-align:top}
.riga{cursor:pointer}
.riga:hover{background:#11151a}
.rank{color:#8b949e;font-variant-numeric:tabular-nums}
.nome{font-weight:600}
.url{color:#58a6ff;font-size:12px;word-break:break-all}
.cat{color:#6e7681;font-size:11px;text-transform:uppercase;letter-spacing:.4px;margin-top:2px}
.score{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}
.pill{display:inline-block;min-width:34px;padding:3px 8px;border-radius:6px;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.dettaglio{display:none;background:#0d1117}
.dettaglio.aperto{display:table-row}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;margin-bottom:12px}
h4{margin:14px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#8b949e}
h4:first-child{margin-top:0}
.dettaglio p{margin:0;font-size:14px}
.note{margin:6px 0 0;padding-left:18px;font-size:13px;color:#c9d1d9}
.note li{margin-bottom:4px}
.note b{color:#58a6ff;font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:.4px}
.ko{margin-top:24px;color:#f87171;font-size:13px}
.nota{margin-top:28px;padding:14px 16px;border:1px solid #1e242c;border-radius:10px;color:#8b949e;font-size:13px}
</style></head><body><div class="wrap">
<h1>Scansione competitor</h1>
<p class="sub">${ok.length} siti misurati &middot; ${esc(data)} &middot; ordinati per punteggio complessivo</p>
<div class="legenda">
  ${Object.entries(PESI).map(([k, v]) => `<span><b style="color:#e6e8eb">${k}</b> ${v}%</span>`).join('')}
</div>
<div class="tabellaWrap"><table>
<thead><tr><th>#</th><th>Sito</th><th style="text-align:center">Totale</th>${chiavi.map((k) => `<th style="text-align:center">${k}</th>`).join('')}</tr></thead>
<tbody>${righe}</tbody>
</table></div>
${ko.length ? `<div class="ko">Non raggiungibili: ${ko.map((r) => esc(r.nome) + ' (' + esc(r.errore) + ')').join(', ')}</div>` : ''}
<div class="nota"><b>Come leggere i cookie.</b> La colonna cookies misura header HTTP e HTML iniziale. I cookie scritti da JavaScript dopo il render non sono visti da questo strumento: per quelli serve un passaggio con browser headless. Un punteggio alto significa quindi "nessuna violazione evidente", non "conforme accertato".</div>
</div>
<script>
document.querySelectorAll('.riga').forEach(function(r){
  r.addEventListener('click', function(){
    var d = r.nextElementSibling;
    if (d && d.classList.contains('dettaglio')) d.classList.toggle('aperto');
  });
});
</script>
</body></html>`;
}

function generaCsv(risultati) {
  const chiavi = Object.keys(PESI);
  const intestazione = [
    'nome', 'url', 'categoria', 'punteggio', ...chiavi,
    'stack', 'hosting', 'cmp', 'tracker', 'privacy_url', 'cookie_url', 'termini_url',
    'url_in_sitemap', 'header_sicurezza_su_6', 'ttfb_ms', 'html_kb', 'criticita',
  ];
  const righe = risultati
    .filter((r) => r.raggiungibile)
    .sort((a, b) => b.punteggio - a.punteggio)
    .map((r) => {
      const d = r.dimensioni;
      const campi = [
        r.nome, r.url, r.categoria, r.punteggio,
        ...chiavi.map((k) => d[k].punti),
        d.frontend.stack.join(' | '),
        d.backend.hosting.join(' | '),
        d.cookies.cmp.join(' | '),
        d.cookies.tracker.join(' | '),
        d.policy.privacyUrl || '',
        d.policy.cookiePolicyUrl || '',
        d.termini.terminiUrl || '',
        d.blueprint.paginaInSitemap,
        d.backend.nHeaderSicurezza,
        d.backend.ttfbMs,
        d.frontend.htmlKb,
        r.criticita.join(' | '),
      ];
      return campi.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',');
    });
  return [intestazione.join(','), ...righe].join('\n');
}

// ---------------------------------------------------------------------------
// Avvio
// ---------------------------------------------------------------------------
function leggiArgomenti(argv) {
  const o = { input: join(HERE, 'competitors.json'), out: join(HERE, 'report'), concurrency: 3, site: null, deep: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input') o.input = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--concurrency') o.concurrency = Math.max(1, parseInt(argv[++i], 10) || 3);
    else if (a === '--site') o.site = argv[++i];
    else if (a === '--deep') o.deep = true;
  }
  return o;
}

async function inCoda(voci, limite, fn) {
  const risultati = new Array(voci.length);
  let i = 0;
  const worker = async () => {
    while (i < voci.length) {
      const mio = i++;
      risultati[mio] = await fn(voci[mio]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, voci.length) }, worker));
  return risultati;
}

async function main() {
  const opt = leggiArgomenti(process.argv);

  let voci;
  if (opt.site) {
    voci = [{ nome: opt.site, url: opt.site, categoria: 'singolo' }];
  } else {
    if (!existsSync(opt.input)) {
      console.error(`File non trovato: ${opt.input}`);
      console.error('Passa --input <file.json> oppure --site <dominio>');
      process.exit(1);
    }
    voci = JSON.parse(readFileSync(opt.input, 'utf8'));
    if (!Array.isArray(voci)) voci = voci.competitors || [];
  }

  process.stderr.write(`Scansione di ${voci.length} siti, ${opt.concurrency} in parallelo.\n`);
  process.stderr.write('Ogni sito richiede circa 20 richieste. Metti in conto qualche minuto.\n\n');

  if (opt.deep) {
    process.stderr.write('Modalita --deep: verranno cercati anche file sensibili (.env, .git/config, backup).\n');
    process.stderr.write('Usala sui nostri siti e su quelli dei clienti. Sui competitor, con cognizione.\n\n');
  }

  const risultati = await inCoda(voci, opt.concurrency, (v) => scansiona(v, { deep: opt.deep }));

  const data = new Date().toISOString().slice(0, 10);
  mkdirSync(opt.out, { recursive: true });
  const base = join(opt.out, `scan-${data}`);

  writeFileSync(base + '.json', JSON.stringify(risultati, null, 2));
  writeFileSync(base + '.csv', generaCsv(risultati));
  writeFileSync(base + '.html', generaHtml(risultati, data));

  const ok = risultati.filter((r) => r.raggiungibile).sort((a, b) => b.punteggio - a.punteggio);
  process.stderr.write('\nClassifica:\n');
  ok.forEach((r, i) => {
    process.stderr.write(`  ${String(i + 1).padStart(2)}. ${String(r.punteggio).padStart(3)}  ${r.nome}\n`);
  });
  const critici = ok.filter((r) => r.criticita.length);
  if (critici.length) {
    process.stderr.write(`\n${critici.length} siti con criticita:\n`);
    critici.forEach((r) => process.stderr.write(`  ${r.nome}: ${r.criticita.length}\n`));
  }
  process.stderr.write(`\nScritti:\n  ${base}.html\n  ${base}.csv\n  ${base}.json\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
