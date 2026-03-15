// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ==========================================
// 2. MASTER LOGIC & WALLET CONNECTION
// ==========================================

// Page load hote hi initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("ADAMAS Protocol - System Ready");
    
    const connectBtn = document.getElementById('connectBtn');
    
    if (connectBtn) {
        // Direct Click Listener - Sabse fast trigger
        connectBtn.onclick = async function() {
            console.log("Connect Button Clicked!");
            await connectWallet();
        };
    }

    // Check if user is already logged in
    const savedWallet = localStorage.getItem('userWallet');
    if (savedWallet && window.location.pathname.includes('index.html')) {
        console.log("Wallet already connected:", savedWallet);
        // window.location.href = 'dashboard.html'; // Auto-login ke liye ise uncomment karein
    }
});

// The Main Connection Function
async function connectWallet() {
    console.log("Requesting MetaMask access...");

    // Check if window.ethereum exists (MetaMask/Web3 Browser)
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Requesting account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            if (walletAddress) {
                console.log("Successfully Connected:", walletAddress);
                
                // 1. Local Storage mein save karein
                localStorage.setItem('userWallet', walletAddress);

                // 2. Firebase mein user register/check karein
                await registerUserInFirebase(walletAddress);

                // 3. Success Alert and Redirect
                alert("Bhai! Wallet Connect Ho Gaya.\nAddress: " + walletAddress);
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error("User denied connection:", error);
            if (error.code === 4001) {
                alert("Bhai, aapne connection request cancel kar di.");
            } else {
                alert("Kuch error aaya hai. Console check karein.");
            }
        }
    } else {
        // Agar MetaMask nahi mila
        console.log("Ethereum Provider not found.");
        alert("Bhai! MetaMask nahi mila. Agar mobile par ho toh MetaMask Browser use karein.");
        
        // Mobile users ko seedha MetaMask App par bhejein
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
    }
}

// User data ko Firebase mein update karne ka function
async function registerUserInFirebase(wallet) {
    try {
        const userRef = db.collection("users").doc(wallet);
        const doc = await userRef.get();

        if (!doc.exists) {
            // Naya user hai toh basic data create karein
            await userRef.set({
                walletAddress: wallet,
                abp_balance: 100, // Welcome Bonus
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rank: "Novice"
            });
            console.log("New user registered in Database.");
        } else {
            console.log("Existing user logged in.");
        }
    } catch (e) {
        console.error("Firebase Error:", e);
    }
}
