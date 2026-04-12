// --- REAL WEB3 ENGINE START ---
window.connectWeb3 = async function() {
    const connectBtn = document.getElementById('connect-wallet-btn');

    if (window.ethereum) {
        try {
            connectBtn.innerText = "VERIFYING NETWORK...";
            
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x13882') {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x13882' }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        alert("Please add Polygon Amoy Testnet to your MetaMask.");
                    }
                    return;
                }
            }

            connectBtn.innerText = "WAITING FOR SIGNATURE...";
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                localStorage.setItem('adamas_user', userAddress); 

                // 🔥 REFERRAL REGISTRATION LOGIC START
                // 1. Check karo browser memory mein koi referral address hai?
                const referrer = localStorage.getItem('adamas_referrer');
                
                // 2. Firebase Database Instance
                // Note: Aapka firebase instance dashboard.js mein hai, lekin hum yahan 
                // link create karne ke liye ek silent update bhejenge.
                const db = firebase.database(); 

                // 3. Register user and link with Referrer (if exists)
                const userRef = db.ref('users/' + userAddress);
                
                // Hum 'once' use karenge taki purana data overwrite na ho (sirf referredBy set ho)
                userRef.once('value').then((snapshot) => {
                    if (!snapshot.exists()) {
                        // Naya user hai, toh entry create karo
                        userRef.set({
                            balance: 0,
                            streak: 0,
                            referredBy: referrer || "DIRECT", // Agar link se nahi aaya toh DIRECT
                            createdAt: new Date().toISOString()
                        });

                        // Agar koi referrer hai, toh uske "referrals" folder mein bhi entry daal do
                        if (referrer && referrer !== userAddress) {
                            db.ref('users/' + referrer + '/myReferrals/' + userAddress).set(true);
                        }
                    }
                });
                // 🔥 REFERRAL REGISTRATION LOGIC END
                
                connectBtn.style.background = "#00ff88";
                connectBtn.style.color = "#000";
                connectBtn.innerText = "PROTOCOL SECURED";
                
                setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
            }
        } catch (err) {
            console.error(err);
            connectBtn.innerText = "CONNECTION DENIED";
            setTimeout(() => { connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION"; }, 2000);
        }
    } else {
        const dappUrl = window.location.href.split('//')[1];
        window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
    }
};
