/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (V11.6 - CRASH RECOVERY)
 */

const firebaseConfig = {
  apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
  authDomain: "adamas-protocol-v2.firebaseapp.com",
  databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol-v2",
  storageBucket: "adamas-protocol-v2.firebasestorage.app",
  messagingSenderId: "197711342782",
  appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef",
  measurementId: "G-FKP19J67TT"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const ADMIN_WALLET = "0xC9267828a11dB4cb32f0A5Ea5FC29b38FF0fF25e"; 
const GENESIS_SUPPLY = 21000; 
let userWallet = localStorage.getItem('adamas_user');
let balance = 0;
let miningActive = false;
let currentStreak = 0;
let l1Count = 0;
let currentMultiplier = 1.0;

window.onload = () => {
    if(!userWallet) { 
        window.location.href = "index.html"; 
        return; 
    }

    // 1. Wallet Display Fix
    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    // 2. Referral Link Generation
    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html');
    const refInput = document.getElementById('ref-link-input');
    if (refInput) refInput.value = `${baseUrl}?ref=${userWallet}`;

    // 3. START REAL-TIME SYNC
    startDataSync();
};

function startDataSync() {
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            currentMultiplier = data.currentMultiplier || 1.0;
            
            // UI Updates
            updateDisplay();
            updateScarcityMeter(balance);
            loadNetworkStats(data);
            
            // Trust Score
            const fill = document.getElementById('trust-fill');
            if(fill) fill.style.width = "100%"; 
        }
    }, (error) => {
        console.error("Firebase Error:", error);
    });
}

function updateDisplay() {
    const balEl = document.getElementById('total-balance');
    const streakDash = document.getElementById('streak-info-dash');
    if (balEl) balEl.innerText = formatBalance(balance);
    if (streakDash) streakDash.innerText = `${currentStreak} DAYS`;
}

function formatBalance(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(3) + " M"; 
    return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function loadNetworkStats(userData) {
    database.ref('users/' + userWallet + '/myReferrals').on('value', (snapshot) => {
        const l1Data = snapshot.val();
        l1Count = l1Data ? Object.keys(l1Data).length : 0;
        
        const refEl = document.getElementById('ref-count');
        if(refEl) refEl.innerText = l1Count;

        // 🔥 RANK UPDATE (Sahi logic ke saath)
        updateRankUI(l1Count, balance);
    });
}

function updateRankUI(refs, bal) {
    const tierName = document.getElementById('elite-tier-name');
    const tierFill = document.getElementById('tier-progress-fill');
    if(!tierName || !tierFill) return;

    if (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
        tierName.innerText = "DIAMOND FOUNDER";
        tierFill.style.width = "100%";
    } else if (refs >= 2 || bal >= 1000) {
        tierName.innerText = "SILVER NODE";
        tierName.style.color = "#00f2ff";
        tierFill.style.width = "65%";
    } else {
        tierName.innerText = "BRONZE NODE";
        tierFill.style.width = "30%";
    }
}

function updateScarcityMeter(bal) {
    let percent = (bal / GENESIS_SUPPLY) * 100;
    const fill = document.getElementById('scarcity-fill');
    const txt = document.getElementById('scarcity-percent');
    if (fill) fill.style.width = Math.min(percent, 100) + "%";
    if (txt) txt.innerText = Math.min(percent, 100).toFixed(2) + "%";
}

// Global functions for buttons
window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.getElementById('mining-btn');
    if(btn) btn.innerText = miningActive ? "MINING ACTIVE" : "INITIALIZE MINING";
    if (miningActive) mineLoop();
};

function mineLoop() {
    if (!miningActive) return;
    let step = (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) ? 0.005 : (0.000025 * currentMultiplier); 
    balance += step;
    updateDisplay();
    if (Math.random() > 0.95) database.ref('users/' + userWallet).update({ balance: balance });
    setTimeout(mineLoop, 3000);
}

window.claimDailyBonus = function() {
    const today = new Date().toDateString();
    database.ref('users/' + userWallet).once('value').then((s) => {
        const d = s.val() || {};
        if (d.lastClaim === today) return alert("Already Synced Today!");
        let nStreak = (d.streak || 0) + 1;
        database.ref('users/' + userWallet).update({ 
            balance: (d.balance || 0) + 5, 
            streak: nStreak, 
            lastClaim: today 
        });
        alert("Sync Complete!");
    });
};
