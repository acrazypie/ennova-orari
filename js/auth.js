const CREDENTIALS_KEY = 'credentials';

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
    const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
    const loginUrl = 'https://www.itpomezia.com/intranet/login.php?t=76';
    const fullUrl = proxyUrl + loginUrl;

    const formData = new FormData();
    formData.append('ennova_id', username);
    formData.append('password_intranet', password);
    formData.append('action', 'login');

    let response;
    try {
        response = await fetch(fullUrl, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });
    } catch (error) {
        throw new Error(`Login request failed: ${error.message}`);
    }

    if (!response.ok) {
        throw new Error(`Login failed: HTTP ${response.status}`);
    }

    return response;
}