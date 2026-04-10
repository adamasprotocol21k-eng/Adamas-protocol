let tasks = { x: false, tg: false };

async function handleAuth() {
    // Wallet Connection Simulation (Polygon Amoy)
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected:", accounts[0]);
            // Wallet connect hote hi Social Popup show karo
            document.getElementById('socialModal').style.display = 'block';
        } catch (err) {
            alert("Connection Cancelled");
        }
    } else {
        alert("Please use a Web3 Browser (Metamask/Trust)");
    }
}

function taskDone(type) {
    tasks[type] = true;
    document.getElementById(`${type}-status`).innerText = "✅";
    checkVerification();
}

function checkVerification() {
    if (tasks.x && tasks.tg) {
        const btn = document.getElementById('verifyBtn');
        btn.classList.remove('btn-disabled');
        btn.classList.add('btn-primary');
        btn.disabled = false;
    }
}

function enterDashboard() {
    // User verified, now redirect
    window.location.href = "dashboard.html";
}
