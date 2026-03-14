// app.js के शुरुआत में यह जोड़ें
const auth = firebase.auth();

// इस फंक्शन को अपडेट करें ताकि Google UID से डेटा लोड हो
async function loadUserData() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.ref('users/' + user.uid).on('value', (snapshot) => {
                if (snapshot.exists()) {
                    userStats = snapshot.val();
                    updateUI();
                } else {
                    // Create new user profile
                    db.ref('users/' + user.uid).set({
                        balance: 0,
                        realName: "",
                        email: user.email,
                        wallet: localStorage.getItem('adamas_wallet') || "0x..."
                    });
                }
            });
        }
    });
}

// --- FIREBASE CONFIGURATION ---
// (अपनी Firebase Console वाली Keys यहाँ पेस्ट करें)
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

let userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "",
    realName: localStorage.getItem('adamas_real_name') || "",
    balance: 0,
    stakedAmount: 0,
    referralCount: 0,
    isSocialVerified: false
};

// --- REAL-TIME SYNC ENGINE ---
async function loadUserData(wallet) {
    if (!wallet) return;
    userStats.wallet = wallet;
    
    // Listen for Real-time balance changes
    db.ref('users/' + wallet).on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            userStats.balance = data.balance || 0;
            userStats.realName = data.realName || "";
            userStats.stakedAmount = data.stakedAmount || 0;
            updateUI(); // Automatically updates all screens
        } else {
            db.ref('users/' + wallet).set(userStats);
        }
    });
}

function saveToFirebase() {
    if (userStats.wallet) {
        db.ref('users/' + userStats.wallet).update({
            balance: userStats.balance,
            realName: userStats.realName,
            stakedAmount: userStats.stakedAmount,
            isSocialVerified: userStats.isSocialVerified
        });
    }
}

function updateUI() {
    const balEl = document.querySelectorAll('#balance');
    balEl.forEach(el => el.innerText = Math.floor(userStats.balance));
    
    const wallBadge = document.getElementById('walletBadge');
    if(wallBadge && userStats.wallet) {
        wallBadge.innerText = userStats.wallet.substring(0, 6) + "..." + userStats.wallet.slice(-4);
    }
}

function showNotification(text) {
    const n = document.createElement('div');
    n.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#F3BA2F;color:#000;padding:12px 20px;border-radius:50px;font-weight:bold;z-index:100000;box-shadow:0 5px 15px rgba(0,0,0,0.5);";
    n.innerText = "💎 " + text;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// Global initialization
if(userStats.wallet) loadUserData(userStats.wallet);
