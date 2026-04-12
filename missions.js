/**
 * ADAMAS PROTOCOL - MISSION COMMAND (V9.0 - GAMING HUB)
 * Status: Optimized for Performance & Real-time Rewards
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const ADMIN_WALLET = "0xC9267828a11dB4cb32f0A5Ea5FC29b38FF0fF25e";
let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let userBalance = 0;
let missionProgress = {};

// --- GAME STATES ---
let mineActive = false;
let mineMultiplier = 1.0;
let bombs = [];

// 1. OFFICIAL MISSION LIST
const priorityMissions = [
    { id: 'OFFICIAL_TG_COMM', title: 'Join ADS Community', reward: 15, link: 'https://t.me/adsprotocolcommunity' },
    { id: 'OFFICIAL_TG_CHAN', title: 'Join ADS Official', reward: 10, link: 'https://t.me/ADSProtocol' },
    { id: 'OFFICIAL_X_DIAMO', title: 'Follow Diamo Protocol', reward: 20, link: 'https://x.com/DiamoProtocol' },
    { id: 'OFFICIAL_X_ADAMAS', title: 'Follow Adamas ADS', reward: 20, link: 'https://x.com/AdamasADS' }
];

// 2. INITIALIZE
window.onload = () => {
    if(userWallet === "0xADAMAS_GUEST_USER") return window.location.href = "index.html";

    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            userBalance = data.balance || 0;
            missionProgress = data.missionProgress || {};
            
            document.getElementById('header-balance').innerText = formatBalance(userBalance) + " ABP";
            document.getElementById('active-multiplier').innerText = (data.currentMultiplier || 1.0).toFixed(1) + "x";
        }
    });

    initMinesGrid();
};

function formatBalance(num) {
    return num >= 1000000 ? (num/1000000).toFixed(2) + "M" : num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// 💎 --- DIAMOND HUNT (MINES) LOGIC --- 💎
function initMinesGrid() {
    const grid = document.getElementById('mines-grid');
    if(!grid) return;
    grid.innerHTML = '';
    bombs = [];
    
    // Set 3 Random Bombs in 25 tiles
    while(bombs.length < 3) {
        let r = Math.floor(Math.random() * 25);
        if(!bombs.includes(r)) bombs.push(r);
    }

    for(let i=0; i<25; i++) {
        const tile = document.createElement('div');
        tile.className = 'mine-tile';
        tile.innerHTML = '?';
        tile.onclick = () => revealMine(i, tile);
        grid.appendChild(tile);
    }
}

window.startMines = function() {
    if(userBalance < 100) return alert("Min. 100 ABP required to start!");
    if(mineActive) return;
    
    userBalance -= 100;
    database.ref(`users/${userWallet}`).update({ balance: userBalance });
    
    mineActive = true;
    mineMultiplier = 1.0;
    document.getElementById('mine-start-btn').style.display = 'none';
    document.getElementById('mine-cashout-btn').style.display = 'block';
    document.getElementById('mine-multiplier').innerText = "NEXT: 1.25x";
    initMinesGrid();
};

function revealMine(id, el) {
    if(!mineActive || el.classList.contains('revealed')) return;

    el.classList.add('revealed');
    if(bombs.includes(id)) {
        el.innerHTML = '💣';
        el.classList.add('bomb');
        alert("SYSTEM ERROR: Bomb detected! 100 ABP Lost.");
        endMinesGame(false);
    } else {
        el.innerHTML = '💎';
        el.classList.add('win');
        mineMultiplier += 0.25;
        document.getElementById('mine-multiplier').innerText = `NEXT: ${mineMultiplier.toFixed(2)}x`;
    }
}

window.cashoutMines = function() {
    if(!mineActive) return;
    let winAmount = 100 * mineMultiplier;
    userBalance += winAmount;
    database.ref(`users/${userWallet}`).update({ balance: userBalance });
    alert(`MISSION SUCCESS! Mined ${winAmount.toFixed(0)} ABP.`);
    endMinesGame(true);
};

function endMinesGame(isWin) {
    mineActive = false;
    document.getElementById('mine-start-btn').style.display = 'block';
    document.getElementById('mine-cashout-btn').style.display = 'none';
    document.getElementById('mine-multiplier').innerText = `BET: 100 ABP`;
}

// 🐔 --- CHICKEN ROAD (CRASH) --- 🐔
window.startChickenRun = function() {
    if(userBalance < 50) return alert("Need 50 ABP to start!");
    
    // Quick RNG for Chicken
    let winChance = Math.random();
    let reward = 0;
    let msg = "";

    if(winChance > 0.4) {
        reward = 25; // Net profit
        msg = "SUCCESS! You crossed the lane. +25 ABP Reward.";
    } else {
        reward = -50; // Loss
        msg = "CRITICAL FAILURE: Collision detected! -50 ABP.";
    }

    userBalance += reward;
    database.ref(`users/${userWallet}`).update({ balance: userBalance });
    alert(msg);
};

// --- MISSION LOGIC ---
window.toggleMissionList = () => {
    const term = document.getElementById('mission-terminal');
    term.style.display = term.style.display === 'flex' ? 'none' : 'flex';
    if(term.style.display === 'flex') renderMissions();
};

function renderMissions() {
    const container = document.getElementById('mission-list-container');
    let html = "";
    priorityMissions.forEach(m => {
        const isDone = missionProgress[m.id];
        html += `
            <div class="task-card" style="border-left: 2px solid ${isDone ? 'var(--neon-green)' : 'var(--cyan)'};">
                <div>
                    <span style="font-size: 13px; font-weight: bold;">${m.title}</span><br>
                    <small style="color: var(--cyan);">+${m.reward} ABP Reward</small>
                </div>
                <button onclick="executeMission('${m.id}', '${m.link}', ${m.reward})" 
                        style="background: ${isDone ? 'rgba(0,255,136,0.1)' : 'var(--cyan)'}; 
                               color: ${isDone ? 'var(--neon-green)' : '#000'}; 
                               border: none; padding: 8px 15px; border-radius: 5px; font-size: 10px; font-weight: bold;">
                    ${isDone ? 'COMPLETED' : 'EXECUTE'}
                </button>
            </div>`;
    });
    container.innerHTML = html;
}

window.executeMission = function(mid, link, reward) {
    if(missionProgress[mid]) return;
    window.open(link, '_blank');
    
    // Simulate Verification
    setTimeout(() => {
        missionProgress[mid] = true;
        database.ref(`users/${userWallet}`).update({
            balance: userBalance + reward,
            missionProgress: missionProgress
        });
        alert("PROTOCOL VERIFIED: Reward credited.");
        renderMissions();
    }, 3000);
};
