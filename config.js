/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE 
   Core System v2.3 | DATA_INTEGRITY_PROTECTION
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

const GENESIS_WALLET = "0xcc19036Ad18b761ad25D2cb69Fd3c5EbcB766488".toLowerCase();

// --- IDENTITY FIX: Hamesha lowercase check karega ---
const rawUser = localStorage.getItem('adamas_user');
const currentUser = rawUser ? rawUser.toLowerCase() : null;

function protectRoute() {
    const path = window.location.pathname;
    if (!currentUser && !path.includes('index.html')) {
        window.location.href = "index.html";
    }
}

function getReferrer() {
    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref')?.toLowerCase();
    if (!ref || ref === 'genesis' || ref === currentUser) {
        return GENESIS_WALLET;
    }
    return ref;
}

// Session sync logic jo "Naya Account" tabhi banayega jab sach mein naya ho
async function syncUserSession() {
    if (!currentUser) return;
    
    const userRef = db.ref('users/' + currentUser);
    const snap = await userRef.once('value');
    
    // YAHAN FIX HAI: Snap exists check
    if (!snap.exists()) {
        console.log("CREATING_NEW_NODE_ENTRY...");
        const assignedRef = localStorage.getItem('adamas_ref') || GENESIS_WALLET;

        await userRef.set({
            balance: 800, // Initial Bonus
            streak: 1,
            referredBy: assignedRef,
            lastActive: Date.now(),
            joinedAt: Date.now(),
            quizDone: false,
            role: "MEMBER"
        });
        
        const refCounter = db.ref('users/' + assignedRef + '/referralCount');
        refCounter.transaction((c) => (c || 0) + 1);
    } else {
        console.log("NODE_RECOGNIZED: Fetching existing data...");
        // Sirf last active update karo, balance ko touch mat karo
        userRef.update({ lastActive: Date.now() });
    }
}

protectRoute();
if(currentUser) syncUserSession();
