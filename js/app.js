// ADAMAS PROTOCOL - CORE ENGINE V2.0
let userStats = JSON.parse(localStorage.getItem('adamas_user')) || {
    balance: 0,
    wallet: "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6),
    rank: "Silver Miner",
    staked: 0
};

// Global function to update UI elements
function updateUI() {
    const balEl = document.getElementById('balance');
    const wallEl = document.getElementById('walletAddress');
    
    if (balEl) balEl.innerText = userStats.balance.toLocaleString();
    if (wallEl) wallEl.innerText = userStats.wallet;
    
    // Update other common elements if they exist
    if (document.getElementById('stakedVal')) document.getElementById('stakedVal').innerText = userStats.staked;
}

// Save data to LocalStorage
function saveStats() {
    localStorage.setItem('adamas_user', JSON.stringify(userStats));
}

// Power-Up Social Task Logic
function handleSocialTask(platform, link) {
    let storageKey = 'adamas_task_' + platform;
    
    if (localStorage.getItem(storageKey)) {
        alert("Mission already completed!");
        return;
    }

    // Open link
    window.open(link, '_blank');

    // Simulate verification
    setTimeout(() => {
        if (confirm(`Did you follow/join our ${platform.toUpperCase()}? Click OK to verify and claim 1,000 ABP.`)) {
            userStats.balance += 1000;
            localStorage.setItem(storageKey, 'true');
            saveStats();
            updateUI();
            alert("Verification Successful! +1,000 ABP added to your wallet.");
            location.reload(); // Refresh to show 'DONE' status
        }
    }, 2000);
}

// Initial Call
updateUI();
