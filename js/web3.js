/**
 * ADAMAS PROTOCOL - WEB3 INFRASTRUCTURE
 * Standard: EIP-1193 Managed Provider
 */
export const web3Handler = {
    provider: window.ethereum,
    chainId: '0x13881', // Polygon Amoy
    rpcUrl: 'https://rpc-amoy.polygon.technology',

    async init() {
        if (!this.provider) throw new Error("CRITICAL: No Web3 Provider Detected.");
        this.setupListeners();
    },

    setupListeners() {
        this.provider.on('accountsChanged', (accounts) => {
            console.log("Identity Shift Detected:", accounts[0]);
            window.location.reload();
        });
        this.provider.on('chainChanged', () => window.location.reload());
    },

    async connect() {
        try {
            const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
            const currentChain = await this.provider.request({ method: 'eth_chainId' });

            if (currentChain !== this.chainId) {
                await this.switchNetwork();
            }
            return accounts[0];
        } catch (error) {
            console.error("Connection Rejected:", error.code);
            return null;
        }
    },

    async switchNetwork() {
        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await this.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: this.chainId,
                        chainName: 'Polygon Amoy Testnet',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: [this.rpcUrl],
                        blockExplorerUrls: ['https://amoy.polygonscan.com/']
                    }],
                });
            }
        }
    }
};
