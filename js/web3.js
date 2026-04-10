// web3.js - Professional Web3 Provider
export const web3 = {
    address: null,
    async connect() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.address = accounts[0];
            localStorage.setItem('user_addr', this.address);
            return this.address;
        }
        throw new Error("Wallet not found");
    },
    getStoredAddress() {
        return localStorage.getItem('user_addr');
    }
};
