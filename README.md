# I Miei Turni - App Web per Orari di Lavoro

## PARTE 1 — Per tutti (non tecnici)

### Che cos'è questa app?
Questa è un'app web semplice che ti permette di vedere i tuoi turni di lavoro dall'intranet aziendale direttamente dal tuo browser o telefono, senza dover accedere ogni volta al sito intranet.

### Come aprire l'app
- Apri il browser sul tuo computer o telefono.
- Vai all'indirizzo web dove è pubblicata l'app (ad esempio, su GitHub Pages).
- L'app funziona su qualsiasi dispositivo con un browser moderno.

### Come inserire le tue credenziali la prima volta
- Quando apri l'app per la prima volta, verrai automaticamente portato alla pagina delle impostazioni.
- Inserisci il tuo username e password dell'intranet nei campi corrispondenti.
- Clicca su "Salva" per memorizzare le credenziali.
- Le credenziali vengono salvate solo sul tuo dispositivo e non vengono mai inviate da nessuna parte tranne che al login dell'intranet.

### Come cambiare tra modalità chiara e scura
- Nella pagina delle impostazioni, trovi un interruttore per "Tema scuro".
- Attivalo per passare alla modalità scura, o disattivalo per tornare alla modalità chiara.
- La tua preferenza viene ricordata automaticamente.

### Cosa succede alla mia password?
La tua password viene salvata solo sul tuo dispositivo (nel localStorage del browser) e viene usata solo per fare il login automatico all'intranet. Non viene mai inviata a nessun altro server oltre a quello dell'intranet aziendale. Ogni persona che usa l'app salva le proprie credenziali solo sul proprio dispositivo.

### Possono usare la stessa app i miei colleghi?
Sì! Ogni collega può usare lo stesso link dell'app, ma ognuno deve inserire le proprie credenziali nelle impostazioni. Le credenziali sono salvate solo sul dispositivo di ciascuna persona, quindi ognuno vede solo i propri turni.

## PARTE 2 — Per chi gestisce il progetto (tecnici)

### Come pubblicare l'app su GitHub Pages
1. Fai un fork o clona questo repository su GitHub.
2. Vai nelle impostazioni del repository (Settings > Pages).
3. Seleziona "Deploy from a branch" e scegli il branch principale (main o master).
4. L'app sarà disponibile all'indirizzo `https://tuousername.github.io/nome-repo/`.

### Struttura dei file
- `index.html`: Il markup HTML principale con la struttura delle due viste (Home e Impostazioni).
- `style.css`: Tutti gli stili CSS, inclusi i temi chiaro/scuro usando variabili CSS personalizzate.
- `js/app.js`: Punto di ingresso principale, inizializza l'app, gestisce la navigazione e il caricamento iniziale.
- `js/auth.js`: Gestisce l'autenticazione, salva/legge le credenziali dal localStorage, esegue il login POST.
- `js/schedule.js`: Scarica la pagina dei turni dopo il login e analizza l'HTML per estrarre i turni.
- `js/ui.js`: Gestisce tutte le manipolazioni del DOM: mostra/nasconde viste, spinner di caricamento, errori, rendering dei turni.
- `js/settings.js`: Gestisce la pagina delle impostazioni: input del form, salvataggio, toggle password, toggle tema.
- `js/theme.js`: Gestisce la preferenza del tema, applica l'attributo `data-theme` all'elemento `<html>` per prevenire il flash di tema sbagliato.
- `README.md`: Questo file.

### Approccio CORS proxy — Configurazione e Troubleshooting

L'app utilizza un proxy CORS configurabile per aggirare le restrizioni CORS di GitHub Pages.

**Proxy configurato al momento:** cors-anywhere deployato su Railway

**Come cambiar proxy**
- Apri `js/auth.js` e `js/schedule.js`.
- Modifica la riga `const PROXY_URL = '...'` con il tuo proxy preferito.
- Entrambi i file devono avere lo **stesso** valore di `PROXY_URL`.

**Proxy pubblici disponibili:**
| Proxy | URL | Stabilità | Cookies | Note |
|-------|-----|-----------|---------|------|
| AllOrigins | `https://api.allorigins.win/raw?url=` | Media | No | Gratuito, pubblico |
| CORS-Anywhere (self-hosted) | `https://tuo-proxy/` | Alta | No | Consigliato — vedi sotto |

**Soluzione consigliata: Self-hosting cors-anywhere su Railway (gratuito)**

1. **Crea un progetto Railway con cors-anywhere:**
   - Vai su [https://railway.app](https://railway.app) e accedi con GitHub.
   - Clicca "Create a New Project" → "Deploy from GitHub repo".
   - Cerca e seleziona il repo [cors-anywhere](https://github.com/Rob--W/cors-anywhere).
   - Railway farà il deploy e ti assegnerà un URL, es. `https://cors-anywhere-xxxxxx.up.railway.app`.

2. **Aggiorna il `PROXY_URL` nell'app:**
   - In `js/auth.js` e `js/schedule.js`, cambia la riga:
     ```javascript
     const PROXY_URL = 'https://cors-anywhere-xxxxxx.up.railway.app/';
     ```
   - **Attenzione:** L'URL deve finire con `/` (slash).

3. **Formato degli URL con cors-anywhere:**
   - Il proxy concatena il target URL direttamente: `https://proxy.com/https://target.com/page`
   - Non usare `encodeURIComponent()` — il target va appeso così com'è.
   - Le form data vanno inviate come `application/x-www-form-urlencoded`, non multipart.

4. **Test:**
   - Torna alla app, immetti le credenziali, clicca "Aggiorna".
   - Se vedi il messaggio di errore nel detail sotto il messaggio principale, controlla il testo esatto.
   - Apri DevTools (F12 → Console) per l'errore completo.

**Nota importante su cors-anywhere:**
- cors-anywhere **disabilita e rimuove i cookie** da tutte le richieste per motivi di sicurezza.
- Se l'intranet usa autenticazione basata su cookie di sessione (cookie `PHPSESSID`, ecc.), il login potrebbe non funzionare.
- Se questo succede, non c'è soluzione lato proxy — contatta l'amministratore per sapere se GitHub Pages è blocca per ragioni di sicurezza.

**Alternative di self-hosting (se cors-anywhere non funziona):**
- **Un tuo VPS cloud** (DigitalOcean, Linode, ecc.) — maggiore controllo ma più complesso.
- **Docker + Renderer** — media complessità, buona affidabilità.
- Contatta l'amministratore IT per sapere se una whitelistiting di GitHub Pages è possibile anziché usare un proxy.

### Come aggiornare i campi del form di login
Se l'intranet cambia i nomi dei campi del form di autenticazione:
1. Apri gli Strumenti di Sviluppo del browser (F12).
2. Vai alla pagina di login dell'intranet.
3. Ispeziona il form di login per trovare i nomi esatti dei campi input.
4. L'app **estrae automaticamente** il `csrf_token` dal form — non devi fare nulla.
5. Se i nomi dei campi dati cambiano, aggiorna in `auth.js` nella funzione `login()` le righe con `params.append()`.
   - Attualmente: `ennova_id`, `password_intranet`, `action`


### Chiavi localStorage usate dall'app
- `"credentials"`: Oggetto JSON con `username` e `password` (crittografati? No, salvati in chiaro).
- `"theme"`: Stringa `"light"` o `"dark"`.

### Considerazioni di sicurezza
- Le credenziali sono salvate in localStorage, che è accessibile via JavaScript sullo stesso dominio. Questo è vulnerabile se il dispositivo è condiviso o se ci sono malware.
- Raccomanda di non usare l'app su dispositivi condivisi o pubblici.
- Le credenziali vengono inviate solo al server intranet via HTTPS (si spera), ma il proxy CORS potrebbe intercettarle se non è sicuro.
- Per maggiore sicurezza, considera di criptare le credenziali in localStorage (ad esempio, con una chiave derivata da una passphrase utente).