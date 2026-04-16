/* ADAMAS PROTOCOL - GENESIS TIMER ENGINE */

const LAUNCH_DATE = new Date("April 22, 2026 19:00:00").getTime();
const DEV_KEY = "admin123"; // Bypass URL: ?dev=admin123

const startTimer = () => {
    const timerBox = document.getElementById("launch-timer");
    const connectBtn = document.getElementById("connect-trigger");
    const statusLabel = document.getElementById("protocol-status");
    const lockLabel = document.getElementById("lock-status");

    // Admin Bypass Check
    const params = new URLSearchParams(window.location.search);
    if(params.get('dev') === DEV_KEY) {
        unlockSystem("ADMIN_BYPASS_ACTIVE");
        return;
    }

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = LAUNCH_DATE - now;

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        if(timerBox) timerBox.innerText = `${d}d ${h}h ${m}m ${s}s`;

        if (distance < 0) {
            clearInterval(interval);
            unlockSystem("PROTOCOL_ACTIVE");
        }
    }, 1000);

    function unlockSystem(msg) {
        if(timerBox) timerBox.style.display = "none";
        if(connectBtn) {
            connectBtn.disabled = false;
            connectBtn.innerText = "CONNECT WALLET";
            connectBtn.style.boxShadow = "0 0 20px var(--cyan-glow)";
        }
        if(statusLabel) {
            statusLabel.innerText = "DECRYPTED";
            statusLabel.style.color = "var(--p-green)";
        }
        if(lockLabel) lockLabel.innerText = msg;
    }
};

document.addEventListener("DOMContentLoaded", startTimer);
