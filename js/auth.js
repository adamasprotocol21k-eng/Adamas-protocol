// ADAMAS PROTOCOL - Auth & Social Gate (Final)

document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const authModal = document.getElementById('authModal');
    const verifyBtn = document.getElementById('verifyBtn');

    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            const wallet = await window.AdamasWeb3.connectWallet();
            if (wallet) {
                // Save wallet to local storage for session
                localStorage.setItem('adamas_user', wallet);
                
                // Show Social Verification Modal
                authModal.style.display = 'block';
                document.getElementById('walletInfo').innerText = `Wallet: ${wallet.substring(0,6)}...${wallet.substring(38)}`;
            }
        });
    }

    if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
            // Yahan hum social tasks check karenge (Next Phase mein Database ke saath)
            // Abhi ke liye hum seedha dashboard par bhej rahe hain
            window.location.href = 'dashboard.html';
        });
    }
});
