// Adamas Protocol - Game & Point Engine

let userStats = {
    balance: 0,
    wallet: "Not Connected",
    lastClaim: null
};

// 1. Initialize Dashboard
window.onload = () => {
    // Local storage se purana data check karna (Temporary, jab tak Firebase full set na ho)
    const savedBalance = localStorage.getItem('abp_balance');
    if (savedBalance) {
        userStats.balance = parseInt(savedBalance);
        updateUI();
    }
    
    // Wallet address dikhana (Jo auth.js se pass hoga)
    // Abhi ke liye placeholder
    document.getElementById('userWallet').innerText = "ADS User";
};

// 2. UI Update Function
function updateUI() {
    const balanceEl = document.getElementById('abpBalance');
    if (balanceEl) {
        balanceEl.innerText = userStats.balance.toLocaleString();
    }
    // Browser mein save karna taaki refresh pe zero na ho
    localStorage.setItem('abp_balance', userStats.balance);
}

// 3. Daily Claim Logic
function claimDaily() {
    const reward = 50;
    userStats.balance += reward;
    alert("Congratulations! You earned " + reward + " ABP");
    updateUI();
    
    // Yahan baad mein Firebase Update function aayega
    // syncToFirebase(userStats.balance);
}

// 4. Game Navigation
function openGame(gameType) {
    if (gameType === 'spin') {
        alert("Spin Wheel Loading... (Feature coming in next update)");
        // Yahan hum Spin wheel ka modal ya page open karenge
    } else if (gameType === 'scratch') {
        alert("Scratch Card Loading... (Feature coming in next update)");
    }
}

// 5. Firebase Sync Placeholder
function syncToFirebase(newBalance) {
    console.log("Syncing " + newBalance + " to Database...");
    // Firebase Firestore logic yahan jayega
}

