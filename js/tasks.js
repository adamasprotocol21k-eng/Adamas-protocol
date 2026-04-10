// tasks.js - Handles Mining Nodes & Daily Streaks
export const taskManager = {
    miningRate: 0.0001,
    currentBalance: 0,

    startMining(callback) {
        setInterval(() => {
            this.currentBalance += this.miningRate;
            callback(this.currentBalance);
        }, 3000);
    },

    claimDaily(streak) {
        const bonus = 100 * streak;
        this.currentBalance += bonus;
        return bonus;
    }
};
