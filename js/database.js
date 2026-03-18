/**
 * ADAMAS PROTOCOL - Firebase Realtime Engine (ULTIMATE FIX)
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
    // 1. Profile Creation (SABSE ZAROORI)
    async createProfile(address) {
        if(!address) return;
        const cleanAddress = address.trim(); // No lowercase here to match localStorage
        const userRef = ref(db, 'users/' + cleanAddress);
        
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            // New user initial data
            await set(userRef, {
                wallet: cleanAddress,
                balance: 500, // Welcome Bonus
                staked: 0,
                streak: 0,
                lastClaim: 0,
                energy: 100,
                referrals: 0,
                timestamp: Date.now()
            });
            console.log("New Profile Created for:", cleanAddress);
        }
    },

    // 2. Real-time Listener (FIXED)
    listenToProfile(address, callback) {
        if(!address) return;
        const cleanAddress = address.trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        
        return onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                callback(data);
            } else {
                console.warn("No data found for wallet:", cleanAddress);
            }
        }, (error) => {
            console.error("Firebase Error:", error);
        });
    },

    // 3. Balance Updater
    async updateBalance(address, amount) {
        const cleanAddress = address.trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        try {
            await update(userRef, { balance: increment(amount) });
            return true;
        } catch (e) {
            console.error("Balance Update Failed:", e);
            return false;
        }
    },

    // 4. Staked Updater
    async updateStaked(address, amount) {
        const cleanAddress = address.trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        await update(userRef, { staked: increment(amount) });
    },

    // 5. Streak Updater
    async updateStreak(address, newStreak) {
        const cleanAddress = address.trim();
        const userRef = ref(db, 'users/' + cleanAddress);
        await update(userRef, { 
            streak: newStreak,
            lastClaim: Date.now()
        });
    }
};

// Global export for non-module scripts
window.DBModule = DBModule;
export { DBModule };
