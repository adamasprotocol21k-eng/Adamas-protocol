// --- ADAMAS PROTOCOL GLOBAL ENGINE ---
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Global User Object
window.userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "0xGuest",
    balance: parseFloat(localStorage.getItem('adamas_balance')) || 0,
    referralCount: 0
};

// --- 1. REAL-TIME DATA SYNC ---
function saveToFirebase() {
    if (window.userStats.wallet !== "0xGuest") {
        // Local Save (Immediate)
        localStorage.setItem('adamas_balance', window.userStats.balance);
        
        // Firebase Save (Permanent)
        db.ref('users/' + window.userStats.wallet).update({
            balance: window.userStats.balance,
            lastUpdate: Date.now()
        }).catch(err => console.error("Firebase Error:", err));
    }
}

function listenToUpdates() {
    if (window.userStats.wallet !== "0xGuest") {
        db.ref('users/' + window.userStats.wallet).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                window.userStats.balance = data.balance || 0;
                localStorage.setItem('adamas_balance', window.userStats.balance);
                updateAllUI();
            }
        });
    }
}

// --- 2. UNIVERSAL UI UPDATER ---
function updateAllUI() {
    const balanceElements = document.querySelectorAll('#balance, #walletBalance, #headerBalance');
    balanceElements.forEach(el => {
        el.innerText = Math.floor(window.userStats.balance);
    });

    const walletBadges = document.querySelectorAll('#walletBadge, #userWalletAddr');
    walletBadges.forEach(el => {
        if(window.userStats.wallet !== "0xGuest") {
            el.innerText = window.userStats.wallet.substring(0, 6) + "..." + window.userStats.wallet.slice(-4);
        }
    });
}

// --- 3. NOTIFICATION SYSTEM ---
function showNotification(msg) {
    const existing = document.querySelector('.adamas-alert');
    if(existing) existing.remove();

    const n = document.createElement('div');
    n.className = 'adamas-alert';
    n.style = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#F3BA2F;color:#000;padding:12px 25px;border-radius:12px;z-index:999999;font-weight:bold;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid #fff; animation: slideIn 0.3s ease-out;";
    n.innerText = msg;
    document.body.appendChild(n);
    
    if(navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => { n.style.opacity = '0'; setTimeout(()=>n.remove(), 500); }, 3000);
}

// Boot up
listenToUpdates();
updateAllUI();
setInterval(updateAllUI, 1000); // Fail-safe sync
