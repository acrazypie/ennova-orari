import { saveCredentials, getCredentials } from './auth.js';
import { setTheme, getTheme } from './theme.js';

export function initSettings() {
    const form = document.getElementById('settings-form');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const themeSwitch = document.getElementById('theme-switch');

    // Load existing credentials
    const credentials = getCredentials();
    if (credentials) {
        document.getElementById('username').value = credentials.username;
        document.getElementById('password').value = credentials.password;
    }

    // Load theme preference
    themeSwitch.checked = getTheme() === 'dark';

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (username && password) {
            saveCredentials(username, password);
            // Redirect to home view
            document.getElementById('home-view').classList.remove('hidden');
            document.getElementById('settings-view').classList.add('hidden');
        }
    });

    // Password toggle
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePasswordBtn.textContent = isPassword ? 'Nascondi' : 'Mostra';
    });

    // Theme toggle
    themeSwitch.addEventListener('change', () => {
        const theme = themeSwitch.checked ? 'dark' : 'light';
        setTheme(theme);
    });
}