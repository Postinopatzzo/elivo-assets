# Dossier competitor Elivo Studio

Agosto 2026. Mappatura del campo competitivo e selezione dei 10 siti da usare
come metro di paragone su back end, front end, database, api, cookies, policy,
termini e condizioni, blueprint.

---

## 1. Sintesi

Sono stati mappati 42 competitor su quattro livelli. Da questi sono stati
selezionati 10 siti come benchmark tecnico.

Tre cose emergono e valgono piu della classifica.

**Siamo prezzati come freelance e ci vendiamo come team.** Il mercato italiano
2026 parte da 500 a 900 euro per una landing semplice e sta fra 1.500 e 2.500
per un sito vetrina di professionisti e artigiani. Un sito aziendale
professionale parte da 3.500. Un'agenzia applica in media un ricarico di 2 o 3
volte rispetto a un freelance dello stesso livello tecnico. La Landing Express
a 400 euro sta sotto il pavimento del mercato, e l'entry del braccio alto a 800
sta sotto la fascia dei siti vetrina. L'aumento previsto dopo i primi 10 clienti
founder e la mossa giusta, e semmai e prudente.

**Il ricorrente si vende sul risultato, non sulla manutenzione.** Sul canone
mensile ci sono due mondi. Dreamers a 24,90 e FDL a 37 vendono manutenzione, e
competono al ribasso. Qood vende da 97 a 247 al mese e nomina i suoi piani con
il risultato: creazione contatti, prenotazione online, vendita prodotti. I
nostri 30 euro al mese oggi sono descritti come hosting, SSL, backup,
monitoraggio e piccole modifiche. E un elenco di costi, e un elenco di costi
tira il prezzo verso il basso per definizione. Qood dimostra che la stessa spesa
ricorrente regge a un multiplo se il nome del piano e il risultato che produce.

**Il livello alto e raggiungibile con il nostro stesso stack.** AQuest, a Verona,
e la prima agenzia italiana su Awwwards con 23 premi, ma ha oltre 60 persone e
non e un paragone utile. My Web Lab si: e a Milano, costruisce in Next.js come
noi, e il suo sito ha una Honorable Mention di Awwwards. Non e una dichiarazione
loro, sta sul sito di Awwwards. La qualita di esecuzione non e una funzione della
dimensione del team, ed e la nostra tesi. La differenza e che loro l'hanno gia
dimostrata e noi no.

---

## 2. Come e stata fatta questa ricerca, e cosa non copre

Va detto prima dei risultati, perche cambia come si leggono.

La sessione in cui e stata prodotta questa ricerca aveva accesso di rete
limitato a GitHub. Non e stato possibile aprire nemmeno un sito dei competitor.
Le informazioni qui raccolte vengono da ricerca web e sono di due tipi, sempre
segnalati: **verificate da fonte terza** oppure **dichiarate dal competitor
stesso**. Nessun dato tecnico in questo documento e stato misurato.

Per questo la ricerca produce due cose, non una:

1. Questo dossier, che dice chi sono i competitor, come si posizionano e cosa
   guardare in ciascuno.
2. `elivo-competitor-scan.mjs`, lo strumento che misura davvero le otto
   dimensioni. Va eseguito da un ambiente senza restrizioni di rete. Fino ad
   allora la classifica del capitolo 4 e un ordine ragionato, non un risultato.

Questa distinzione non e una formalita. Con ABD Costruzioni abbiamo gia pagato
il costo di una premessa data per buona senza verificarla.

---

## 3. La mappa competitiva

Non abbiamo un solo tipo di concorrente. Ne abbiamo quattro, e ognuno ci attacca
da un lato diverso.

### Livello 1. Locali del Veneto, 8 nomi

Ci contendono le stesse ricerche su Castelfranco, Treviso, Padova e Venezia.
Kenji, Medialine Group, LumiaWeb, Zoe Web Solutions, Graphic Studio WS, Cocco
Web Agency, Padova Web Agency, Venezia Siti Web.

Il rischio qui non e la qualita, e la copertura. Diversi di questi hanno pagine
dedicate a Castelfranco Veneto costruite apposta per intercettare chi cerca. Noi
su quelle query oggi non ci siamo.

### Livello 2. Modello abbonamento, 7 nomi

Attaccano direttamente il nostro ricorrente da 30 euro al mese. Dreamers
(24,90/mese), FDL Studio (37/mese), Qood (97-247/mese), NetCommit, BNZ
Solutions, ALOUD Marketing, GM Web Agency.

Da studiare non tanto per il sito quanto per il contratto. Chi vende un
abbonamento vero ha obblighi di trasparenza su rinnovo, recesso e proprieta del
sito che noi, con la clausola founder e il primo anno di hosting incluso,
dobbiamo mettere per iscritto meglio di come li abbiamo oggi.

### Livello 3. Verticali sul nostro ICP, 16 nomi

Coprono i cinque verticali che stiamo testando. Fisioterapisti e osteopati:
Vestudio, Bellatrix, SitiWeb-WP, Ricci Francesca. Edilizia: SettimoLink, SFWEB,
Dsdesign, Unidevs. Hotel e B&B: Ondanomala, Artwork Studios, Mainstream, SitoWP,
Digital Web Italia, Gabriele Pantaleo. Palestre e personal trainer: WebPro
Italia, Digital Connect.

Due segnali da prendere sul serio. Ondanomala vende gia ai piccoli alberghi
esattamente l'angolo delle prenotazioni dirette contro le commissioni Booking,
quindi non e un angolo nostro, e un angolo del settore, e va sostenuto con
numeri. WebPro Italia sui personal trainer non vende un sito ma un ecosistema
con area clienti e pannello trainer: nel verticale palestre la landing singola
compete male.

### Livello 4. Fascia alta, 11 nomi

Non ci contendono i clienti di oggi. Sono il metro di quello che vogliamo saper
costruire. AQuest, Bliss Agency, Vacuum Studio, Cybear, My Web Lab, Codebaker,
Cose Agency, Obliquo Design, MaxMile, Gavriel La Stella, Esc Agency.

Nota su My Web Lab, Codebaker, MaxMile e Gavriel La Stella: vendono
esplicitamente Next.js e architetture headless come argomento commerciale. E il
nostro stesso stack. Sul piano tecnico non abbiamo un vantaggio da rivendicare,
abbiamo una parita da difendere.

---

## 4. I 10 selezionati

Scelti per coprire tutte e otto le dimensioni e tutti e quattro i livelli. Non
sono i 10 piu grandi: sono i 10 da cui c'e piu da imparare.

| # | Competitor | Sede | Livello | Cosa guardare | Evidenza |
|---|---|---|---|---|---|
| 1 | **AQuest** | Verona | fascia alta | front end, animazioni, blueprint | verificata da terzi |
| 2 | **Bliss Agency** | Roma e Milano | fascia alta | blueprint, policy, multilingua | mista |
| 3 | **Kenji** | Treviso | locale | tutte, e il metro locale | dichiarata |
| 4 | **Codebaker** | Bologna | fascia alta | backend, api, database | dichiarata |
| 5 | **My Web Lab** | Milano | fascia alta | front end, performance dichiarata | verificata da terzi |
| 6 | **Medialine Group** | Mira (VE) | locale | blueprint, local SEO | dichiarata |
| 7 | **Vacuum Studio** | Milano | fascia alta | front end, peso, performance | dichiarata |
| 8 | **Cose Agency** | Roma | fascia alta | blueprint, dati strutturati | dichiarata |
| 9 | **Cybear** | Avellino | fascia alta | front end con team piccolo | nomination, non vittorie |
| 10 | **Qood** | Italia | abbonamento | termini, policy, funnel ricorrente | prezzi verificati |

### Perche questi

**AQuest** e il tetto, ed e in Veneto. 23 premi Awwwards, prima in Italia e
terza al mondo nel ranking. Serve per capire dove finisce la scala.

**Bliss Agency** lavora su brand premium con una macchina editoriale bilingue.
Il suo sito e prima di tutto un'architettura di contenuti che intercetta chi sta
scegliendo un'agenzia. E il blueprint da studiare, non la grafica.

**Kenji** e il competitor diretto piu forte sul nostro territorio. Copre Treviso,
Venezia e Padova. Se un nostro prospect chiede un secondo preventivo, e
plausibile che lo chieda a loro.

**Codebaker** argomenta il valore in termini di API, integrazioni e
infrastruttura. E il modo di vendere il braccio alto che a noi oggi manca.

**My Web Lab** dichiara Next.js custom e zero CLS. Il confronto piu diretto sul
nostro stack: la scansione dira se la promessa regge o e marketing.

**Medialine Group** ha trent'anni e una struttura a pagine per provincia. E il
modello di local SEO che oggi ci precede su Treviso e Padova.

**Vacuum Studio** spinge su 3D e animazioni. Serve a misurare il punto in cui il
front end spettacolare inizia a costare in performance.

**Cose Agency** costruisce il web design attorno al posizionamento organico, con
struttura multilingua. Utile per i dati strutturati.

**Cybear** e piccola e dichiara premi internazionali. E la prova che il livello
alto non richiede sessanta persone. Da verificare sul profilo Awwwards.

**Qood** e l'unico selezionato per motivi contrattuali prima che estetici. Vende
abbonamenti da 97 a 247 euro al mese, quindi ha per forza termini e condizioni
seri su rinnovo, recesso e proprieta del sito. Sono i documenti che a noi
servono e che oggi non abbiamo scritti bene.

### 4.1 Cosa e emerso approfondendo

Approfondimento su fonti pubbliche, senza aprire i siti. Quattro cose cambiano
il quadro.

**Il contratto di Qood e piu duro del nostro, e proprio per questo funziona.**
Durata minima 12 mesi. Il sito resta di proprieta del cliente e i diritti
d'autore del designer. Alla scadenza il cliente puo restare o portarsi il sito
altrove. Ma in caso di recesso anticipato, prima dei 12 mesi, il cliente perde
la proprieta del dominio e del sito. Pagamenti ricorrenti con Stripe o carta.

E un impianto che risponde per iscritto alle tre domande che ogni cliente in
abbonamento fa prima o poi: per quanto sono legato, di chi e il sito, cosa
succede se smetto. Noi a queste tre domande oggi non rispondiamo da nessuna
parte. Il nostro "primo anno di hosting incluso" non dice cosa succede l'anno
dopo, e la Gestione e Cura a 30 euro al mese non ha ne durata minima ne clausola
di uscita.

Attenzione: queste condizioni arrivano da una ricerca, non dalla lettura diretta
del documento. Vanno verificate sul contratto originale prima di prenderle a
modello. Resta un punto aperto del capitolo 8.

**My Web Lab sale di livello.** Il loro sito ha una Honorable Mention di
Awwwards, con galleria portfolio 3D in Three.js guidata dallo scroll. Non e piu
una dichiarazione loro, e sul sito di Awwwards. E il benchmark piu rilevante
della lista: stessa tecnologia che usiamo noi, Next.js, eseguita a un livello
riconosciuto da terzi. Se dobbiamo guardarne uno solo, guardiamo questo.

**Cybear ha nomination, non vittorie.** Va corretto quello che avevo scritto
prima. Sono nomination Awwwards su singoli progetti, Monte Zovo nel 2020 e Torre
Civette nel 2025, non premi vinti dall'agenzia. La distinzione conta se qualcuno
di noi pensa di usare quel linguaggio.

Piu interessante e la loro lista clienti: Carpene Malvolti, Monte Zovo, Armando
al Pantheon. Carpene Malvolti e una casa spumantistica di Conegliano, provincia
di Treviso. Un'agenzia di Avellino serve un marchio a mezz'ora da Castelfranco.
La distanza non protegge il mercato locale, in nessuna delle due direzioni.

**Medialine Group e avanti per anzianita e indietro per tecnologia.** Trent'anni
di attivita, sede a Mira, team con grafici, copywriter, SEO e programmatori
dichiarati su PHP, jQuery e MySQL. jQuery nel 2026 e una scelta di manutenzione,
non di progetto. E il concorrente locale piu strutturato che abbiamo, e sul piano
tecnico e il piu attaccabile. Da confermare con la scansione.

**Kenji** non pubblica prezzi ma ha una pagina recensioni dedicata. Copre
Treviso, Venezia e Padova e dichiara di lavorare con artigiani e piccole imprese:
esattamente i nostri. Sul territorio e il confronto vero.

**Codebaker** e piu una software house che una web agency: app su misura, IoT,
Industry 4.0, Kubernetes, Docker, IAM, API REST e GraphQL. Non ci contende la
Landing Express. Ci contende il braccio alto nel momento in cui un cliente chiede
un'integrazione con il gestionale.

---

## 5. Le otto dimensioni

Ecco cosa misura lo scanner, con che peso, e cosa consideriamo buono. I pesi
sono nel codice e si cambiano in un punto solo.

### Back end, peso 15

HTTPS, sei header di sicurezza (HSTS, CSP, X-Content-Type-Options,
X-Frame-Options, Referrer-Policy, Permissions-Policy), compressione, cache,
tempo di risposta, versioni software esposte.

Buono: TTFB sotto 400ms, almeno 4 header su 6, nessun banner di versione. La
maggior parte dei siti italiani di piccole agenzie sta a 0 o 1 header su 6 e
dichiara la versione di PHP nell'header. Ogni versione esposta e un regalo a chi
cerca installazioni vulnerabili.

### Front end, peso 15

Framework e CMS, peso dell'HTML, viewport, formati immagine moderni, lazy
loading, script bloccanti nel head, strategia dei font, attributo lang.

Buono: HTML sotto 60KB, zero script bloccanti nel head, immagini in webp o avif.

### Database, peso 10

Segnali di CMS e database, e soprattutto cosa lasciano esposto. Il controllo che
conta e `/wp-json/wp/v2/users`: su molte installazioni WordPress restituisce la
lista degli utenti con lo slug di login. E il primo passo di un attacco a forza
bruta, e si chiude in due minuti. Lo scanner verifica anche `.env`,
`.git/config` e backup dimenticati nella root.

### API, peso 10

Superficie pubblica: robots.txt, sitemap.xml, `/wp-json/`, `/api/`, GraphQL,
CORS permissivo, e i dati strutturati JSON-LD, che sono l'API semantica verso
Google.

Buono: sitemap presente, JSON-LD con LocalBusiness o ProfessionalService,
nessuna API REST aperta senza motivo.

### Cookies, peso 20, il piu alto

Pesa piu di tutto per due ragioni: e l'esposizione legale piu concreta, ed e la
leva di vendita piu immediata in un audit.

Lo scanner rileva la piattaforma di consenso, i tracker presenti nell'HTML
iniziale e i cookie depositati dal server alla prima visita, seguendo anche i
redirect, perche molti siti piazzano il cookie di tracciamento proprio sul primo
salto.

Il quadro normativo al 2026, dalle linee guida del Garante: la cookie policy e
sempre obbligatoria, anche senza cookie di profilazione. Il banner deve avere
quattro comandi ugualmente visibili: accetta tutto, rifiuta tutto, personalizza,
e la X per chiudere senza consenso. I controlli granulari per categoria sono
obbligatori, un semplice accetta o rifiuta non basta. Il consenso non va
conservato oltre sei mesi. Non ci sono esenzioni per i siti piccoli: anche un
sito vetrina con un solo form contatti deve avere informativa, banner e consensi
espliciti.

Limite dichiarato dello strumento: legge header HTTP e HTML iniziale. I cookie
scritti da JavaScript dopo il render non li vede. Un punteggio alto significa
quindi "nessuna violazione evidente", non "conformita accertata". Chi vende una
certificazione di conformita con uno strumento come questo sta vendendo fumo.

### Policy, peso 10

Privacy policy e cookie policy raggiungibili e linkate dalla home.

### Termini e condizioni, peso 8

Presenza dei termini, piu partita IVA e indirizzo visibili. Per una societa
italiana i dati identificativi in home non sono cortesia, sono obbligo
informativo. E il controllo piu rapido per capire se un sito e stato fatto da un
professionista o dal nipote.

### Blueprint, peso 12

L'architettura: title e description, gerarchia dei titoli, canonical, Open
Graph, numero di URL in sitemap, presenza di una call to action e di prova
sociale in home.

Buono: un solo H1, title fra 25 e 65 caratteri, description fra 70 e 165,
canonical presente, e una richiesta chiara in home.

---

## 6. Cosa ce ne facciamo

**Sul prezzo.** Il listino va rivisto verso l'alto dopo i 10 founder, come gia
previsto. I numeri di mercato lo sostengono: siamo sotto il pavimento, non
appena sotto la media.

**Sul ricorrente.** Rinominare i piani di Gestione e Cura sul risultato invece
che sui componenti. Oggi vendiamo hosting, SSL, backup e monitoraggio. Sono i
costi, non il risultato. Qood vende gli stessi euro chiamandoli creazione
contatti e prenotazione online. Da valutare con Andrea, e una modifica di copy,
non di servizio.

**Sull'audit.** Lo scanner e uno strumento di vendita oltre che di ricerca.
Puntato sul sito di un prospect produce in pochi minuti la sezione "cosa vi
costa" prevista dalla SOP audit, con rilievi verificabili invece che opinioni.
Il controllo sull'enumerazione utenti WordPress e sui cookie prima del consenso
apre da solo una conversazione con la maggior parte delle piccole imprese.

**Su di noi.** Le stesse otto dimensioni valgono per elivostudio.com e per ogni
sito che consegniamo. Prima di usare lo scanner sui competitor, va puntato sul
nostro sito e su quello di Giovanni Garavello. Se falliamo i controlli che
useremo per vendere, il documento di audit diventa un'arma contro di noi. Il
pannello del Modulo Blog, avendo autenticazione e database, e il punto che merita
piu attenzione.

**Sui contratti.** Vanno chiusi due punti gia aperti. La garanzia "30 giorni o
non paghi" resta da validare legalmente e finche non lo e non va comunicata. Il
prezzo dell'anno 2 dell'hosting va fissato per iscritto alla conferma d'ordine,
non lasciato implicito nel primo anno incluso.

A questi se ne aggiunge un terzo, che arriva da Qood. Il nostro ricorrente deve
rispondere per iscritto a tre domande: per quanto tempo il cliente e legato, di
chi e il sito, cosa succede al sito e al dominio se smette di pagare. Qood
risponde a tutte e tre. Noi a nessuna. Non serve copiare la loro durezza, il
recesso anticipato che fa perdere dominio e sito e una clausola aggressiva che
con la nostra clientela founder rischia di bruciare fiducia. Serve rispondere.
Il silenzio su queste tre domande non protegge nessuno dei due, e al primo
cliente che smette di pagare diventa una discussione senza documento.

---

## 7. Come eseguire la scansione

Serve un ambiente con accesso di rete libero. Node 18 o superiore, nessuna
dipendenza da installare.

```bash
cd competitor-research

# tutti e 42 i competitor
node elivo-competitor-scan.mjs

# solo un sito
node elivo-competitor-scan.mjs --site kenji.it

# lista propria e cartella di output
node elivo-competitor-scan.mjs --input lista.json --out ./report --concurrency 3
```

Produce in `report/`: un HTML dark ordinato per punteggio con il dettaglio
espandibile per riga, un CSV per Excel e per il pannello, un JSON con i dati
grezzi.

Ogni sito richiede circa 20 richieste con una pausa di 400ms fra una e l'altra.
Su 42 competitor con concorrenza 3 servono all'incirca 10 minuti.

Prima di modificare lo scanner, o dopo averlo fatto:

```bash
node test-scanner.mjs
```

Solleva tre siti finti in locale, uno fatto bene, uno fatto male e uno che
risponde 403, e verifica 31 comportamenti dello scanner. Devono passare tutti.

---

## 8. Punti aperti

- La classifica del capitolo 4 e un ordine ragionato. Diventa un risultato solo
  dopo la scansione.
- Le condizioni contrattuali di Qood riportate al capitolo 4.1 arrivano da
  ricerca, non dalla lettura diretta. Vanno lette sul documento originale prima
  di usarle come modello per i nostri.
- Lo scanner non vede i cookie scritti da JavaScript. Se serve la verifica
  completa va aggiunto un passaggio con browser headless.
- Nessun competitor pubblica i prezzi del braccio alto. Per tarare la forchetta
  800-2500 servono i preventivi veri, non i loro siti.
- Chiuso: i riconoscimenti di Cybear sono nomination Awwwards su singoli
  progetti, 2020 e 2025, non premi vinti dall'agenzia.
