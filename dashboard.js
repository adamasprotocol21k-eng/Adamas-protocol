/**
 * ADAMAS DASHBOARD LOGIC - PRO VERSION
 * Features: Bypass Mode, Persistent Balance, Real-time Mining
 */

// 1. INITIALIZE DASHBOARD (The Entry Guard Fix)
window.onload = () => {
    let savedAddress = localStorage.getItem('adamas_user');
    const addressEl = document.getElementById('user-address');
    
    // BYPASS FOR TESTING: Agar address nahi mila, toh wapas nahi jayega
    if (!savedAddress) {
        console.warn("No wallet found. Activating Test Mode.");
        savedAddress = "0xADAMAS_TEST_USER_777"; // Placeholder
    }

    // Format address for UI
    if (addressEl) {
        addressEl.innerText = savedAddress.slice(0, 6) + "..." + savedAddress.slice(-4);
    }

    // Load saved balance if exists (Refresh fix)
    const storedBalance = localStorage.getItem('adamas_balance');
    if (storedBalance) {
        balance = parseFloat(storedBalance);
        updateDisplay();
    }
};

// 2. MINING ENGINE
let miningActive = false;
let balance = 0.0000;

window.toggleMining = function() {
    const btn = document.querySelector('.btn-mine-start');
    if (!btn) return;

    miningActive = !miningActive;

    if (miningActive) {
        btn.innerText = "MINING IN PROGRESS...";
        btn.style.borderColor = "#00ff88";
        btn.style.color = "#00ff88";
        btn.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.3)";
        startCounter();
    } else {
        btn.innerText = "RESUME MINING";
        btn.style.borderColor = "var(--cyan)";
        btn.style.color = "var(--cyan)";
        btn.style.boxShadow = "none";
    }
};

function startCounter() {
    if (!miningActive) return;
    
    // Increment Logic
    balance += 0.000125; 
    updateDisplay();
    
    // Save to local storage so progress isn't lost on refresh
    localStorage.setItem('adamas_balance', balance);
    
    // Looping the counter (3 seconds)
    setTimeout(startCounter, 3000); 
}

function updateDisplay() {
    const balanceEl = document.getElementById('total-balance');
    if (balanceEl) {
        balanceEl.innerText = balance.toFixed(4);
    }
}
