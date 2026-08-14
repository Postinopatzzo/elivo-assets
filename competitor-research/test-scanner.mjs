#!/usr/bin/env node
/**
 * test-scanner.mjs
 *
 * Verifica elivo-competitor-scan.mjs contro siti finti serviti in locale, con
 * caratteristiche note. Serve a garantire che il rilevamento sia corretto
 * prima di puntare lo scanner su siti veri.
 *
 * Uso: node test-scanner.mjs
 */

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Sito A: fatto bene. Statico, dati strutturati, pagine legali, niente tracker.
// ---------------------------------------------------------------------------
const HOME_BUONA = `<!doctype html><html lang="it"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Studio Buono - Siti web per artigiani in Veneto</title>
<meta name="description" content="Realizziamo siti web che portano richieste di preventivo agli artigiani del Veneto. Progetti chiavi in mano, consegna in due settimane.">
<link rel="canonical" href="http://127.0.0.1/">
<meta property="og:title" content="Studio Buono">
<meta property="og:image" content="/og.webp">
<link rel="preconnect" href="https://fonts.gstatic.com">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Studio Buono"}</script>
<script type="application/ld+json">{"@type":"BreadcrumbList"}</script>
</head><body>
<h1>Siti web che portano clienti</h1>
<h2>Servizi</h2><h2>Lavori</h2>
<img src="/foto.webp" loading="lazy" alt="lavoro">
<p>Guarda il nostro portfolio e le recensioni dei clienti.</p>
<a href="/contatti">Richiedi un preventivo</a>
<footer>
  <a href="/privacy-policy">Privacy policy</a>
  <a href="/cookie-policy">Cookie policy</a>
  <a href="/termini-e-condizioni">Termini e condizioni</a>
  <p>Studio Buono &middot; Via Roma 1, Treviso &middot; P.IVA 01234567890</p>
</footer>
<script src="/_next/static/app.js" defer></script>
</body></html>`;

// ---------------------------------------------------------------------------
// Sito B: fatto male. WordPress, tracker senza consenso, niente legali.
// ---------------------------------------------------------------------------
const HOME_CATTIVA = `<!doctype html><html><head>
<meta charset="utf-8">
<title>Web</title>
<script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"></script>
<script src="https://connect.facebook.net/en_US/fbevents.js"></script>
<script src="/wp-content/themes/x/jquery.js"></script>
<script src="/wp-content/plugins/elementor/frontend.js"></script>
</head><body>
<h1>Benvenuti</h1><h1>Nel nostro sito</h1>
<img src="/foto.jpg">
<p>Siamo una web agency.</p>
</body></html>`;

function avvia(porta, gestore) {
  return new Promise((res) => {
    const s = createServer(gestore);
    s.listen(porta, '127.0.0.1', () => res(s));
  });
}

const HEADER_SICUREZZA = {
  'strict-transport-security': 'max-age=63072000',
  'content-security-policy': "default-src 'self'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=()',
};

async function main() {
  // --- Sito buono, porta 3101 -------------------------------------------
  const buono = await avvia(3101, (req, res) => {
    const u = req.url.split('?')[0];
    const invia = (corpo, tipo = 'text/html; charset=utf-8', extra = {}) =>
      res.writeHead(200, { 'content-type': tipo, ...HEADER_SICUREZZA, ...extra }).end(corpo);

    if (u === '/') return invia(HOME_BUONA);
    if (u === '/robots.txt')
      return invia('User-agent: *\nAllow: /\nSitemap: http://127.0.0.1:3101/sitemap.xml', 'text/plain');
    if (u === '/sitemap.xml') {
      const loc = Array.from({ length: 22 }, (_, i) => `<url><loc>http://127.0.0.1:3101/p${i}</loc></url>`).join('');
      return invia(`<?xml version="1.0"?><urlset>${loc}</urlset>`, 'application/xml');
    }
    // pagine legali, abbastanza lunghe da superare il controllo anti falso positivo
    if (['/privacy-policy', '/cookie-policy', '/termini-e-condizioni'].includes(u))
      return invia('<html><body><h1>Informativa</h1>' + 'testo legale. '.repeat(120) + '</body></html>');
    res.writeHead(404, { 'content-type': 'text/html' }).end('<html><body>404 non trovato</body></html>');
  });

  // --- Sito cattivo, porta 3102 -----------------------------------------
  // La home risponde con un redirect che deposita subito un cookie di
  // tracciamento: e il caso che lo scanner deve saper vedere.
  const cattivo = await avvia(3102, (req, res) => {
    const u = req.url.split('?')[0];
    if (u === '/') {
      return res
        .writeHead(302, {
          location: 'http://127.0.0.1:3102/home',
          'set-cookie': ['_ga=GA1.2.999; Path=/', 'PHPSESSID=abc123; Path=/'],
        })
        .end();
    }
    if (u === '/home')
      return res
        .writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'x-powered-by': 'PHP/7.4.3', server: 'Apache/2.4.29' })
        .end(HOME_CATTIVA);
    if (u === '/wp-json/wp/v2/users')
      return res
        .writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
        .end(JSON.stringify([{ id: 1, name: 'admin', slug: 'admin' }]));
    if (u === '/wp-json/')
      return res.writeHead(200, { 'content-type': 'application/json' }).end('{"name":"sito"}');
    res.writeHead(404, { 'content-type': 'text/html' }).end('<html><body>404 not found</body></html>');
  });

  // --- Sito che rifiuta, porta 3103 -------------------------------------
  const rifiuta = await avvia(3103, (req, res) => {
    res.writeHead(403, { 'content-type': 'text/html' }).end('<html><body>vietato</body></html>');
  });

  // --- Esecuzione dello scanner -----------------------------------------
  const dir = mkdtempSync(join(tmpdir(), 'elivo-test-'));
  const input = join(dir, 'in.json');
  writeFileSync(
    input,
    JSON.stringify([
      { nome: 'sito-buono', url: 'http://127.0.0.1:3101', categoria: 'test' },
      { nome: 'sito-cattivo', url: 'http://127.0.0.1:3102', categoria: 'test' },
      { nome: 'sito-403', url: 'http://127.0.0.1:3103', categoria: 'test' },
    ])
  );

  console.log('Avvio scanner sui tre siti di prova...\n');
  // spawn asincrono, non spawnSync: i server di prova vivono in questo stesso
  // processo e una chiamata sincrona ne bloccherebbe l'event loop, facendo
  // scadere in timeout ogni richiesta dello scanner.
  const r = await new Promise((res) => {
    const p = spawn(
      process.execPath,
      [join(HERE, 'elivo-competitor-scan.mjs'), '--input', input, '--out', dir, '--concurrency', '3'],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (status) => res({ status, stderr: err }));
  });
  if (r.status !== 0) {
    console.error('Lo scanner e uscito con errore:\n', r.stderr);
    process.exit(1);
  }

  const data = new Date().toISOString().slice(0, 10);
  const out = JSON.parse(readFileSync(join(dir, `scan-${data}.json`), 'utf8'));
  const A = out.find((x) => x.nome === 'sito-buono');
  const B = out.find((x) => x.nome === 'sito-cattivo');
  const C = out.find((x) => x.nome === 'sito-403');

  // --- Asserzioni --------------------------------------------------------
  const prove = [];
  const ok = (nome, cond, visto) => prove.push({ nome, cond: !!cond, visto });

  // La home che risponde 403 non deve essere analizzata come pagina vera
  ok('sito 403 marcato non raggiungibile', C && C.raggiungibile === false, C && C.errore);

  ok('sito buono raggiungibile', A && A.raggiungibile === true, A && A.raggiungibile);
  ok('sito buono batte sito cattivo', A && B && A.punteggio > B.punteggio, A && B ? `${A.punteggio} vs ${B.punteggio}` : 'n/d');

  // Backend
  ok('rileva i 6 header di sicurezza', A?.dimensioni.backend.nHeaderSicurezza === 6, A?.dimensioni.backend.nHeaderSicurezza);
  ok('rileva assenza header sul sito cattivo', B?.dimensioni.backend.nHeaderSicurezza === 0, B?.dimensioni.backend.nHeaderSicurezza);
  ok('segnala la versione software esposta', B?.dimensioni.backend.note.some((n) => /versione software esposta/.test(n)), B?.dimensioni.backend.note);

  // Frontend
  ok('rileva Next.js', A?.dimensioni.frontend.stack.includes('Next.js'), A?.dimensioni.frontend.stack);
  ok('rileva WordPress + Elementor', B?.dimensioni.frontend.stack.includes('WordPress') && B?.dimensioni.frontend.stack.includes('WordPress + Elementor'), B?.dimensioni.frontend.stack);
  ok('rileva viewport presente e assente', A?.dimensioni.frontend.viewport === true && B?.dimensioni.frontend.viewport === false, `${A?.dimensioni.frontend.viewport} / ${B?.dimensioni.frontend.viewport}`);
  ok('rileva webp e lazy loading', A?.dimensioni.frontend.immaginiModerne && A?.dimensioni.frontend.lazyLoading, 'ok');
  ok('conta gli script bloccanti nel head', B?.dimensioni.frontend.scriptBloccanti === 4, B?.dimensioni.frontend.scriptBloccanti);

  // Database
  ok('rileva enumerazione utenti WordPress', B?.dimensioni.database.utentiEsposti === true, B?.dimensioni.database.utentiEsposti);
  ok('nessuna enumerazione sul sito buono', A?.dimensioni.database.utentiEsposti === false, A?.dimensioni.database.utentiEsposti);
  ok('classifica il sito buono come statico', A?.dimensioni.database.segnali.some((s) => /statico/.test(s)), A?.dimensioni.database.segnali);

  // API
  ok('trova robots e sitemap', A?.dimensioni.api.robots && A?.dimensioni.api.sitemap, 'ok');
  ok('conta 2 blocchi JSON-LD', A?.dimensioni.api.jsonLd === 2, A?.dimensioni.api.jsonLd);
  ok('estrae il tipo LocalBusiness', A?.dimensioni.api.tipiSchema.includes('LocalBusiness'), A?.dimensioni.api.tipiSchema);
  ok('segnala CORS permissivo', B?.dimensioni.api.note.some((n) => /Access-Control-Allow-Origin/.test(n)), B?.dimensioni.api.note);

  // Cookies: la prova chiave, il cookie sta sul salto del redirect
  ok('cattura i cookie posati sul redirect', B?.dimensioni.cookies.cookieServerPrimaDelConsenso.includes('_ga'), B?.dimensioni.cookies.cookieServerPrimaDelConsenso);
  ok('distingue i cookie tecnici da quelli no', B?.dimensioni.cookies.cookieNonTecnici.includes('_ga') && !B?.dimensioni.cookies.cookieNonTecnici.includes('PHPSESSID'), B?.dimensioni.cookies.cookieNonTecnici);
  ok('rileva GTM e Meta Pixel', B?.dimensioni.cookies.tracker.includes('Google Tag Manager') && B?.dimensioni.cookies.tracker.includes('Meta Pixel'), B?.dimensioni.cookies.tracker);
  ok('nessun tracker sul sito buono', A?.dimensioni.cookies.tracker[0] === 'nessuno rilevato', A?.dimensioni.cookies.tracker);

  // Policy e termini
  ok('trova privacy e cookie policy', !!A?.dimensioni.policy.privacyUrl && !!A?.dimensioni.policy.cookiePolicyUrl, `${A?.dimensioni.policy.privacyUrl} / ${A?.dimensioni.policy.cookiePolicyUrl}`);
  ok('non inventa pagine legali dove non ci sono', !B?.dimensioni.policy.privacyUrl && !B?.dimensioni.termini.terminiUrl, 'ok');
  ok('trova i termini e la partita IVA', !!A?.dimensioni.termini.terminiUrl && A?.dimensioni.termini.partitaIvaVisibile === true, `${A?.dimensioni.termini.terminiUrl} / ${A?.dimensioni.termini.partitaIvaVisibile}`);

  // Blueprint
  ok('estrae il title', A?.dimensioni.blueprint.title.startsWith('Studio Buono'), A?.dimensioni.blueprint.title);
  ok('conta un solo H1 sul sito buono', A?.dimensioni.blueprint.h1 === 1, A?.dimensioni.blueprint.h1);
  ok('segnala i 2 H1 sul sito cattivo', B?.dimensioni.blueprint.h1 === 2, B?.dimensioni.blueprint.h1);
  ok('conta 22 URL in sitemap', A?.dimensioni.blueprint.paginaInSitemap === 22, A?.dimensioni.blueprint.paginaInSitemap);
  ok('rileva canonical e Open Graph', A?.dimensioni.blueprint.canonical && A?.dimensioni.blueprint.openGraph, 'ok');
  ok('rileva la CTA e la prova sociale', A?.dimensioni.blueprint.ctaInHome && A?.dimensioni.blueprint.provaSociale, 'ok');

  // --- Esito -------------------------------------------------------------
  let falliti = 0;
  for (const p of prove) {
    if (p.cond) console.log(`  PASS  ${p.nome}`);
    else {
      falliti++;
      console.log(`  FAIL  ${p.nome}  -> visto: ${JSON.stringify(p.visto)}`);
    }
  }
  console.log(`\n${prove.length - falliti}/${prove.length} verifiche superate`);
  if (A && B) console.log(`Punteggi: sito-buono ${A.punteggio}, sito-cattivo ${B.punteggio}`);

  buono.close();
  cattivo.close();
  rifiuta.close();
  process.exit(falliti ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
