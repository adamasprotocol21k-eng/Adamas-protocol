// Function to show Popup
window.openPortal = () => {
    document.getElementById('modal-portal').style.display = 'flex';
};

// MetaMask Connection Logic
window.connectMetaMask = async () => {
    const btn = document.getElementById('connectBtn');
    const status = document.getElementById('statusMsg');

    if (window.ethereum) {
        try {
            status.innerText = "Requesting Confirmation...";
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];
            
            btn.innerText = "CONNECTED";
            btn.style.background = "#00ff88";
            status.innerText = "Verified: " + address.slice(0,6) + "..." + address.slice(-4);
            
            // Success: Redirect to Dashboard after 1.5s
            setTimeout(() => {
                alert("Protocol Unlocked. Welcome.");
                // window.location.href = "dashboard.html";
            }, 1500);

        } catch (error) {
            status.innerText = "Connection Denied";
        }
    } else {
        alert("Please install MetaMask extension!");
    }
};

