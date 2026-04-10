// web3.js - Handles Wallet and Blockchain Connection
const web3Handler = {
    provider: null,
    userAddress: null,

    async connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.userAddress = accounts[0];
                console.log("Connected to:", this.userAddress);
                return this.userAddress;
            } catch (error) {
                console.error("User denied account access");
            }
        } else {
            alert("Please install MetaMask or a Web3 Wallet!");
        }
    },

    shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
};

export default web3Handler;
