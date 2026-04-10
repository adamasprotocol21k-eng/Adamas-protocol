const UIController = {
    currentBalance: 1250, // Starting default balance
    miningRate: 0.0001,
    currentAds: 0.0000,

    init: async function() {
        // 1. Network & Wallet Sync
        await web3Handler.checkNetwork();
        const wallet = await web3Handler.getUserWallet();
        if(wallet) {
            document.getElementById('walletAddr').innerText = wallet.slice(0,6) + "..." + wallet.slice(-4);
        }

        // 2. Load Persisted Data (from Tasks/Games)
        this.loadLocalData();

        // 3. Start Engines
        this.startMiningEngine();
        TaskManager.renderTasks();
        this.updateBalanceUI();
    },

    // Central function to add/subtract points from anywhere
    updateBalance: function(amount) {
        this.currentBalance += amount;
        this.updateBalanceUI();
        localStorage.setItem('userBalance', this.currentBalance);
        
        // Success animation logic can go here
        console.log(`Balance Updated: ${amount} ABP`);
    },

    updateBalanceUI: function() {
        const balEl = document.getElementById('balance');
        if(balEl) balEl.innerText = Math.floor(this.currentBalance).toLocaleString();
    },

    startMiningEngine: function() {
        const adsEl = document.getElementById('liveAds');
        if(!adsEl) return;

        setInterval(() => {
            this.currentAds += this.miningRate;
            adsEl.innerText = this.currentAds.toFixed(4);
            // Optional: Har 10 unit par auto-collect logic yahan dal sakte hain
        }, 3000);
    },

    loadLocalData: function() {
        const savedBal = localStorage.getItem('userBalance');
        if(savedBal) this.currentBalance = parseFloat(savedBal);
    }
};

// --- GLOBAL FUNCTIONS (Used by HTML/Games) ---

window.onload = () => UIController.init();

function openGame(gameType) {
    const modal = document.getElementById('gameModal');
    const container = document.getElementById('gameContainer');
    
    if(!modal || !container) return;

    modal.style.display = 'block';
    container.innerHTML = '<div class="loader">Loading Game Engine...</div>';

    // Small delay for smooth transition
    setTimeout(() => {
        if(gameType === 'mines') MinesGame.init();
        if(gameType === 'patti') PattiGame.init();
        // Future: if(gameType === 'spin') SpinGame.init();
    }, 300);
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
}

// Helper for Games to sync back to UI
function syncBalance(amount) {
    UIController.updateBalance(amount);
}
