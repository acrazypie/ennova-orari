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
    const proxyUrl = 'https://corsproxy.io/?';
    const loginUrl = 'https://www.itpomezia.com/intranet/login.php?t=76';
    const fullUrl = proxyUrl + encodeURIComponent(loginUrl);

    const formData = new FormData();
    formData.append('ennova_id', username);
    formData.append('password_intranet', password);
    formData.append('action', 'login');

    const response = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response;
}