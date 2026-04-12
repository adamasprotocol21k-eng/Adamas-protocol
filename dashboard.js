/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (V8 - TRANSPARENT FOUNDER EDITION)
 * Final Fix: Organic Data, Clean Formatting, and Founder Authority.
 */

// 1. FIREBASE INITIALIZE
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- FOUNDER CONFIG ---
const ADMIN_WALLET = "0xC9267828a11dB4cb32f0A5Ea5FC29b38FF0fF25e"; 
let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let balance = 0;
let miningActive = false;
let currentStreak = 0;
let myReferrer = "DIRECT";
let l1Count = 0;
let currentMultiplier = 1.0;

// 2. DASHBOARD INITIALIZE
window.onload = () => {
    if(userWallet === "0xADAMAS_GUEST_USER") {
        window.location.href = "index.html";
        return;
    }

    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html');
    const refInput = document.getElementById('ref-link-input');
    if (refInput) refInput.value = `${baseUrl}?ref=${userWallet}`;

    // DATA SYNC
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            myReferrer = data.referredBy || "DIRECT";
            currentMultiplier = data.currentMultiplier || 1.0;
            
            updateDisplay();
            calculateTrustScore(data);
            loadNetworkStats();
            calculateEliteTier(balance, currentStreak, l1Count, data.role);
        }
    });

    initLeaderboard();
};

// 💎 CLEAN FORMATTING (Organic Look)
function formatBalance(num) {
    // 9,853,005.00 format with commas - No 'M' to keep it looking like raw technical data
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4 // Founders usually track precise decimals
    }).format(num);
}

function updateDisplay() {
    const balEl = document.getElementById('total-balance');
    const streakEl = document.getElementById('streak-info');
    if (balEl) balEl.innerText = formatBalance(balance);
    if (streakEl) streakEl.innerText = `Current Streak: ${currentStreak} Days`;
}

// 🛡️ TRUST SCORE ENGINE
function calculateTrustScore(data) {
    const isAdmin = userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase();
    let score = isAdmin ? 100 : 0; 

    if (!isAdmin) {
        if (data.balance > 0.01) score += 20;
        if (data.streak >= 1) score += 20;
        if (data.streak >= 5) score += 20;
        const today = new Date().toDateString();
        if (data.lastClaim === today) score += 40;
    }

    const fill = document.getElementById('trust-fill');
    const status = document.getElementById('eligibility-status');
    if(fill) fill.style.width = score + "%";
    if(status) {
        status.innerText = score + "% SECURE";
        status.style.color = score < 40 ? "#ff4444" : (score < 80 ? "#ffaa00" : "#00ff88");
        if(score === 100) status.style.textShadow = "0 0 10px #00ff88";
    }
}

// 🏆 ELITE TIER LOGIC (Founder Authority)
function calculateEliteTier(bal, streak, refs, role) {
    let tier = "BRONZE NODE";
    let color = "#cd7f32"; 
    let progress = 25;

    // ADMIN OVERRIDE - Real organic founder look
    if (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase() || role === "FOUNDER") {
        tier = "💎 DIAMOND FOUNDER";
        color = "#00f2ff"; 
        progress = 100;
    } else {
        if (bal >= 1000 || refs >= 3 || streak >= 7) { tier = "SILVER NODE"; color = "#c0c0c0"; progress = 50; }
        if (bal >= 10000 || refs >= 7 || streak >= 15) { tier = "GOLD NODE"; color = "#ffd700"; progress = 75; }
        if (bal >= 100000 || refs >= 15 || streak >= 30) { tier = "DIAMOND NODE"; color = "#00f2ff"; progress = 100; }
    }

    const tierEl = document.getElementById('elite-tier-name');
    const tierBar = document.getElementById('tier-progress-fill');
    
    if (tierEl) {
        tierEl.innerText = tier;
        tierEl.style.color = color;
    }
    if (tierBar) {
        tierBar.style.width = progress + "%";
        tierBar.style.backgroundColor = color;
        if(progress === 100) tierBar.style.boxShadow = "0 0 10px " + color;
    }
}

// 🔥 NETWORK STATS (Real Organic Data)
function loadNetworkStats() {
    database.ref('users/' + userWallet + '/myReferrals').on('value', (snapshot) => {
        const l1Data = snapshot.val();
        l1Count = l1Data ? Object.keys(l1Data).length : 0;
        document.getElementById('ref-count').innerText = l1Count;

        let l2Total = 0;
        if(l1Data) {
            Object.keys(l1Data).forEach(refKey => {
                database.ref('users/' + refKey + '/myReferrals').once('value', (l2Snap) => {
                    if(l2Snap.exists()) {
                        l2Total += Object.keys(l2Snap.val()).length;
                        document.getElementById('l2-count').innerText = l2Total;
                    }
                });
            });
        }
    });

    database.ref('users/' + userWallet + '/networkEarnings').on('value', (snap) => {
        const earnings = snap.val() || 0;
        const revEl = document.getElementById('net-revenue');
        if (revEl) revEl.innerText = formatBalance(earnings) + " ABP";
    });
}

// MINING ENGINE
window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.querySelector('.btn-mine-start');
    if(btn) {
        btn.innerText = miningActive ? "MINING ACTIVE" : "INITIALIZE MINING";
        btn.style.boxShadow = miningActive ? "0 0 20px var(--cyan)" : "none";
        if(userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
            btn.innerText = miningActive ? "FOUNDER OVERCLOCK ACTIVE" : "INITIALIZE MINING";
        }
    }
    if (miningActive) mineLoop();
};

function mineLoop() {
    if (!miningActive) return;
    // Organic speed for users, special stable testing speed for Admin
    const isAdmin = userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase();
    let mineStep = isAdmin ? 0.0005 : (0.000125 * currentMultiplier); 
    
    balance += mineStep;
    updateDisplay();

    // Auto-save every few ticks
    if (Math.floor(balance * 1000) % 5 === 0) {
        database.ref('users/' + userWallet).update({ balance: balance });
        if (myReferrer !== "DIRECT") {
            payUpline(myReferrer, mineStep * 0.10);
        }
    }
    setTimeout(mineLoop, 3000);
}

function payUpline(uplineAddr, amount) {
    database.ref('users/' + uplineAddr).transaction((user) => {
        if (user) {
            user.balance = (user.balance || 0) + amount;
            user.networkEarnings = (user.networkEarnings || 0) + amount;
        }
        return user;
    });
}

// LEADERBOARD (Real Global Stats)
function initLeaderboard() {
    database.ref('users').orderByChild('balance').limitToLast(10).on('value', (snapshot) => {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;
        let players = [];
        snapshot.forEach((child) => {
            players.push({ address: child.key, bal: child.val().balance || 0 });
        });
        players.sort((a, b) => b.bal - a.bal);
        listContainer.innerHTML = ""; 
        players.forEach((player, i) => {
            let badge = i === 0 ? "🥇" : (i === 1 ? "🥈" : (i === 2 ? "🥉" : `#${i+1}`));
            let isMe = player.address.toLowerCase() === userWallet.toLowerCase() ? "style='background: rgba(0,242,255,0.1); border-left: 2px solid var(--cyan);'" : "";
            listContainer.innerHTML += `<div class="leaderboard-row" ${isMe} style="display:flex; justify-content:space-between; padding:8px; margin-bottom:5px; border-radius:5px; font-size:12px;"><span>${badge} ${player.address.slice(0,6)}...</span><span style="color:var(--cyan);">${formatBalance(player.bal)}</span></div>`;
        });
    });
}

window.claimDailyBonus = function() {
    const today = new Date().toDateString();
    database.ref('users/' + userWallet).once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        if (data.lastClaim === today) return alert("System already synced!");
        let newStreak = (data.streak || 0) + 1;
        let reward = 1 + (newStreak * 0.1);
        database.ref('users/' + userWallet).update({ 
            balance: (data.balance || 0) + reward, 
            streak: newStreak, 
            lastClaim: today 
        });
        alert(`Success! +${reward.toFixed(2)} ABP. Streak: ${newStreak}`);
    });
};
