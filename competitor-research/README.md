# competitor-research

Ricerca sui competitor di Elivo Studio e strumento per misurarne i siti.

## Cosa c'e qui

| File | Cosa e |
|---|---|
| `dossier-competitor.md` | La ricerca: 42 competitor su quattro livelli, i 10 selezionati come benchmark, cosa ce ne facciamo. Si legge per primo. |
| `competitors.json` | I 42 competitor con dominio, categoria e motivo. E l'input dello scanner. |
| `elivo-competitor-scan.mjs` | Lo scanner. Misura otto dimensioni e produce HTML, CSV e JSON. |
| `test-scanner.mjs` | 31 verifiche automatiche sullo scanner. |

## Uso

Node 18 o superiore. Nessuna dipendenza.

```bash
node elivo-competitor-scan.mjs                    # tutti e 42
node elivo-competitor-scan.mjs --site kenji.it    # uno solo
node elivo-competitor-scan.mjs --input lista.json --out ./report --concurrency 3
```

Output in `report/`: `scan-<data>.html` (report dark, righe espandibili),
`scan-<data>.csv` (Excel e pannello), `scan-<data>.json` (dati grezzi).

Circa 20 richieste per sito con pausa di 400ms. Su 42 siti con concorrenza 3
servono all'incirca 10 minuti.

## Le otto dimensioni e i pesi

backend 15, frontend 15, database 10, api 10, **cookies 20**, policy 10,
termini 8, blueprint 12.

I cookie pesano piu di tutto: sono l'esposizione legale piu concreta e la leva
di vendita piu immediata in un audit. I pesi stanno nella costante `PESI`, in
cima al file.

## Due avvertenze

**Sui cookie lo strumento vede meta della scena.** Legge header HTTP e HTML
iniziale, seguendo anche i redirect. I cookie scritti da JavaScript dopo il
render non li vede. Un punteggio alto significa "nessuna violazione evidente",
non "conformita accertata". Non va usato per certificare nulla a un cliente.

**Il flag `--deep` cerca file sensibili** (`.env`, `.git/config`, backup nella
root). Su un sito di terzi e a tutti gli effetti una scansione di vulnerabilita.
Sui nostri siti e su quelli dei clienti si usa liberamente. Sui competitor, con
cognizione. Per questo e disattivato di default.

## Test

```bash
node test-scanner.mjs
```

Solleva tre siti finti in locale, uno fatto bene, uno fatto male e uno che
risponde 403, e verifica 31 comportamenti. Vanno eseguiti dopo ogni modifica
allo scanner, e devono passare tutti.

## Stato

Lo scanner e testato ma non e ancora stato eseguito sui siti veri: la sessione
in cui e stato scritto aveva accesso di rete limitato a GitHub. La classifica
nel dossier e quindi un ordine ragionato su fonti pubbliche, non una
misurazione. Diventa un risultato dopo la prima esecuzione.
