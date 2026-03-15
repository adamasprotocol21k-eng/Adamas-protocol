/* ADAMAS PROTOCOL - CORE ENGINE v1.0
   Handles: Firebase Sync, Web3 Connection, Global UI Updates
*/

// 1. DATABASE CONFIGURATION
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

// 2. GLOBAL STATE
window.userStats = {
    wallet: localStorage.getItem('adamas_wallet') || null,
    balance: parseFloat(localStorage.getItem('adamas_balance')) || 0,
    isConnected: false
};

// 3. CORE FUNCTIONS
// Firebase se data save karna
window.saveData = function() {
    if (window.userStats.wallet) {
        localStorage.setItem('adamas_balance', window.userStats.balance);
        db.ref('users/' + window.userStats.wallet).update({
            balance: window.userStats.balance,
            wallet: window.userStats.wallet,
            lastSeen: Date.now()
        });
    }
};

// Saare pages par balance aur wallet update karna
window.syncUI = function() {
    const balElements = document.querySelectorAll('#balance, #walletBalance, #headerBalance');
    balElements.forEach(el => {
        el.innerText = Math.floor(window.userStats.balance).toLocaleString();
    });

    const walletElements = document.querySelectorAll('#walletAddr, #walletBadge');
    walletElements.forEach(el => {
        if (window.userStats.wallet) {
            el.innerText = window.userStats.wallet.substring(0, 6) + "..." + window.userStats.wallet.slice(-4);
        } else {
            el.innerText = "Connect Wallet";
        }
    });
};

// Firebase se live data sun-na (Real-time Sync)
window.initLiveSync = function() {
    if (window.userStats.wallet) {
        db.ref('users/' + window.userStats.wallet).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                window.userStats.balance = data.balance || 0;
                window.syncUI();
            }
        });
    }
};

// Universal Notification
window.notify = function(msg, type = "success") {
    const toast = document.createElement('div');
    toast.style = `position:fixed; top:20px; left:50%; transform:translateX(-50%); 
                   background:${type === 'success' ? '#00ff88' : '#ff4d4d'}; color:#000; 
                   padding:12px 25px; border-radius:12px; z-index:999999; font-weight:bold; 
                   box-shadow:0 10px 30px rgba(0,0,0,0.5);`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => toast.remove(), 3000);
};

// Initial Boot
window.initLiveSync();
window.syncUI();
setInterval(window.syncUI, 1500); // Fail-safe UI sync
