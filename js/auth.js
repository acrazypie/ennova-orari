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
    const loginUrl = 'https://www.itpomezia.com/intranet/:399';
    const fullProxyUrl = PROXY_URL + loginUrl;

    // Step 1: Fetch the login page to extract the CSRF token
    let loginPageResponse;
    try {
        loginPageResponse = await fetch(fullProxyUrl, {
            method: 'GET',
            mode: 'cors'
        });
    } catch (error) {
        throw new Error(`Failed to fetch login page: ${error.message}`);
    }

    if (!loginPageResponse.ok) {
        throw new Error(`Failed to fetch login page: HTTP ${loginPageResponse.status}`);
    }

    const loginPageHtml = await loginPageResponse.text();

    // Step 2: Parse the HTML to extract the CSRF token
    const parser = new DOMParser();
    const loginPageDoc = parser.parseFromString(loginPageHtml, 'text/html');
    const csrfTokenElement = loginPageDoc.querySelector('input[name="csrf_token"]');
    if (!csrfTokenElement) {
        throw new Error('CSRF token not found on login page');
    }
    const csrfToken = csrfTokenElement.value;

    // Step 3: POST the login form with CSRF token
    const params = new URLSearchParams();
    params.append('csrf_token', csrfToken);
    params.append('ennova_id', username);
    params.append('password_intranet', password);
    params.append('action', 'login');

    let response;
    try {
        response = await fetch(fullProxyUrl, {
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