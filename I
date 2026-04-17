/* ADAMAS PROTOCOL - GENESIS TIMER ENGINE 
   Core System v2.1 | PROTOCOL_DECRYPTION_LOGIC
*/

const LAUNCH_DATE = new Date("April 22, 2026 19:00:00").getTime();
const DEV_KEY = "admin123"; // Bypass URL: ?dev=admin123

const startTimer = () => {
    const timerBox = document.getElementById("launch-timer");
    const connectBtn = document.getElementById("connect-trigger");
    const statusLabel = document.getElementById("protocol-status");
    const authLabel = document.getElementById("auth-label");

    // --- ADMIN BYPASS ENGINE ---
    const params = new URLSearchParams(window.location.search);
    if(params.get('dev') === DEV_KEY) {
        console.log("ADAMAS_SYSTEM: Dev Mode Active");
        unlockSystem("ADMIN_BYPASS_ACTIVE");
        return;
    }

    // --- TIMER MAIN LOOP ---
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = LAUNCH_DATE - now;

        // Calculations
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        // UI Update: Added Padding (01d instead of 1d) for a premium look
        if(timerBox) {
            timerBox.innerText = `${String(d).padStart(2, '0')}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
        }

        // --- PROTOCOL ACTIVATION ---
        if (distance < 0) {
            clearInterval(interval);
            unlockSystem("PROTOCOL_READY");
        }
    }, 1000);

    function unlockSystem(msg) {
        // Smooth Transition
        if(timerBox) {
            timerBox.innerText = "PROTOCOL_LIVE";
            timerBox.style.color = "var(--p-green)";
            timerBox.style.fontSize = "18px";
            timerBox.style.letterSpacing = "4px";
        }
        
        if(connectBtn) {
            connectBtn.disabled = false;
            connectBtn.innerText = "CONNECT WALLET";
            connectBtn.style.animation = "pulseGlow 2s infinite ease-in-out";
            connectBtn.style.cursor = "pointer";
        }

        if(statusLabel) {
            statusLabel.innerText = "DECRYPTED_READY";
            statusLabel.style.color = "var(--p-green)";
        }

        if(authLabel) {
            authLabel.innerText = "HANDSHAKE_AVAILABLE";
            authLabel.style.color = "var(--cyan)";
        }
        
        console.log(`ADAMAS_STATUS: ${msg}`);
    }
};

document.addEventListener("DOMContentLoaded", startTimer);
