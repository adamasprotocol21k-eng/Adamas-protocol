let tasks = { x: false, tg: false };

async function handleAuth() {
    // 1. Check if already verified
    if (sessionStorage.getItem('adamas_verified') === 'true') {
        window.location.href = "dashboard.html";
        return;
    }

    // 2. Wallet Connection (Polygon Amoy)
    if (window.ethereum) {
        try {
            // First, ensure they are on the right network
            await web3Handler.checkNetwork();
            
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected:", accounts[0]);
            
            // Show Social Lock Modal
            const modal = document.getElementById('socialModal');
            if(modal) modal.style.display = 'block';
            
        } catch (err) {
            console.error("Auth Error:", err);
            if(err.code === 4001) alert("Please connect your wallet to continue.");
        }
    } else {
        alert("Web3 Browser Not Found! Please use MetaMask or TrustWallet.");
    }
}

function taskDone(type) {
    // Simulate checking if they actually clicked the link
    tasks[type] = true;
    const statusEl = document.getElementById(`${type}-status`);
    if(statusEl) {
        statusEl.innerText = "✅";
        statusEl.style.color = "#00ff88";
    }
    checkVerification();
}

function checkVerification() {
    if (tasks.x && tasks.tg) {
        const btn = document.getElementById('verifyBtn');
        if(btn) {
            btn.classList.remove('btn-disabled');
            btn.classList.add('btn-primary');
            btn.disabled = false;
            btn.innerHTML = "ENTER ECOSYSTEM ➔";
            // Add a little extra shine when ready
            btn.style.boxShadow = "0 0 20px var(--cyan)";
        }
    }
}

function enterDashboard() {
    // Save verification state so they don't have to do it again this session
    sessionStorage.setItem('adamas_verified', 'true');
    
    // Smooth transition
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 500);
}

// Global check on page load for index.html
window.addEventListener('load', () => {
    if (sessionStorage.getItem('adamas_verified') === 'true') {
        // Optional: Auto-connect or show "Enter" button directly
        console.log("User already verified in this session.");
    }
});
