
import { getJwt, getUsername } from "./users-api";
declare global {
    interface Window {
        handleLogout: () => void;
        clearAuthStorage: () => void;
    }
}

window.handleLogout = function() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    alert('Du wurdest abgemeldet.');
    window.location.href = '/agenda.html';
}


export function updateAuthStatus() {
    const token = getJwt();
    const username = getUsername();
    const statusContainer = document.getElementById('auth-status');
    console.log(username);
    
    if (!statusContainer) return;
    
    // ANGEMELDET: Token und Username beide vorhanden
    if (token && username) {
        statusContainer.innerHTML = `
            <div class="auth-logged-in">
                <span class="username-display"><img src="/images/Bild2.svg" alt="User Icon" width="25px" height="25px"> ${username}</span>
                <a href="/pages/profile.html" class="profile-edit-link">Profil bearbeiten</a>
                <button class="logout-btn" onclick="window.handleLogout()">Abmelden</button>
            </div>
        `;
    } else {
        // NICHT ANGEMELDET: Zeige Login-Link
        statusContainer.innerHTML = `
            <a href="/pages/login.html" class="auth-login-link"><img src="/images/Bild2.svg" title="Login Icon"></a>
        `;
    }
}

export function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    alert('Du wurdest abgemeldet.');
    window.location.href = '/agenda.html';
}


document.addEventListener('DOMContentLoaded', updateAuthStatus);


window.clearAuthStorage = function() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    console.log('✅ Auth-Storage gelöscht!');
    alert('Auth-Daten wurden gelöscht. Bitte seite neu laden.');
    window.location.reload();
}
