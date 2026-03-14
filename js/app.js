// ==========================================
// ADAMAS PROTOCOL - CORE ENGINE V2.0
// ==========================================

// 1. Initial User Stats
let userStats = JSON.parse(localStorage.getItem('adamas_user')) || {
    balance: 0,
    wallet: null,
    rank: "Silver Miner",
    staked: 0,
    isFirstTime: true
};

// 2. Global Update Function
function updateUI() {
    const balEl = document.getElementById('balance');
    const wallEl = document.getElementById('walletAddress');
    
    if (balEl) balEl.innerText = userStats.balance.toLocaleString();
    if (wallEl) {
        wallEl.innerText = userStats.wallet ? userStats.wallet : "Not Connected";
    }
    
    if (document.getElementById('stakedVal')) {
        document.getElementById('stakedVal').innerText = userStats.staked;
    }
}

// 3. Save Data to LocalStorage
function saveStats() {
    localStorage.setItem('adamas_user', JSON.stringify(userStats));
}

// 4. Wallet Connection Logic (For Launch Button)
function connectWallet() {
    const btn = document.getElementById('launchBtn');
    if (!btn) return;

    btn.innerText = "CONNECTING...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    setTimeout(() => {
        // Generate random wallet if not exists
        if (!userStats.wallet) {
            userStats.wallet = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase() + "..." + Math.random().toString(16).slice(2, 6).toUpperCase();
        }
        
        // Give new users 500 ABP welcome bonus
        if (userStats.isFirstTime) {
            userStats.balance += 500;
            userStats.isFirstTime = false;
        }

        saveStats();
        
        // Success & Redirect
        alert("Wallet Connected: " + userStats.wallet);
        window.location.href = "dashboard.html";
    }, 1500);
}

// 5. Social Task Logic (For Community Page)
function handleSocialTask(platform, link) {
    let storageKey = 'adamas_task_' + platform;
    
    if (localStorage.getItem(storageKey)) {
        alert("Mission already completed!");
        return;
    }

    window.open(link, '_blank');

    setTimeout(() => {
        if (confirm(`Did you follow/join our ${platform.toUpperCase()}? Click OK to verify and claim 1,000 ABP.`)) {
            userStats.balance += 1000;
            localStorage.setItem(storageKey, 'true');
            saveStats();
            updateUI();
            alert("Verification Successful! +1,000 ABP added.");
            location.reload(); 
        }
    }, 2000);
}

// Auto Update on Page Load
window.onload = updateUI;
