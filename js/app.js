// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Global State
let userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "0xGuest",
    balance: parseInt(localStorage.getItem('adamas_balance')) || 0,
    referralCount: 0
};

// --- DATA SYNC ENGINE ---
function saveToFirebase() {
    if (userStats.wallet !== "0xGuest") {
        // Local storage update for instant UI feedback
        localStorage.setItem('adamas_balance', userStats.balance);
        
        // Firebase update
        db.ref('users/' + userStats.wallet).update({
            balance: userStats.balance,
            wallet: userStats.wallet
        });
    }
}

function loadUserData() {
    const wallet = localStorage.getItem('adamas_wallet');
    if (wallet && wallet !== "0xGuest") {
        db.ref('users/' + wallet).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                userStats.balance = data.balance || 0;
                localStorage.setItem('adamas_balance', userStats.balance);
                updateUI();
            }
        });
    }
}

function updateUI() {
    const balEl = document.getElementById('balance');
    const walletEl = document.getElementById('walletBadge');
    
    if (balEl) balEl.innerText = Math.floor(userStats.balance);
    if (walletEl) walletEl.innerText = userStats.wallet.substring(0, 6) + "...";
}

// Notification Helper
function showNotification(msg) {
    const n = document.createElement('div');
    n.style = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#F3BA2F;color:#000;padding:12px 20px;border-radius:10px;z-index:100000;font-weight:bold;box-shadow:0 0 20px rgba(0,0,0,0.5);";
    n.innerText = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// Auto Load
loadUserData();
setInterval(updateUI, 1000); // Check for updates every second
