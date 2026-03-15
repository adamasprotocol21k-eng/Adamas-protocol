// ADAMAS PROTOCOL - FULL SYSTEM ENGINE
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

window.userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "0xGuest",
    balance: parseFloat(localStorage.getItem('adamas_balance')) || 0
};

// Global Sync Function
window.saveToFirebase = function() {
    if (window.userStats.wallet !== "0xGuest") {
        localStorage.setItem('adamas_balance', window.userStats.balance);
        db.ref('users/' + window.userStats.wallet).update({
            balance: window.userStats.balance,
            wallet: window.userStats.wallet,
            lastActive: Date.now()
        });
    }
};

// Global UI Updater
window.updateAllUI = function() {
    const balTags = document.querySelectorAll('#balance, #walletBalance, #headerBalance');
    balTags.forEach(el => el.innerText = Math.floor(window.userStats.balance));
    
    const wTags = document.querySelectorAll('#walletBadge, #userWalletAddr');
    wTags.forEach(el => {
        if(window.userStats.wallet !== "0xGuest") 
            el.innerText = window.userStats.wallet.substring(0,6) + "..." + window.userStats.wallet.slice(-4);
    });
};

// Listen for Database Changes
if (window.userStats.wallet !== "0xGuest") {
    db.ref('users/' + window.userStats.wallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            window.userStats.balance = data.balance || 0;
            window.updateAllUI();
        }
    });
}

window.showNotification = function(msg) {
    const n = document.createElement('div');
    n.style = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#F3BA2F;color:#000;padding:12px 25px;border-radius:12px;z-index:1000000;font-weight:bold;box-shadow:0 10px 30px rgba(0,0,0,0.5);";
    n.innerText = msg;
    document.body.appendChild(n);
    if(navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => n.remove(), 3000);
};

setInterval(window.updateAllUI, 1000);
