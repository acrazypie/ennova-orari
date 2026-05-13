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
    const loginUrl = 'https://www.itpomezia.com/intranet/login.php?t=76';
    const fullUrl = PROXY_URL + loginUrl;

    const params = new URLSearchParams();
    params.append('ennova_id', username);
    params.append('password_intranet', password);
    params.append('action', 'login');

    let response;
    try {
        response = await fetch(fullUrl, {
            method: 'POST',
            body: params,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error) {
        throw new Error(`Login request failed: ${error.message}`);
    }

    if (!response.ok) {
        throw new Error(`Login failed: HTTP ${response.status}`);
    }

    return response;
}