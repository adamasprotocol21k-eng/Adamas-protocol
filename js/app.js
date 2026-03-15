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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- GLOBAL USER STATE ---
let userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "0xGuest",
    balance: 0,
    referralCount: 0,
    referralEarnings: 0
};

// --- DATA SYNC FUNCTIONS ---
function saveToFirebase() {
    if (userStats.wallet !== "0xGuest") {
        db.ref('users/' + userStats.wallet).set(userStats);
    }
}

function loadUserData() {
    const wallet = localStorage.getItem('adamas_wallet');
    if (wallet) {
        db.ref('users/' + wallet).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                userStats = data;
                updateUI();
            }
        });
    }
}

// --- UI UPDATER ---
function updateUI() {
    const balEl = document.getElementById('balance') || document.getElementById('walletBalance');
    if (balEl) balEl.innerText = Math.floor(userStats.balance);
    
    const walletEl = document.getElementById('userWalletAddr');
    if (walletEl) walletEl.innerText = userStats.wallet;
}

// --- NOTIFICATION SYSTEM ---
function showNotification(msg) {
    const div = document.createElement('div');
    div.style = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#F3BA2F; color:#000; padding:10px 20px; border-radius:10px; z-index:99999; font-weight:bold; font-size:0.8rem;";
    div.innerText = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Auto-load on script start
loadUserData();
