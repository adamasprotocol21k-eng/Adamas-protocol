/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (V3 - NETWORK CHAIN SYSTEM)
 * Master Logic: User Mining + L1/L2 Distribution
 */

// 1. FIREBASE CONFIGURATION (Wahi Purani)
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Global Variables
let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let balance = 0;
let miningActive = false;
let currentStreak = 0;
let myReferrer = "DIRECT"; // Upline track karne ke liye

// 2. DASHBOARD INITIALIZE
window.onload = () => {
    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    // 🔥 NEW: Generate Referral Link for UI
    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html');
    const refInput = document.getElementById('ref-link-input');
    if (refInput) refInput.value = `${baseUrl}?ref=${userWallet}`;

    // CLOUD SYNC: Real-time fetch from V2 Database
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            myReferrer = data.referredBy || "DIRECT"; // Upline info
            
            updateDisplay();
            calculateTrustScore(data);
            loadNetworkStats(); // 🔥 Naya: L1/L2 data load karo
        }
    });
};

function updateDisplay() {
    const balEl = document.getElementById('total-balance');
    const streakEl = document.getElementById('streak-info');
    if (balEl) balEl.innerText = balance.toFixed(4);
    if (streakEl) streakEl.innerText = `Current Streak: ${currentStreak} Days`;
}

// 🛡️ TRUST SCORE ENGINE (Wahi Purana)
function calculateTrustScore(data) {
    let score = 0;
    if (data.balance > 0.01) score += 20;
    if (data.streak >= 1) score += 20;
    if (data.streak >= 5) score += 20;
    
    const today = new Date().toDateString();
    if (data.lastClaim === today) score += 40;

    const fill = document.getElementById('trust-fill');
    const status = document.getElementById('eligibility-status');
    
    if(fill) fill.style.width = score + "%";
    if(status) {
        status.innerText = score + "% SECURE";
        if(score < 40) status.style.color = "#ff4444"; 
        else if(score < 80) status.style.color = "#ffaa00";
        else status.style.color = "#00ff88";
    }
}

// 🔥 NEW: LOAD NETWORK STATS (L1 & L2)
function loadNetworkStats() {
    // Level 1 Fetch
    database.ref('users/' + userWallet + '/myReferrals').once('value', async (snapshot) => {
        const l1Data = snapshot.val();
        const l1Count = l1Data ? Object.keys(l1Data).length : 0;
        document.getElementById('ref-count').innerText = l1Count;

        // Chain List Update
        const chainList = document.getElementById('chain-list');
        if (chainList && l1Data) {
            chainList.innerHTML = Object.keys(l1Data).map(addr => 
                `<div style="margin-bottom:5px;">🔗 ${addr.slice(0,6)}...${addr.slice(-4)} <span style="color:var(--cyan); font-size:10px;">(L1)</span></div>`
            ).join('');
        }
    });

    // Level 2 & Revenue update ke liye hum simplified total revenue dikhayenge
    database.ref('users/' + userWallet + '/networkEarnings').on('value', (snap) => {
        const earnings = snap.val() || 0;
        const revEl = document.getElementById('net-revenue');
        if (revEl) revEl.innerText = earnings.toFixed(4) + " ABP";
    });
}

// 3. DAILY CHECK-IN
window.claimDailyBonus = function() {
    const today = new Date().toDateString();
    database.ref('users/' + userWallet).once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        if (data.lastClaim === today) {
            alert("Already Synced Today!");
            return;
        }
        let newStreak = (data.streak || 0) + 1;
        let reward = 1 + (newStreak * 0.2); 
        balance += reward;
        database.ref('users/' + userWallet).update({
            balance: balance,
            streak: newStreak,
            lastClaim: today
        });
        alert(`Protocol Synced! Streak: ${newStreak} Days.`);
    });
};

// 4. MINING ENGINE (AUTO-SYNC + REWARD DISTRIBUTION)
window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.querySelector('.btn-mine-start');
    if (miningActive) {
        btn.innerText = "MINING IN PROGRESS...";
        mineLoop();
    } else {
        btn.innerText = "INITIALIZE MINING";
    }
};

function mineLoop() {
    if (!miningActive) return;

    let mineStep = 0.000125;
    balance += mineStep;
    updateDisplay();

    // 🔥 NEW: Distribution Logic (Every 10 Ticks)
    if (Math.floor(balance * 10000) % 10 === 0) {
        // 1. Apni balance save karo
        database.ref('users/' + userWallet).update({ balance: balance });

        // 2. Referrer ko 10% bhejo (L1)
        if (myReferrer !== "DIRECT") {
            payUpline(myReferrer, mineStep * 0.10);

            // 3. Referrer ke Referrer ko 5% bhejo (L2)
            database.ref('users/' + myReferrer + '/referredBy').once('value', (snap) => {
                const l2Referrer = snap.val();
                if (l2Referrer && l2Referrer !== "DIRECT") {
                    payUpline(l2Referrer, mineStep * 0.05);
                }
            });
        }
    }

    setTimeout(mineLoop, 3000);
}

// Helper: Upline Payment Function
function payUpline(uplineAddr, amount) {
    const refRef = database.ref('users/' + uplineAddr);
    refRef.transaction((user) => {
        if (user) {
            user.balance = (user.balance || 0) + amount;
            user.networkEarnings = (user.networkEarnings || 0) + amount;
        }
        return user;
    });
}
