# ALIMAGIA · Direzione creativa v2 "Bottega di laguna"

Documento di direzione creativa Elivo Studio per l'evoluzione di alimagia-demo.pages.dev.
Cliente: ALIMAGIA di Barbu Italia di Baro Massimo, Pianiga (VE). Produzione tricicli per anziani,
disabili e bambini, bici a pedalata assistita, tricicli da lavoro, rivendita scooter elettrici.
Obiettivo commerciale dichiarato: portare il visitatore a chiedere il preventivo per una bici precisa,
non a "guardare il sito".

---

## 1. Analisi del sito attuale (demo)

### Cosa funziona
1. L'impianto editoriale "catalogo d'officina" (carta avorio, serif, scontorni in multiply) è
   l'istinto giusto: evita sia il template AI sia l'e-commerce freddo, e unifica foto prodotto di
   qualità molto diversa tra loro.
2. Base tecnica eccellente: HTML/CSS/JS vanilla, accessibilità vera (skip link, focus visibili,
   reduced motion, focus trap nel lightbox, inert sul menu), lazy loading, SEO di base con
   LocalBusiness schema.
3. Copy concreto, con le parole del cliente ("sicure, resistenti e durature").
4. Struttura di conversione presente: CTA in header, hero, metà pagina, form finale, telefono
   sempre visibile.
5. Le lettere A/B/C/D di famiglia e i numeri 01-05 dei servizi danno già un ritmo da catalogo.
6. Il logo vero (rosso + ali gialle + pennellate azzurre) è dichiarato nei token CSS.

### Cosa non funziona
1. **L'anima del brand è stata sterilizzata.** Il logo è vernacolare e acceso, il sito è un
   editoriale beige che potrebbe vendere candele o studi notarili. L'azzurro esiste come token ma
   non viene quasi mai usato. Il nome ALIMAGIA (ali + magia) non viene mai raccontato.
2. **Zero colore che vende.** Tutto è avorio e inchiostro: nessuna sezione "chiama" l'occhio,
   nessuna famiglia di prodotto è riconoscibile a colpo d'occhio, i 31 prodotti sono card fotocopiate
   senza gerarchia commerciale. Sono esattamente le "card ripetitive" che ci vietiamo.
3. **L'hero non ha il prodotto.** L'unica sezione vista da tutti è solo testo (e l'asset
   hero-triciclo.png esiste nel repo ma non è usato).
4. **Nessuna prova.** "Produzione propria" è affermata, mai dimostrata: niente officina, niente
   mani, niente Massimo, niente numeri, niente recensioni. La foto "chi siamo" è da stock.
5. **Nessuna guida alla scelta.** Chi compra è spesso il figlio/figlia (45-65) che cerca
   "triciclo per anziani" per la mamma: arriva, vede 31 modelli identici senza specifiche né
   prezzi, e non sa quale chiedere.
6. **Un solo funnel per due clienti diversi.** Ausili per anziani (emotivo, B2C) e mezzi da lavoro
   (food track, noleggio vela: razionale, B2B) condividono lo stesso percorso e lo stesso form,
   senza campo "cosa ti interessa".
7. **WhatsApp dichiarato ma non attivato**: il numero è solo tel:, nessun link wa.me, nessuna
   barra azioni fissa su mobile (dove navrà il caregiver).
8. Dettagli: tagline ripetuta 4 volte, tricolore-bandiera come unico segno "italiano", privacy e
   cookie policy linkate a "#", form demo che non invia, scontorni con scale e angoli incoerenti.

### Cosa comunica oggi / cosa deve comunicare
Oggi: "siamo una ditta seria e sobria". Deve comunicare: "questa è una bottega veneta viva,
coloratissima e concreta, dove la bici giusta per te (o per tua madre) esiste già, ha un nome,
e chiederne il prezzo richiede trenta secondi".

---

## 2. Concept creativo

> **Non stiamo progettando il sito di un produttore di tricicli.
> Stiamo progettando una bottega di laguna: i colori accesi di Venezia (lacca delle maschere,
> oro, acqua verde-azzurra, intonaci caldi) usati come un'insegna che ti porta dentro,
> fino alla bici che porta già il tuo nome. E quando esci, hai di nuovo il vento in faccia.**

I riferimenti del cliente tradotti, senza cartoline:
- **La gondola nella luce dorata** → la luce: fotografie umane calde, controluce, foschia dorata
  della Riviera del Brenta (Pianiga è a mezz'ora dalla laguna, lungo il Naviglio). Niente gondole.
- **Gli archi gotici sull'acqua** → l'acqua: il verde-laguna come colore pieno di sezione, le
  "finestre" come maschere di ritaglio per le foto (archi solo come geometria, mai come decoro).
- **Le maschere rosse e oro** → la materia: rosso lacca e oro come colori commerciali (CTA e
  offerte), la sensazione di bottega artigiana piena di pezzi appesi. Niente maschere.
- **I piccioni in volo su San Marco** → le ali: il logo ha già le ali gialle. Le ali diventano il
  sistema grafico del sito (badge, reveal, dettagli), e la promessa: tornare a muoversi.
- **L'officina con gli attrezzi colorati** → la verità: gli attrezzi colorati sul fondo neutro
  sono esattamente la nostra regola cromatica. Fondo carta, oggetti accesi. E la sezione officina
  vera, con Massimo, da fotografare.

Un filo in più che il cliente ci regala senza saperlo: **le bici hanno nomi di persona**
(Vittoria, Cloe, Cinzia, Veronica, Amy, July...). Come le barche. Come le cose di famiglia.
Il catalogo non è una lista di SKU: è una fila di personaggi in bottega che aspettano qualcuno.

Questo concept guida tutto: palette, foto, animazioni, copy, componenti.

---

## 3. Moodboard

- **Materiali**: carta avorio (resta la base), lacca rossa lucida, oro caldo, acqua di laguna,
  intonaco veneziano, acciaio smaltato dei telai, cuoio delle selle, legno del Food Track.
- **Texture**: grana carta appena percettibile sulle superfici chiare; nessun noise sui colori
  pieni (devono restare "smalto"); niente glass, niente gradienti soft da SaaS.
- **Fotografia**, due registri netti:
  1. *Catalogo*: scontorni in multiply sulla carta (già in uso, da uniformare: stesso orientamento
     ¾, stessa scala relativa, stessa altezza da terra).
  2. *Vita*: golden hour lungo il Brenta e nelle strade di Pianiga, vento addosso, riprese basse
     dall'altezza della ruota, controluce dorato (rif. gondola), persone vere: nonni, nipoti,
     il fruttivendolo col carrettone. Grana leggera, niente stock.
- **Iconografia**: targhette da telaio (head badge), decalcomanie, ali del logo ridisegnate come
  segno pulito monocolore. Niente icone outline generiche da libreria.
- **Pattern**: il *filetto da telaio* (la filettatura a pennello delle bici d'epoca): doppia linea
  sottile oro+rosso che sostituisce il tricolore-bandiera come segno di artigianalità italiana.
  L'italianità si percepisce dal mestiere, non dalla bandiera.
- **Spaziature**: ritmo editoriale attuale (sezioni 4.5-8.5rem) con respiri asimmetrici nelle
  sezioni famiglia; la densità aumenta solo nel catalogo (che deve sembrare "pieno di roba bella",
  come la parete della bottega).
- **Contrasti**: carta chiara vs blocchi di colore pieno a tutta larghezza. Il colore arriva a
  ondate (sezione famiglia = onda), mai come coriandoli sparsi.
- **Riferimenti artistici**: manifesti del ciclismo italiano anni '50 (Legnano, Bianchi), insegne
  dipinte delle botteghe veneziane, targhette smaltate, editoria italiana (didascalie in corsivo),
  la parete attrezzi come still life.

---

## 4. Palette

Base neutra invariata, accenti portati a sistema "veneziano acceso". Il colore non decora: codifica.

| Token | Hex | Ruolo | Regole d'uso |
|---|---|---|---|
| `--paper` | `#FBFAF6` | fondo pagina | base di tutto, fa esplodere i colori |
| `--bone` | `#F2F0E8` | fondo alternato | sezioni di respiro |
| `--ink` | `#191B1E` | testo | corpo e titoli su chiaro |
| `--ink-soft` | `#5D6066` | testo secondario | mai sotto i 16px |
| `--lacca` | `#C62E1B` | **azione** | SOLO CTA e prezzi/offerte. Su chiaro passa AA (≈5:1) |
| `--oro` | `#FAD53E` | **attenzione** | evidenziatore, hover nav, badge, CTA su fondo scuro (testo ink, ≈12:1) |
| `--laguna` | `#0E7C86` | **fiducia** | link e testo colorato su carta (≈4.8:1, AA), fondi pieni |
| `--pennellata` | `#2EC7ED` | **aria** | SOLO grafica grande e fondi (2:1, mai testo) |
| `--verderame` | `#23745A` | famiglia | verde rame ossidato, testo AA su carta |
| `--notte` | `#0D1F2D` | fondo scuro | CTA finale, footer scuro, contrasto massimo |

**Color coding delle famiglie** (arriva ovunque: sezione, filtro, card, scheda, form):
- A · Biciclette a tre ruote → **lacca** (il cuore commerciale, il rosso del Mod. Vittoria)
- B · Pedalata assistita → **verderame** (energia quotidiana)
- C · Tricicli da lavoro → **oro** (mestiere, insegna)
- D · Scooter elettrici → **laguna** (autonomia, sicurezza)

Regola non negoziabile: ogni coppia testo/fondo passa WCAG AA. I colori accesi che non passano
(oro, pennellata) lavorano solo come fondi, evidenziatori o grafica, mai come testo su chiaro.

---

## 5. Font

- **Display: Fraunces** (SIL OFL, variable). Serif "da insegna": morbido, pieno, con ink trap,
  regge i corpi giganti e resta leggibile nei corsivi piccoli. Ha il sapore del manifesto italiano
  senza essere un revival. Pesi 500-700, asse SOFT alto per i titoli, corsivo per le parole-chiave.
- **Testo e UI: Archivo** (già acquistato e in uso): grotesk solida, ottimi numeri tabellari,
  perfetta per form, filtri, targhette.
- Perché sostituire Cormorant: è elegante ma esile e "luxury"; a corpi piccoli e per occhi over-60
  è fragile. Fraunces tiene il carattere editoriale alzando leggibilità e calore.
  Piano B a costo zero: restare su Cormorant portando i titoli a peso 600 e togliendo il corsivo
  dalle didascalie sotto i 18px.
- Scala per target 60+: body mobile 17-18px, didascalie mai sotto 15px, line-height 1.6,
  niente pesi sotto il 400.

---

## 6. Layout

- Container 76rem e griglia 12 colonne (invariati), gutter fluidi attuali.
- **Alternanza a ondate**: carta → blocco colore famiglia a tutta larghezza → carta. La pagina
  vista da lontano è una bandiera di bottega, non un lenzuolo beige.
- **Rotture controllate**: nelle sezioni famiglia la foto scontornata sconfina dal blocco colore
  sulla carta (la ruota "esce dal quadro"): profondità senza ombre finte.
- **Il filetto**: una doppia linea oro+rosso percorre i bordi delle sezioni chiave e si disegna
  allo scroll. È la filettatura del telaio che diventa la linea del percorso: dall'officina alla
  strada, dall'hero al form.
- Margini interni dei blocchi colore generosi (min 4rem verticale) perché il colore respiri e non
  sembri un banner.

---

## 7. Architettura e sezioni (ognuna con la sua identità)

1. **Header** (carta): logo, nav, telefono, CTA lacca "Preventivo gratuito". Su mobile la CTA
   non sparisce nel burger: resta nella barra fissa in basso (vedi §9).
2. **Hero "L'insegna"** (carta + pennellata): titolo Fraunces gigante, il Mod. Vittoria rosso
   scontornato in grande (hero-triciclo.png è già nel repo, oggi inutilizzato), dietro di lui una
   pennellata azzurro-laguna a tutta larghezza (il gesto del logo ingrandito, non un rettangolo).
   Kicker: "Pianiga, Venezia · Produzione propria dal [ANNO, DA RICHIEDERE]".
   CTA primaria lacca + link "Sfoglia i modelli". Il marchio-A con le ali "si timbra" in un angolo.
3. **Strip fiducia** (bone): produzione propria · assistenza · ricambi · su misura · noleggio,
   con i puntini oro attuali. Invariata nella sostanza.
4. **La bottega** (carta, ex "Chi siamo"): Massimo e l'officina VERA (servizio fotografico da
   fare, rif. immagine 5): parete attrezzi, telai appesi, mani che filettano. Copy in prima
   persona, 4 fatti numerati (restano), logo Barbu. La citazione «sicure, resistenti e durature»
   resta SOLO qui, detta da lui, con nome e cognome sotto.
5. **Le quattro famiglie** (quattro onde di colore): ogni famiglia è un blocco pieno del suo
   colore con lettera-decalcomania gigante, scontorno che sconfina, 2 argomenti di vendita secchi,
   contatore modelli e CTA "Vedi i 7 modelli" che apre il catalogo già filtrato. Quattro sezioni,
   quattro identità, stessa grammatica: si riconoscono, non si confondono.
6. **Guida alla scelta "Per chi è?"** (carta, NUOVA): tre domande a chip colorati (Per chi?
   Dove la userà? Quanta autonomia serve?) → 2-3 modelli consigliati con CTA diretta. È la
   commessa di bottega: chi non sa nulla di tricicli esce con un nome preciso da chiedere.
7. **Catalogo "I modelli"** (bone): filtri come linguette colorate per famiglia (il colore
   c'è già nel chip, non solo un numerino rosso). Card v2: foto multiply, nome grande, famiglia
   nel suo colore, 2-3 specifiche chiave [DA RICHIEDERE: ruote, portata, cambio, per chi],
   fascia prezzo o "da € [DA DEFINIRE col cliente]" e micro-CTA "Chiedi il prezzo".
   Click → **scheda modello** (evoluzione del lightbox): foto, specifiche, "perfetta per...",
   due bottoni: "Preventivo per questo modello" (form precompilato) e WhatsApp precompilato
   ("Buongiorno, vorrei un preventivo per il Mod. Vittoria").
8. **Su misura** (notte + oro): il Custom Verde di notte, come un pezzo in vetrina illuminata.
   Qui vive l'idea targhetta (vedi §12.2). CTA "Parlaci del tuo progetto".
9. **Prove e garanzie** (carta, NUOVA): assistenza in sede, ricambi propri, prova sul posto
   [DA CONFERMARE], anni di attività, recensioni Google se esistono [DA RICHIEDERE]. Eventuale
   riquadro "agevolazioni per ausili disabili (IVA 4%)" [DA VERIFICARE con il commercialista del
   cliente prima di pubblicare]. È la sezione che disinnesca le obiezioni prima del form.
10. **CTA "Notte di laguna"** (notte): resta l'impianto attuale (titolo + oro) ma il filetto
    oro+rosso sostituisce il tricolore, e accanto al bottone compare WhatsApp oltre al telefono.
11. **Contatti + form** (carta): form attuale + campo "Mi interessa" (Triciclo per un familiare /
    Bici a pedalata assistita / Mezzo da lavoro / Scooter / Su misura / Assistenza) e campo modello
    precompilato quando si arriva da una scheda. Recapiti invariati, mappa/indicazioni in testo.
12. **Footer** (carta): invariato + privacy/cookie reali.

Percorso narrativo: insegna → bottega → famiglie → consiglio → scelta → su misura → fiducia → azione.

---

## 8. Sistema di animazioni

Principio: **meccanica onesta**. Tutto si muove come si muove una bici: rotazioni, spinte corte,
niente fluttuazioni, niente parallax decorativo. Base attuale (reveal brevi, line-mask del titolo,
reduced-motion completo) promossa e mantenuta.

- Hero: righe del titolo con la line-mask attuale; il marchio-A si "timbra" (scale 1.06 → 1,
  8° → 0°, 300ms); la pennellata si allarga da sinistra (clip-path, 600ms).
- Filetto: si disegna allo scroll (stroke-dashoffset legato a IntersectionObserver, mai allo
  scrolljacking; la pagina scorre sempre libera).
- Onde di colore: il blocco famiglia entra con un wipe verticale corto (250ms) invece del fade.
- Card catalogo: hover attuale (scale 1.02) + il nome sottolineato nel colore di famiglia che si
  disegna; le ruote NON girano (siamo una bottega, non un cartone).
- Scheda modello: entra dal basso su mobile (bottom sheet), dal centro su desktop, 250ms.
- CTA: il filetto si disegna intorno al bottone su hover (400ms).
- Tutto disattivato con prefers-reduced-motion (già impostato, si eredita).

---

## 9. Componenti UI

- **Bottone-targhetta**: rettangolo pieno, angoli 2px (attuali), lacca/oro/notte; su fondo scuro
  versione oro con testo ink. Hover: scurisce + filetto. Min-height 48px (target 60+).
- **Chip filtro famiglia**: linguetta con pallino/bordo nel colore di famiglia, contatore in
  numeri tabellari; stato attivo = fondo colore al 12% + bordo pieno.
- **Card modello**: foto multiply, nome Fraunces, famiglia colorata, 2-3 spec in Archivo,
  micro-CTA. Bordo superiore hairline; niente ombre.
- **Scheda modello** (sostituisce il lightbox): galleria, specifiche a griglia, "perfetta per",
  CTA preventivo + WhatsApp precompilato, frecce prev/next tra modelli della stessa famiglia.
- **Form preventivo**: campi attuali + select "Mi interessa" + hidden "modello". Errori in lacca
  con messaggio testuale, non solo bordo. Checkbox privacy con link vero.
- **Barra mobile fissa** (NUOVA): due azioni, "Chiama" e "WhatsApp", sempre visibili sotto il
  pollice. È il componente che converte il traffico mobile dei caregiver.
- **Badge "Produzione propria · Pianiga (VE)"**: targhetta con le ali, usata in hero e footer.

---

## 10. Esperienza utente

- **Tre persone, tre percorsi**:
  *Figlia/figlio caregiver (mobile)*: atterra → capisce in 5 secondi che esistono tricicli per
  anziani → guida alla scelta → WhatsApp precompilato. Mai più di due tap dall'intenzione all'azione.
  *Anziano autonomo (desktop, font grandi)*: legge con calma, si fida dell'officina e
  dell'assistenza, chiama il fisso ben visibile.
  *Azienda/comune (food track, noleggio vela)*: riconosce subito la famiglia oro "da lavoro",
  trova specifiche e form qualificato: non deve attraversare il funnel emotivo degli ausili.
- **Perché l'occhio segue**: la pagina alterna carta e colore; ogni onda di colore è una famiglia
  di prodotto, quindi ogni "richiamo visivo" è anche un'unità commerciale. L'attenzione atterra
  sempre su qualcosa che si può comprare, mai su decorazione.
- **Perché converte di più**: CTA per modello (riduce la distanza tra desiderio e richiesta),
  guida alla scelta (elimina la paralisi dei 31 modelli identici), prova sociale e garanzie prima
  del form (obiezioni disinnescate), WhatsApp (canale naturale del target), form qualificante
  (lead migliori, meno telefonate a vuoto per Massimo).
- **Accessibilità come posizionamento**: il cliente vende ausili per anziani e disabili; un sito
  AA con testi grandi e target da 48px non è compliance, è coerenza di prodotto. Si mantiene tutto
  l'impianto a11y della demo e lo si alza (corpi, contrasti, barra azioni).
- **Prestazioni**: vanilla, zero librerie; immagini ricompresse (AVIF/WebP con fallback),
  scontorni serviti in dimensioni responsive. Obiettivo LCP < 2s su 4G.

---

## 11. Motivazioni in sintesi

| Scelta | Motivo |
|---|---|
| Venezia come palette, non come icone | il brief vieta le cartoline; i colori veri del logo SONO già veneziani (lacca, oro, laguna) |
| Color coding delle famiglie | trasforma il colore acceso richiesto dal cliente in wayfinding e leva commerciale |
| Rosso solo per le CTA | se il rosso è ovunque non è più un segnale d'azione |
| Oro/pennellata mai come testo | non passano AA: lavorano da fondi ed evidenziatori |
| Fraunces al posto di Cormorant | stesso sapore editoriale, molta più leggibilità per un target over-60 |
| Filetto oro+rosso al posto del tricolore | italianità percepita dal mestiere (filettatura dei telai), non dalla bandiera |
| Nomi delle bici al centro | è un asset del cliente già esistente: rende ogni card un personaggio, non uno SKU |
| Scheda modello con CTA dedicata | il preventivo su UN modello è una richiesta facile; "contattaci" generico è una richiesta difficile |
| Barra mobile Chiama/WhatsApp | il decisore è spesso un caregiver da smartphone: l'azione deve stare sotto il pollice |
| Officina vera in foto | "produzione propria" è il differenziatore vs Decathlon/Amazon: va dimostrato, non dichiarato |

---

## 12. Idee originali che ci differenziano

1. **Ogni bici ha un nome.** Copy del catalogo: "In bottega le bici hanno nomi di persona, come
   le barche". La scheda dice "Vittoria, tre ruote, portapacchi doppio. Perfetta per chi torna in
   sella dopo tanto tempo."
2. **La targhetta col tuo nome** (sul su misura): chi ordina un prodotto personalizzato riceve la
   bici con targhetta smaltata col proprio nome, come il badge Alimagia [DA VALIDARE con Massimo:
   costo targhetta minimo, effetto passaparola massimo].
3. **WhatsApp precompilato per modello**: wa.me/393356102608 con testo "Vorrei un preventivo per
   il Mod. …". Zero attrito, e Massimo capisce subito di cosa si parla.
4. **La commessa di bottega** (guida alla scelta in 3 domande): nessun concorrente locale ce l'ha;
   è il ponte tra "non so niente di tricicli" e "chiedo il prezzo del modello giusto".
5. **Le ali come sistema**: il segno delle ali del logo, ridisegnato pulito, appare nei badge,
   nel marker "consigliata per te", nel timbro dell'hero. I piccioni di San Marco senza piccioni.
6. **Il filetto che accompagna**: la linea oro+rosso che si disegna lungo la pagina è memorabile,
   costa zero performance, e nessun template la ha.
7. **Il collaudo di Massimo**: se confermato dal cliente, ogni bici consegnata esce "collaudata e
   firmata": nel sito diventa un timbro nella sezione garanzie [DA RICHIEDERE conferma].
8. **Agevolazioni ausili in chiaro**: sezione dedicata a IVA agevolata/detrazioni per ausili
   disabili [DA VERIFICARE col commercialista del cliente]: nessun concorrente lo spiega, ed è
   spesso l'argomento che chiude l'acquisto per le famiglie.

---

## Nota operativa Elivo

- **Scope**: questo è un progetto da braccio alto (sito completo 800-2500 €), non una Landing
  Express. La demo attuale è un'ottima base tecnica: la v2 è un'evoluzione mirata (palette,
  hero, 2 sezioni nuove, scheda modello, foto), non un rifacimento.
- **Materiali da chiedere al cliente**: anno di fondazione, specifiche e fasce prezzo dei modelli,
  servizio fotografico officina + ritratto Massimo, recensioni esistenti, conferma prova in sede,
  verifica agevolazioni fiscali, testi privacy/cookie.
- **Quick win subito applicabili alla demo attuale** (mezza giornata):
  usare hero-triciclo.png nell'hero; link wa.me; campo "Mi interessa" nel form; colore di famiglia
  nei filtri e nelle card; togliere la tagline ripetuta; privacy/cookie reali; endpoint form vero.
- Asset nel repo non utilizzati: hero-triciclo.png, deco-bici.jpg, bici-violeta.jpg.
