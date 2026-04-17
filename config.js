/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE 
   Core System v2.4 | DATA_INTEGRITY_STRICT_LOCK
*/

const firebaseConfig = {
    apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
    authDomain: "adamas-protocol-v2.firebaseapp.com",
    databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol-v2",
    appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const GENESIS_WALLET = "0xcc19036Ad18b761ad25D2cb69Fd3c5EbcB766488".toLowerCase();

// --- SESSION LOCK ---
// Wallet ko hamesha lowercase mein read karna taaki duplicate ID na bane
const getSecureUser = () => {
    const raw = localStorage.getItem('adamas_user');
    return raw ? raw.toLowerCase().trim() : null;
};

let currentUser = getSecureUser();

// --- ROUTE GUARDIAN ---
function protectRoute() {
    const path = window.location.pathname;
    // Agar login nahi hai aur index ke bahar hai, toh seedha landing page
    if (!getSecureUser() && !path.includes('index.html')) {
        window.location.href = "index.html";
    }
}

// --- SYSTEM LOGOUT (Add this to your Disconnect Button) ---
function terminalLogout() {
    localStorage.clear(); // Pura clean sweep
    window.location.href = "index.html";
}

// --- GENESIS SYNC ENGINE ---
async function syncUserSession() {
    const wallet = getSecureUser();
    if (!wallet) return;
    
    const userRef = db.ref('users/' + wallet);
    
    try {
        const snap = await userRef.once('value');
        
        if (!snap.exists()) {
            // NEW USER REGISTRATION
            console.log("PROTOCOL_ALERT: Creating New Node...");
            const assignedRef = localStorage.getItem('adamas_ref') || GENESIS_WALLET;

            await userRef.set({
                balance: 800,
                streak: 1,
                referredBy: assignedRef,
                lastActive: Date.now(),
                joinedAt: Date.now(),
                quizDone: false,
                role: "MEMBER",
                wallet: wallet // Storing for Ranking consistency
            });
            
            // Increment Referral Network
            db.ref('users/' + assignedRef + '/referralCount').transaction(c => (c || 0) + 1);
        } else {
            // EXISTING USER - ONLY UPDATE HEARTBEAT
            console.log("PROTOCOL_ALERT: Node Synced. Balance Protected.");
            userRef.update({ 
                lastActive: Date.now() 
            });
        }
    } catch (err) {
        console.error("Sync Error:", err);
    }
}

// Global Execution
protectRoute();
if (getSecureUser()) {
    syncUserSession();
}

// Listening for storage changes (Logout prevention across tabs)
window.addEventListener('storage', () => {
    if (!getSecureUser()) window.location.href = "index.html";
});
