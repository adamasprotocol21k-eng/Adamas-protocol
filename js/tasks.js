/**
 * ADAMAS PROTOCOL - MINING ENGINE & REWARD LOGIC
 * High-Precision Decimal Math for Scarcity Tracking
 */
export const miningEngine = {
    config: {
        baseRate: 0.0001388, // Per 3 seconds
        dailyBonus: 100.00,
        storageKey: 'adamas_vault_data'
    },

    getState() {
        const defaultState = { balance: 0.0, lastTick: Date.now(), streak: 1 };
        const saved = localStorage.getItem(this.config.storageKey);
        return saved ? JSON.parse(saved) : defaultState;
    },

    saveState(state) {
        localStorage.setItem(this.config.storageKey, JSON.stringify(state));
    },

    // Offline Mining Calculation (Top Feature)
    calculateOfflineEarnings() {
        const state = this.getState();
        const now = Date.now();
        const secondsPassed = (now - state.lastTick) / 1000;
        
        if (secondsPassed > 3) {
            const earnings = (secondsPassed / 3) * this.config.baseRate;
            state.balance += earnings;
            state.lastTick = now;
            this.saveState(state);
            return earnings;
        }
        return 0;
    },

    processMiningTick(callback) {
        setInterval(() => {
            const state = this.getState();
            state.balance += this.config.baseRate;
            state.lastTick = Date.now();
            this.saveState(state);
            callback(state.balance.toFixed(6));
        }, 3000);
    }
};
