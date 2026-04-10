const web3Handler = {
    amoyChainId: '0x13882', // 80002 in Decimal (Polygon Amoy)
    
    // Full Config for Adding Network automatically
    amoyConfig: {
        chainId: '0x13882',
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-amoy.polygon.technology'],
        blockExplorerUrls: ['https://amoy.polygonscan.com/']
    },

    checkNetwork: async () => {
        if (!window.ethereum) return;

        try {
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            if (currentChainId !== web3Handler.amoyChainId) {
                try {
                    // Try to switch
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: web3Handler.amoyChainId }],
                    });
                } catch (switchError) {
                    // This error code (4902) means the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [web3Handler.amoyConfig],
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Network Check Error:", error);
        }
    },

    getUserWallet: async () => {
        if (!window.ethereum) return null;
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        return accounts[0] || null;
    },

    // Listen for Account or Network changes
    initListeners: () => {
        if (!window.ethereum) return;

        window.ethereum.on('accountsChanged', (accounts) => {
            window.location.reload(); // Reload to sync new wallet
        });

        window.ethereum.on('chainChanged', () => {
            window.location.reload(); // Reload to enforce correct network
        });
    }
};

// Initialize listeners immediately
web3Handler.initListeners();
