/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE
   This file connects all modules to the Firebase Realtime Database.
*/

// Your Web App's Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
    authDomain: "adamas-protocol-v2.firebaseapp.com",
    databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol-v2",
    appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global Database Variable
const db = firebase.database();

// Global Formatting Tool (K, M, B)
function formatCurrency(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return parseFloat(num).toFixed(2);
}

// Global Wallet Checker
const currentUser = localStorage.getItem('adamas_user');

// Global Session Protection
function protectRoute() {
    if (!currentUser && !window.location.href.includes('index.html')) {
        window.location.href = "index.html";
    }
}

// System Logs
console.log("ADAMAS_PROTOCOL: Connection Established.");

