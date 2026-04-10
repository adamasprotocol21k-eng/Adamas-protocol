// ADAMAS PROTOCOL - UI & Mining Engine (Final)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// PARTNER: Yahan apna Firebase config paste karein (Console se milega)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let userWallet = localStorage.getItem('adamas_user');
let currentABP = 0;

if (userWallet) {
    initUserStats();
}

// 1. User Data Fetch/Create
async function initUserStats() {
    const userRef = ref(db, 'users/' + userWallet);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        currentABP = snapshot.val().abp || 0;
    } else {
        // New User Initialization
        await set(userRef, {
            abp: 0,
            referrals: 0,
            lastActive: Date.now(),
            isVerified: false
        });
    }
    
    updateUI();
    startMining();
}

// 2. Mining Logic (ABP Engine)
function startMining() {
    setInterval(async () => {
        // 0.001 ABP per second (Aap ise change kar sakte hain)
        currentABP += 0.001; 
        updateUI();
        
        // Every 30 seconds, sync with Firebase to save data
        if (Math.floor(Date.now() / 1000) % 30 === 0) {
            syncWithDB();
        }
    }, 1000);
}

function updateUI() {
    const abpDisplay = document.getElementById('abpBalance');
    if (abpDisplay) {
        abpDisplay.innerText = currentABP.toFixed(4);
    }
}

async function syncWithDB() {
    const userRef = ref(db, 'users/' + userWallet);
    await update(userRef, {
        abp: currentABP,
        lastActive: Date.now()
    });
}

// Global Export for Games/Tasks
window.AdamasUI = { syncWithDB, currentABP };
