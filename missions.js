const firebaseConfig = {
  apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
  authDomain: "adamas-protocol-v2.firebaseapp.com",
  databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol-v2",
  storageBucket: "adamas-protocol-v2.firebasestorage.app",
  messagingSenderId: "197711342782",
  appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef",
  measurementId: "G-FKP19J67TT"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let userBalance = 0;
let userEnergy = 100;

// Data Load karein
window.onload = () => {
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            userBalance = data.balance || 0;
            document.getElementById('active-multiplier').innerText = (data.currentMultiplier || 1.0) + "x";
        }
    });
};

// Social Tasks Logic
window.startTask = function(taskId) {
    const statusEl = document.getElementById('status-' + taskId);
    if (statusEl.innerText === "COMPLETED") return;

    let reward = (taskId === 'twitter') ? 5 : 3;
    let link = (taskId === 'twitter') ? "https://x.com" : "https://t.me";

    window.open(link, '_blank');
    statusEl.innerText = "VERIFYING...";

    setTimeout(() => {
        userBalance += reward;
        database.ref('users/' + userWallet).update({ balance: userBalance });
        statusEl.innerText = "COMPLETED";
        statusEl.style.color = "#00ff88";
        alert(`Mission Complete! +${reward} ABP Added.`);
    }, 4000);
};

// Chicken Crosser Game Logic
window.openGame = function(gameType) {
    if (userEnergy < 20) return alert("Low Energy! Refueling...");

    if (gameType === 'chicken') {
        // Murgi Road Cross Kar Gayi (70% Chance)
        let win = Math.random() > 0.3;
        let mult = win ? (1.1 + Math.random()).toFixed(1) : 1.0;
        
        userEnergy -= 20;
        document.getElementById('energy-fill').style.width = userEnergy + "%";
        document.getElementById('energy-val').innerText = userEnergy + "/100";

        database.ref('users/' + userWallet).update({ currentMultiplier: parseFloat(mult) });

        if (win) {
            alert(`SUCCESS! Multiplier Boosted to ${mult}x for 1 Hour!`);
        } else {
            alert("CRASH! Murgi takra gayi. Multiplier Reset.");
        }
    }
};
