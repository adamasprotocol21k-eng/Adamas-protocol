/**
 * ADAMAS PROTOCOL - Dynamic Navigation
 * Is file se Nav Bar har page par apne aap active ho jayega.
 */

const NavigationModule = {
    init() {
        const navHTML = `
        <nav id="master-nav">
            <div class="nav-item" onclick="window.location.href='dashboard.html'">
                <span class="nav-icon">🏠</span>
            </div>
            <div class="nav-item" onclick="window.location.href='game.html'">
                <span class="nav-icon">🎮</span>
            </div>
            <div class="nav-item" onclick="window.location.href='learn.html'">
                <span class="nav-icon">📖</span>
            </div>
            <div class="nav-item" onclick="Notify.show('Vault Sector Locked', 'info')">
                <span class="nav-icon">💰</span>
            </div>
        </nav>
        <style>
            #master-nav {
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                width: 90%; max-width: 400px; background: rgba(10, 11, 20, 0.9);
                backdrop-filter: blur(15px); border-radius: 50px;
                display: flex; justify-content: space-around; padding: 15px;
                border: 1px solid rgba(0, 242, 255, 0.2); z-index: 9999;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            }
            .nav-item { cursor: pointer; transition: 0.3s; padding: 5px 15px; }
            .nav-item:hover { transform: translateY(-5px); filter: drop-shadow(0 0 8px #00f2ff); }
            .nav-icon { font-size: 1.5rem; }
        </style>
        `;

        // Nav ko body ke aakhir mein add karna
        document.body.insertAdjacentHTML('beforeend', navHTML);
    }
};

// Page load hote hi Nav bar dikhao
window.addEventListener('DOMContentLoaded', () => NavigationModule.init());

