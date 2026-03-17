/**
 * ADAMAS PROTOCOL - Auth Module (Optimized)
 * Update: Smooth Redirection, Correct Network Validation, & DB Sync
 */

const AMOY_CHAIN_ID = '0x13882'; // Polygon Amoy Testnet

const AuthModule = {
    userWallet: null,

    // 1. Session Restoration
    async init() {
        this.userWallet = localStorage.getItem('userWallet');
        if (this.userWallet) {
            // Agar dashboard par nahi hai aur connected hai, toh bhejo wahan
            const currentPage = window.location.pathname.split("/").pop();
            if (currentPage === "index.html" || currentPage === "") {
                window.location.href = "dashboard.html";
            }
        }
    },

    // 2. Main Connect Logic
    async connect() {
        if (!window.ethereum) {
            return Notify.show("Please install MetaMask!", "error");
        }

        try {
            Notify.show("Opening Space Portal...", "info");
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.userWallet = accounts[0].toLowerCase();
            
            // Network Validation
            const isCorrectNetwork = await this.checkNetwork();
            
            if (isCorrectNetwork) {
                localStorage.setItem('userWallet', this.userWallet);
                
                // Naya User initialization check (database.js se)
                if (window.DBModule) {
                    await window.DBModule.getUserData(this.userWallet);
                }

                Notify.show("Connection Secured! Entering Vault...", "success");
                
                // Redirect after 1 second for smooth experience
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);
            }
        } catch (error) {
            console.error("Auth Error:", error);
            Notify.show("Connection Denied by User", "error");
        }
    },

    // 3. Network Auto-Switch (Polygon Amoy)
    async checkNetwork() {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            if (chainId !== AMOY_CHAIN_ID) {
                Notify.show("Switching to Amoy Network...", "info");
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: AMOY_CHAIN_ID }],
                    });
                    return true;
                } catch (err) {
                    if (err.code === 4902) {
                        Notify.show("Please add Amoy Network to MetaMask", "warning");
                    }
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    // 4. Logout
    logout() {
        localStorage.removeItem('userWallet');
        this.userWallet = null;
        Notify.show("Portal Closed. See you soon!", "info");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }
};

// Global Exposure
window.AuthModule = AuthModule;
window.addEventListener('DOMContentLoaded', () => AuthModule.init());
