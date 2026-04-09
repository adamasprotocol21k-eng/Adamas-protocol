// Adamas Protocol - Auth Logic
// Iska kaam hai Social Tasks aur Wallet Connection manage karna

let tasksCompleted = {
    twitter: false,
    telegram: false
};

// 1. Tasks Handle Karne Ka Function
function handleTask(platform) {
    if (platform === 'twitter') {
        window.open('https://twitter.com/YourProjectHandle', '_blank'); // Apni link dalein
        tasksCompleted.twitter = true;
        showTaskDone('twitter');
    } else if (platform === 'telegram') {
        window.open('https://t.me/YourProjectGroup', '_blank'); // Apni link dalein
        tasksCompleted.telegram = true;
        showTaskDone('telegram');
    }

    checkGateStatus();
}

// 2. Button UI Update Karna
function showTaskDone(platform) {
    const buttons = document.querySelectorAll('.btn-task');
    const index = platform === 'twitter' ? 0 : 1;
    buttons[index].innerText = "✅ Done";
    buttons[index].style.borderColor = "#4caf50";
    buttons[index].style.color = "#4caf50";
}

// 3. Check Karna Ki Kya Dono Tasks Ho Gaye?
function checkGateStatus() {
    const connectBtn = document.getElementById('connectWallet');
    if (tasksCompleted.twitter && tasksCompleted.telegram) {
        connectBtn.disabled = false;
        connectBtn.innerText = "Connect Wallet";
    }
}

// 4. Wallet Connection Logic (MetaMask/Web3)
document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            // Wallet request
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userWallet = accounts[0];
            
            console.log("Connected:", userWallet);
            
            // Yahan hum user ko welcome karenge aur points record ki shuruat karenge
            alert("Wallet Connected: " + userWallet.substring(0, 6) + "..." + userWallet.substring(38));
            
            // Dashboard par bhejte hain (Dashboard.html hum next step mein banayenge)
            window.location.href = "dashboard.html";
            
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert("Please install MetaMask or use a Web3 Browser!");
    }
});

