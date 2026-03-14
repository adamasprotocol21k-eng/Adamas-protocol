// Staking Logic with 24-Day Rule
let stakeData = JSON.parse(localStorage.getItem('adamas_stake')) || {
    stakedAmount: 0,
    claimCount: 0,
    lockUntil: null
};

function initStaking() {
    updateStakeUI();
}

function updateStakeUI() {
    document.getElementById('stakedAmount').innerText = stakeData.stakedAmount.toFixed(2);
    const now = new Date().getTime();

    if (stakeData.stakedAmount > 0) {
        document.getElementById('stakeBtn').style.display = "none";
        document.getElementById('claimBtn').style.display = "block";
    }

    // Check Lock Period
    if (stakeData.lockUntil && now < stakeData.lockUntil) {
        document.getElementById('claimBtn').disabled = true;
        document.getElementById('claimBtn').innerText = "Locked";
        document.getElementById('lockTimer').style.display = "block";
        
        let diff = stakeData.lockUntil - now;
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        document.getElementById('daysLeft').innerText = days;
    }
}

function processStake() {
    if (userStats.balance <= 0) return alert("No ABP to Stake!");
    
    stakeData.stakedAmount = userStats.balance;
    userStats.balance = 0;
    
    saveStats();
    saveStakeData();
    updateStakeUI();
    alert("ABP Successfully Staked in Vault!");
}

function processClaim() {
    stakeData.claimCount++;
    
    if (stakeData.claimCount >= 3) {
        // Apply 24 Day Lock
        let lockDate = new Date();
        lockDate.setDate(lockDate.getDate() + 24);
        stakeData.lockUntil = lockDate.getTime();
        stakeData.claimCount = 0; // Reset counter for next cycle
        alert("3rd Claim Reached! 24-Day Protocol Lock Activated.");
    } else {
        alert("Claim successful! Claims until lock: " + (3 - stakeData.claimCount));
    }
    
    saveStakeData();
    updateStakeUI();
}

function saveStakeData() {
    localStorage.setItem('adamas_stake', JSON.stringify(stakeData));
}

