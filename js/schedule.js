import { login } from './auth.js';

// ===== CONFIGURAZIONE PROXY CORS =====
// Cambia questo URL con il tuo proxy CORS preferito.
// Deve corrispondere a quello in auth.js.
// Per cors-anywhere: 'https://cors-anywhere-production-xxxx.up.railway.app/'
// Per altri proxy: leggi la documentazione del proxy.
// Vedi README.md per istruzioni di self-hosting.
const PROXY_URL = 'https://cors-anywhere-production-9355.up.railway.app/';
// =====================================

export async function fetchSchedule() {
    const credentials = JSON.parse(localStorage.getItem('credentials'));
    if (!credentials) {
        throw new Error('No credentials found');
    }

    // Login first
    await login(credentials.username, credentials.password);

    // Fetch schedule page
    const scheduleUrl = 'https://itpomezia.com/intranet/pages/bacheca/mio-calendario';
    const fullUrl = PROXY_URL + scheduleUrl;

    let response;
    try {
        response = await fetch(fullUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    } catch (error) {
        throw new Error(`Schedule request failed: ${error.message}`);
    }

    if (!response.ok) {
        if (response.status === 530) {
            throw new Error('Proxy failure (530). Il proxy CORS potrebbe essere temporaneamente non disponibile.');
        }
        throw new Error(`Failed to fetch schedule: HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseSchedule(html);
}

function parseSchedule(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Assuming shifts are in a table or list - adjust selectors based on actual HTML
    const shiftElements = doc.querySelectorAll('table tr, .shift-item, .turno'); // Generic selectors, may need adjustment

    const shifts = [];
    shiftElements.forEach(element => {
        const date = element.querySelector('.date, td:first-child')?.textContent?.trim();
        const time = element.querySelector('.time, .shift-time, td:nth-child(2)')?.textContent?.trim();
        const location = element.querySelector('.location, .role, td:nth-child(3)')?.textContent?.trim();

        if (date) {
            shifts.push({
                date,
                time: time || 'N/A',
                location: location || 'N/A'
            });
        }
    });

    return shifts;
}