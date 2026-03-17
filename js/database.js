/**
 * ADAMAS PROTOCOL - Firebase Realtime Engine (FIXED)
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
    async getUserData(address) {
        if(!address) return null;
        const userRef = ref(db, 'users/' + address.toLowerCase());
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : null;
    },

    async saveUser(address, data) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        await set(userRef, data);
    },

    // FIXED LISTENER: Added error handling and immediate trigger
    listenToProfile(address, callback) {
        if(!address) return;
        const userRef = ref(db, 'users/' + address.toLowerCase());
        return onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                callback(data);
            }
        }, (error) => {
            console.error("Firebase Listener Error:", error);
        });
    },

    async updateBalance(address, amount) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        try {
            await update(userRef, { balance: increment(amount) });
            return true;
        } catch (e) {
            return false;
        }
    },

    async updateEnergy(address, amount) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        await update(userRef, { energy: increment(amount) });
    }
};

window.DBModule = DBModule;
export { DBModule };
