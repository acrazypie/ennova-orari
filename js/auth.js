const CREDENTIALS_KEY = 'credentials';

// ===== CONFIGURAZIONE PROXY CORS =====
// Cambia questo URL con il tuo proxy CORS preferito.
// Per cors-anywhere: 'https://cors-anywhere-production-xxxx.up.railway.app/'
// Per altri proxy: leggi la documentazione del proxy.
// Vedi README.md per istruzioni di self-hosting.
const PROXY_URL = 'https://cors-anywhere-production-9355.up.railway.app/';
// =====================================

export function getCredentials() {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    return stored ? JSON.parse(stored) : null;
}

export function saveCredentials(username, password) {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username, password }));
}

export function clearCredentials() {
    localStorage.removeItem(CREDENTIALS_KEY);
}

export async function login(username, password) {
    // Step 1: POST to login.php with dynamic ?t= parameter
    const loginUrl = 'https://www.itpomezia.com/intranet/login.php?t=' + Math.floor(Math.random() * 100 + 1);
    const loginProxyUrl = PROXY_URL + loginUrl;

    const params = new URLSearchParams();
    params.append('ennova_id', username);
    params.append('password_intranet', password);
    params.append('action', 'login');

    let response;
    try {
        response = await fetch(loginProxyUrl, {
            method: 'POST',
            body: params,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    } catch (error) {
        throw new Error(`Login request failed: ${error.message}`);
    }

    if (!response.ok) {
        throw new Error(`Login failed: HTTP ${response.status}`);
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error(`Login response parse failed: ${error.message}`);
    }

    if (data.message !== 'OK') {
        throw new Error(`Login failed: ${data.message || 'unexpected response'}`);
    }

    // Step 2: POST to verifica_accesso.php to complete the session
    const verifyUrl = 'https://www.itpomezia.com/wfm/ajax/verifica_accesso.php?t=' + Date.now();
    const verifyProxyUrl = PROXY_URL + verifyUrl;

    let verifyResponse;
    try {
        verifyResponse = await fetch(verifyProxyUrl, {
            method: 'POST',
            body: params,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    } catch (error) {
        throw new Error(`Access verification failed: ${error.message}`);
    }

    if (!verifyResponse.ok) {
        throw new Error(`Access verification failed: HTTP ${verifyResponse.status}`);
    }

    return verifyResponse;
}