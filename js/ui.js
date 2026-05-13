export function showHomeView() {
    document.getElementById('home-view').classList.remove('hidden');
    document.getElementById('settings-view').classList.add('hidden');
}

export function showSettingsView() {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('settings-view').classList.remove('hidden');
}

export function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('shifts').innerHTML = '';
}

export function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

export function showError() {
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('shifts').innerHTML = '';
}

export function renderShifts(shifts) {
    document.getElementById('error').classList.add('hidden');
    const shiftsContainer = document.getElementById('shifts');

    if (shifts.length === 0) {
        shiftsContainer.innerHTML = '<p class="no-shifts">Nessun turno trovato.</p>';
        return;
    }

    shiftsContainer.innerHTML = shifts.map(shift => `
        <div class="shift-card">
            <div class="shift-date">${shift.date}</div>
            <div class="shift-details">
                <div>Orario: ${shift.time}</div>
                <div>Luogo/Ruolo: ${shift.location}</div>
            </div>
        </div>
    `).join('');
}