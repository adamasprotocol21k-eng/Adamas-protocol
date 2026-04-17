/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE 
   Core System v2.2 | GENESIS_ROOT_INTEGRATION
*/

const firebaseConfig = {
    apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
    authDomain: "adamas-protocol-v2.firebaseapp.com",
    databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol-v2",
    appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// --- GENESIS CORE CONFIG ---
const GENESIS_WALLET = "0xcc19036Ad18b761ad25D2cb69Fd3c5EbcB766488"; // Company Master Node

// --- SYSTEM UTILITIES ---

function formatCurrency(num) {
    const val = parseFloat(num) || 0;
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toFixed(2);
}

// Global Wallet Checker
const currentUser = localStorage.getItem('adamas_user');

// Route Guardian
function protectRoute() {
    if (!currentUser && !window.location.pathname.includes('index.html')) {
        window.location.href = "index.html";
    }
}

// --- GENESIS REFERRAL ENGINE ---
function getReferrer() {
    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref');
    
    // Masking Logic: Agar ref khali hai ya 'GENESIS' hai, toh Admin wallet assign karo
    if (!ref || ref.toUpperCase() === 'GENESIS') {
        return GENESIS_WALLET.toLowerCase();
    }
    return ref.toLowerCase();
}

// Pehle Referrer save karein fir session sync karein
const activeReferrer = getReferrer();
if (!localStorage.getItem('adamas_ref')) {
    localStorage.setItem('adamas_ref', activeReferrer);
}

// --- AUTO-INITIALIZE ENGINE ---
async function syncUserSession() {
    if (!currentUser) return;
    
    const userRef = db.ref('users/' + currentUser.toLowerCase());
    const snap = await userRef.once('value');
    
    if (!snap.exists()) {
        console.log("INITIALIZING_NEW_GENESIS_NODE...");
        
        // Referrer fetch from storage
        const assignedRef = localStorage.getItem('adamas_ref') || GENESIS_WALLET.toLowerCase();

        await userRef.set({
            balance: 0,
            streak: 1,
            referredBy: assignedRef, // Automatically linked to Company or Inviter
            lastActive: Date.now(),
            joinedAt: Date.now(),
            quizDone: false,
            loyaltyClaimed: false,
            role: "MEMBER"
        });
        
        // Update Referrer's count
        const refCounter = db.ref('users/' + assignedRef + '/referralCount');
        refCounter.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });
    }
}

// Run Protection & Sync
protectRoute();
if(currentUser) syncUserSession();

console.log("ADAMAS_SYSTEM: Genesis Node Online. Role: " + (currentUser === GENESIS_WALLET.toLowerCase() ? "ADMIN" : "NODE"));
