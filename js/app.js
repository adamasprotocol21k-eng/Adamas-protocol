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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// ADAMAS PROTOCOL - MASTER LOGIC (app.js)
// ==========================================

let userWallet = null;
let userData = {
    name: "",
    email: "",
    abp_balance: 0,
    rank: "N/A",
    eligible: false
};

// 1. Initial Load & Persistence
window.addEventListener('DOMContentLoaded', async () => {
    const savedWallet = localStorage.getItem('userWallet');
    if (savedWallet) {
        userWallet = savedWallet;
        await fetchUserData(userWallet);
    }
});

// 2. Connect Wallet Function
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userWallet = accounts[0];
            localStorage.setItem('userWallet', userWallet);
            
            // Firebase Sync
            await fetchUserData(userWallet);
            
            // Redirect to dashboard if on landing page
            if(window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// 3. Fetch/Create User in Firebase
async function fetchUserData(wallet) {
    const userRef = db.collection("users").doc(wallet);
    const doc = await userRef.get();

    if (!doc.exists()) {
        // Naya User: Form dikhao Name/Email ke liye
        showProfilePopup(); 
    } else {
        userData = doc.data();
        updateGlobalUI();
    }
}

// 4. Update Global UI (Balance, Rank, Ticks)
function updateGlobalUI() {
    // Update Balance Pill (Top Right)
    const balanceElements = document.querySelectorAll('.abp-balance-display');
    balanceElements.forEach(el => {
        animateBalance(el, parseInt(el.innerText) || 0, userData.abp_balance);
    });

    // Update Rank
    const rankEl = document.getElementById('user-rank-display');
    if(rankEl) rankEl.innerText = `#${userData.rank}`;

    // Update Eligibility Ticks
    updateTicks();
}

// 5. Balance Animation (Smooth Counting)
function animateBalance(obj, start, end) {
    let duration = 1000;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 6. Update ABP Points (For Games/Tasks)
async function updateABP(amount, type) {
    if(!userWallet) return;
    
    const userRef = db.collection("users").doc(userWallet);
    if(type === 'plus') {
        userData.abp_balance += amount;
    } else {
        userData.abp_balance -= amount;
    }
    
    await userRef.update({ abp_balance: userData.abp_balance });
    updateGlobalUI();
}
