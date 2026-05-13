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
    const loginPageUrl = 'https://www.itpomezia.com/intranet/login.php?t=76';
    const loginPostUrl = 'https://www.itpomezia.com/intranet/login.php';
    const pageProxyUrl = PROXY_URL + loginPageUrl;
    const postProxyUrl = PROXY_URL + loginPostUrl;

    // Step 1: Fetch the login page to extract the CSRF token
    let loginPageResponse;
    try {
        loginPageResponse = await fetch(pageProxyUrl, {
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

    // Step 3: POST the login form with CSRF token to login.php (without ?t=76)
    const params = new URLSearchParams();
    params.append('csrf_token', csrfToken);
    params.append('ennova_id', username);
    params.append('password_intranet', password);
    params.append('loginButton', 'Login');

    let response;
    try {
        response = await fetch(postProxyUrl, {
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