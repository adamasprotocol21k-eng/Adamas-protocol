// ADAMAS PROTOCOL - Core Logic
document.addEventListener('DOMContentLoaded', async () => {
    const connectBtn = document.getElementById('connectBtn');
    const globalBalanceEl = document.getElementById('globalBalance');
    
    // 1. Initialize State
    let userAddress = null;
    let abpBalance = parseFloat(localStorage.getItem('adamas_abp_balance') || 0);

    // Update balance UI on load
    const updateBalanceUI = () => {
        const elements = document.querySelectorAll('#globalBalance');
        elements.forEach(el => el.innerText = abpBalance.toLocaleString());
    };
    updateBalanceUI();

    // 2. Wallet Connection Logic
    async function connectWallet() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                userAddress = await signer.getAddress();
                
                // UI update after connection
                connectBtn.innerText = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
                connectBtn.style.borderColor = "#bc13fe"; // Change to purple on connect
                
                // Network Check
                checkNetwork();
                console.log("Wallet Connected:", userAddress);
            } catch (error) {
                console.error("Connection failed", error);
            }
        } else {
            alert("MetaMask not found! Please install it to use Adamas Protocol.");
        }
    }

    async function checkNetwork() {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x13882') { // Polygon Amoy Hex
            alert("Please switch to Polygon Amoy Testnet for full functionality.");
        }
    }

    // 3. Global ABP Adder (For Games/Daily Check-in)
    window.addABP = (amount) => {
        abpBalance += amount;
        localStorage.setItem('adamas_abp_balance', abpBalance);
        updateBalanceUI();
        // Trigger a small animation if element exists
        const el = document.getElementById('globalBalance');
        el.style.transform = "scale(1.2)";
        setTimeout(() => el.style.transform = "scale(1)", 200);
    };

    connectBtn.addEventListener('click', connectWallet);

    // Smooth Page Transitions (Loader removal)
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1500);
    }
});

