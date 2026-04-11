/**
 * ADAMAS PROTOCOL - DASHBOARD CORE
 * Features: Firebase Sync, Streak Check-in, Amoy Data Fetch
 */

// 1. FIREBASE CONFIGURATION (Wahi jo aapne di thi)
const firebaseConfig = {
  apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
  authDomain: "adamas-protocol.firebaseapp.com",
  databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol",
  storageBucket: "adamas-protocol.firebasestorage.app",
  messagingSenderId: "207788425238",
  appId: "1:207788425238:web:025b8544f085dde60af537"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let userWallet = localStorage.getItem('adamas_user') || "0x000...0000";
let balance = 0;
let miningActive = false;
let currentStreak = 0;

// 2. DASHBOARD INITIALIZE
window.onload = () => {
    if (!userWallet || userWallet === "0x000...0000") {
        console.warn("Unauthorized access. Redirecting...");
        // window.location.href = "index.html"; // Production ke liye on kar dena
    }

    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    // FIREBASE SE DATA FETCH KARNA
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            updateDisplay();
            
            // Eligibility Logic Check
            checkEligibility(balance);
        }
    });
};

function updateDisplay() {
    const balEl = document.getElementById('total-balance');
    if (balEl) balEl.innerText = balance.toFixed(4);
}

function checkEligibility(bal) {
    const statusEl = document.getElementById('eligibility-status');
    if (bal >= 10) {
        statusEl.innerText = "ELIGIBLE";
        statusEl.style.color = "#00ff88";
    } else {
        statusEl.innerText = "PENDING";
        statusEl.style.color = "#ffaa00";
    }
}

// 3. DAILY CHECK-IN LOGIC (STREAK SYSTEM)
window.claimDailyBonus = function() {
    const lastClaim = localStorage.getItem('last_claim_date');
    const today = new Date().toDateString();

    if (lastClaim === today) {
        alert("Daily Sync Complete. Come back tomorrow!");
        return;
    }

    // Reward Calculation (Streak based)
    let reward = 1 + (currentStreak * 0.5); // Har streak par 0.5 bonus
    balance += reward;
    currentStreak += 1;

    // Save to Firebase
    database.ref('users/' + userWallet).update({
        balance: balance,
        streak: currentStreak,
        lastClaim: today
    });

    localStorage.setItem('last_claim_date', today);
    alert(`Protocol Synced! Received ${reward} ABP`);
    updateDisplay();
};

// 4. MINING ENGINE (AUTO-SYNC TO CLOUD)
window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.querySelector('.btn-mine-start');

    if (miningActive) {
        btn.innerText = "MINING IN PROGRESS...";
        mineLoop();
    } else {
        btn.innerText = "RESUME MINING";
    }
};

function mineLoop() {
    if (!miningActive) return;

    balance += 0.000125;
    updateDisplay();

    // Firebase Sync every 10 seconds (Optimization)
    if (Math.floor(balance * 10000) % 5 === 0) {
        database.ref('users/' + userWallet).update({
            balance: balance
        });
    }

    setTimeout(mineLoop, 3000);
}
