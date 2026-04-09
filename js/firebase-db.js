import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. User ka data fetch karna (Login ke waqt)
export async function getUserData(walletAddress) {
    const userRef = doc(db, "users", walletAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        // Naya user hai toh entry create karein
        const newData = {
            wallet: walletAddress,
            abp_balance: 0,
            tasks: { twitter: true, telegram: true }, // Jo index se pass huye
            joinedAt: new Date()
        };
        await setDoc(userRef, newData);
        return newData;
    }
}

// 2. Points Update karna
export async function updateABP(walletAddress, newBalance) {
    const userRef = doc(db, "users", walletAddress);
    await updateDoc(userRef, {
        abp_balance: newBalance
    });
}

