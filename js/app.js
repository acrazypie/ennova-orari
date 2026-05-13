import { initTheme } from './theme.js';
import { getCredentials, clearCredentials } from './auth.js';
import { fetchSchedule } from './schedule.js';
import { showHomeView, showSettingsView, showLoading, hideLoading, showError, renderShifts } from './ui.js';
import { initSettings } from './settings.js';

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();

    const credentials = getCredentials();
    if (!credentials) {
        showSettingsView();
        initSettings();
        return;
    }

    showHomeView();
    initSettings();

    // Auto-login and fetch schedule
    try {
        showLoading();
        const shifts = await fetchSchedule();
        renderShifts(shifts);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        showError();
    } finally {
        hideLoading();
    }

    // Event listeners
    document.getElementById('settings-btn').addEventListener('click', () => {
        showSettingsView();
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        showHomeView();
    });

    document.getElementById('refresh-btn').addEventListener('click', async () => {
        try {
            showLoading();
            const shifts = await fetchSchedule();
            renderShifts(shifts);
        } catch (error) {
            console.error('Error refreshing schedule:', error);
            showError();
        } finally {
            hideLoading();
        }
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        clearCredentials();
        showSettingsView();
    });
});