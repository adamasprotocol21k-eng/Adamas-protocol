let isMining = false;
let miningInterval;

function initMining() {
    updateUI();
    document.getElementById('livePoints').innerText = userStats.balance.toFixed(2);
}

function toggleMining() {
    const btn = document.getElementById('mineBtn');
    const status = document.getElementById('miningStatus');

    if (!isMining) {
        isMining = true;
        btn.innerText = "Stop Mining";
        btn.style.borderColor = "#f85149"; // Red to stop
        status.innerText = "System: Mining ABP...";
        status.style.color = "#3fb950";

        miningInterval = setInterval(() => {
            userStats.balance += 0.01; // Mining speed
            document.getElementById('livePoints').innerText = userStats.balance.toFixed(2);
            saveStats();
        }, 1000);
    } else {
        clearInterval(miningInterval);
        isMining = false;
        btn.innerText = "Start Mining";
        btn.style.borderColor = "#58a6ff";
        status.innerText = "System: Idle";
        status.style.color = "#8b949e";
    }
}

function claimDaily() {
    alert("Daily Bonus: 50 ABP Added!");
    userStats.balance += 50;
    saveStats();
    updateUI();
    document.getElementById('livePoints').innerText = userStats.balance.toFixed(2);
}

