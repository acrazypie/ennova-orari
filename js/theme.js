const THEME_KEY = 'theme';

export function initTheme() {
    const savedTheme = getTheme();
    setTheme(savedTheme);
}

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
}