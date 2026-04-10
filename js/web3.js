// ADAMAS PROTOCOL - Web3 Engine (Final)
const AMOY_CHAIN_ID = '0x13882'; // Hex for 80002

const networks = {
    amoy: {
        chainId: AMOY_CHAIN_ID,
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-amoy.polygon.technology/'],
        blockExplorerUrls: ['https://amoy.polygonscan.com/']
    }
};

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            // Check Network
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            if (currentChainId !== AMOY_CHAIN_ID) {
                await switchNetwork();
            }
            
            console.log("Connected to ADAMAS:", account);
            return account;
        } catch (error) {
            console.error("User denied account access", error);
            return null;
        }
    } else {
        alert("Please install MetaMask to join the 21,000 club!");
        return null;
    }
}

async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: AMOY_CHAIN_ID }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [networks.amoy],
                });
            } catch (addError) {
                console.error("Could not add network", addError);
            }
        }
    }
}

// Global Export
window.AdamasWeb3 = { connectWallet };
