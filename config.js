/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE 
   Core System v2.2.1 | GENESIS_ROOT_INTEGRATION
   Status: STABLE_PRODUCTION_READY
*/

const firebaseConfig = {
    apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
    authDomain: "adamas-protocol-v2.firebaseapp.com",
    databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol-v2",
    appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef"
};

// --- INITIALIZE FIREBASE ---
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// --- MASTER NODE IDENTITY ---
const GENESIS_WALLET = "0xcc19036Ad18b761ad25D2cb69Fd3c5EbcB766488";

// --- UTILITIES ---
function formatCurrency(num) {
    const val = parseFloat(num) || 0;
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toFixed(2);
}

// Session Identity
const currentUser = localStorage.getItem('adamas_user')?.toLowerCase() || null;

// --- ROUTE GUARDIAN ---
function protectRoute() {
    const path = window.location.pathname;
    // Agar user logged in nahi hai aur index par nahi hai, toh redirect
    if (!currentUser && !path.includes('index.html') && path !== '/' && !path.endsWith('.html')) {
        window.location.href = "index.html";
    }
}

// --- REFERRAL PROTOCOL ---
function getReferrer() {
    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref')?.toLowerCase();
    
    // Guard: Prevent self-referral or empty ref
    if (!ref || ref === 'genesis' || ref === currentUser) {
        return GENESIS_WALLET.toLowerCase();
    }
    return ref;
}

// Store Referrer permanently for the session before login
const activeReferrer = getReferrer();
if (activeReferrer && !localStorage.getItem('adamas_ref')) {
    localStorage.setItem('adamas_ref', activeReferrer);
}

// --- SESSION SYNC ENGINE ---
async function syncUserSession() {
    if (!currentUser) return;
    
    const userRef = db.ref('users/' + currentUser);
    const snap = await userRef.once('value');
    
    if (!snap.exists()) {
        console.log("INITIALIZING_NEW_NODE...");
        
        // Final fallback for referrer
        const assignedRef = localStorage.getItem('adamas_ref') || GENESIS_WALLET.toLowerCase();

        const newUserPayload = {
            balance: 0,
            streak: 1,
            referredBy: assignedRef,
            lastActive: Date.now(),
            joinedAt: Date.now(),
            quizDone: false,
            loyaltyClaimed: false,
            role: (currentUser === GENESIS_WALLET.toLowerCase()) ? "ADMIN" : "MEMBER"
        };

        await userRef.set(newUserPayload);
        
        // Update Referrer's network count (Atomic Transaction)
        if (assignedRef) {
            db.ref('users/' + assignedRef + '/referralCount').transaction((count) => {
                return (count || 0) + 1;
            });
        }
    } else {
        // Update Last Active Heartbeat
        userRef.update({ lastActive: Date.now() });
    }
}

// --- EXECUTE ---
protectRoute();
if (currentUser) {
    syncUserSession();
    console.log(`%c ADAMAS_PROTOCOL: Node ${currentUser === GENESIS_WALLET.toLowerCase() ? 'ADMIN' : 'ACTIVE'}`, 'color: #00f2ff; font-weight: bold;');
}
