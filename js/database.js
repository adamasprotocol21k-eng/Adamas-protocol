/**
 * ADAMAS PROTOCOL - Firebase Realtime Engine (META-SYNC VERSION)
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DBModule = {
    // 1. Profile Creation with MetaMask Address
    async createProfile(address) {
        if(!address) return;
        const cleanAddress = address.toLowerCase().trim(); 
        const userRef = ref(db, 'users/' + cleanAddress);
        
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            await set(userRef, {
                wallet: cleanAddress,
                balance: 500, 
                staked: 0,
                streak: 0,
                lastClaim: 0,
                energy: 100,
                referrals: 0,
                timestamp: Date.now()
            });
            console.log("MetaMask Profile Synchronized:", cleanAddress);
        }
    },

    // 2. Real-time Dashboard Sync
    listenToProfile(address, callback) {
        if(!address) return;
        const cleanAddress = address.toLowerCase().trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        
        return onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                callback(data);
            }
        }, (error) => {
            console.error("Blockchain Sync Error:", error);
        });
    },

    // 3. Asset Updater
    async updateBalance(address, amount) {
        if(!address) return;
        const cleanAddress = address.toLowerCase().trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        try {
            await update(userRef, { balance: increment(amount) });
            return true;
        } catch (e) {
            return false;
        }
    },

    // 4. Staking Logic
    async updateStaked(address, amount) {
        const cleanAddress = address.toLowerCase().trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        await update(userRef, { staked: increment(amount) });
    },

    // 5. Daily Streak Logic
    async updateStreak(address, newStreak) {
        const cleanAddress = address.toLowerCase().trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        await update(userRef, { 
            streak: newStreak,
            lastClaim: Date.now()
        });
    }
};

window.DBModule = DBModule;
export { DBModule };
