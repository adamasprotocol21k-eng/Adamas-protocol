/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (STREAK & TRUST UPDATE)
 * Features: Firebase Cloud Sync, Trust Score Engine, Streak Rewards
 */

// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
  authDomain: "adamas-protocol.firebaseapp.com",
  databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol",
  storageBucket: "adamas-protocol.firebasestorage.app",
  messagingSenderId: "207788425238",
  appId: "1:207788425238:web:025b8544f085dde60af537"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let userWallet = localStorage.getItem('adamas_user') || "0x000...0000";
let balance = 0;
let miningActive = false;
let currentStreak = 0;

// 2. DASHBOARD INITIALIZE
window.onload = () => {
    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    // CLOUD SYNC: Fetch User Data from Firebase
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            updateDisplay();
            calculateTrustScore(data);
        }
    });
};

function updateDisplay() {
    const balEl = document.getElementById('total-balance');
    const streakEl = document.getElementById('streak-info');
    if (balEl) balEl.innerText = balance.toFixed(4);
    if (streakEl) streakEl.innerText = `Current Streak: ${currentStreak} Days`;
}

// 🛡️ TRUST SCORE ENGINE (Anti-Scam Logic)
function calculateTrustScore(data) {
    let score = 0;
    
    // Logic: Points (20%), Streak (40%), Daily Activity (40%)
    if (data.balance > 5) score += 20;
    if (data.streak >= 1) score += 20;
    if (data.streak >= 7) score += 20; 
    
    const today = new Date().toDateString();
    if (data.lastClaim === today) score += 40; // Roz aane wala user sabse trustable

    const fill = document.getElementById('trust-fill');
    const status = document.getElementById('eligibility-status');
    
    if(fill) fill.style.width = score + "%";
    if(status) {
        status.innerText = score + "% SECURE";
        // Color coding for urgency
        if(score < 40) status.style.color = "#ff4444"; 
        else if(score < 80) status.style.color = "#ffaa00";
        else status.style.color = "#00ff88";
    }
}

// 3. DAILY CHECK-IN (STREAK SYSTEM)
window.claimDailyBonus = function() {
    const today = new Date().toDateString();

    database.ref('users/' + userWallet).once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        
        if (data.lastClaim === today) {
            alert("Protocol already synced for today!");
            return;
        }

        // Streak Calculation
        let newStreak = (data.streak || 0) + 1;
        let reward = 1 + (newStreak * 0.2); // Pehle din 1.2, dusre din 1.4...

        balance += reward;
        
        // Update Cloud Database
        database.ref('users/' + userWallet).update({
            balance: balance,
            streak: newStreak,
            lastClaim: today
        });

        alert(`Streak Day ${newStreak} Active! +${reward.toFixed(2)} ABP Added.`);
    });
};

// 4. MINING ENGINE (CLOUD SYNC EVERY 10 TICKS)
window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.querySelector('.btn-mine-start');

    if (miningActive) {
        btn.innerText = "MINING IN PROGRESS...";
        btn.style.borderColor = "#00ff88";
        mineLoop();
    } else {
        btn.innerText = "RESUME MINING";
        btn.style.borderColor = "var(--cyan)";
    }
};

function mineLoop() {
    if (!miningActive) return;

    balance += 0.000125;
    updateDisplay();

    // Firebase Auto-Save (Har 10 increments par ek baar cloud update)
    if (Math.floor(balance * 10000) % 10 === 0) {
        database.ref('users/' + userWallet).update({
            balance: balance
        });
    }

    setTimeout(mineLoop, 3000);
}
