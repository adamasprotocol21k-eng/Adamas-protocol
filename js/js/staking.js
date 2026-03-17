/**
 * ADAMAS PROTOCOL - Staking Module (Optimized)
 * Fix: Multi-Staking support, Correct Keys, Real-time Sync
 */

const StakingModule = {
    rates: {
        7: 5,   // 5% Bonus
        30: 15, // 15% Bonus
        90: 40  // 40% Bonus
    },

    // 1. STAKE TOKENS
    async stake(amount, durationDays) {
        const wallet = localStorage.getItem('userWallet');
        if (!wallet) return Notify.show("Connect Portal First!", "error");

        const amountNum = parseInt(amount);
        if (isNaN(amountNum) || amountNum <= 0) return Notify.show("Invalid Amount!", "error");

        Notify.show("Locking tokens in Galaxy Vault...", "info");

        const userData = await window.DBModule.getUserData(wallet);
        if (!userData || userData.balance < amountNum) {
            return Notify.show("Insufficient ABP Balance!", "error");
        }

        const unlockDate = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
        const bonusRate = this.rates[durationDays];
        const expectedBonus = Math.floor(amountNum * (bonusRate / 100));

        const stakeData = {
            amount: amountNum,
            stakedAt: Date.now(),
            unlockAt: unlockDate,
            bonus: expectedBonus,
            status: 'locked',
            plan: `${durationDays} Days`
        };

        try {
            const userKey = wallet.toLowerCase().replace(/[^a-z0-9]/g, "");
            const { getDatabase, ref, update, push, increment } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js");
            const db = getDatabase();
            
            // Updates: Subtract Balance & Add to 'stakes' list (Multi-staking)
            const updates = {};
            updates[`users/${userKey}/balance`] = increment(-amountNum);
            
            // Generating a unique ID for this specific stake
            const newStakeRef = push(ref(db, `users/${userKey}/stakes`));
            updates[`users/${userKey}/stakes/${newStakeRef.key}`] = stakeData;

            await update(ref(db), updates);

            Notify.show(`Vault Locked: ${amountNum} ABP for ${durationDays} days.`, "success");
            // No reload needed, DBModule.listenToUpdates will update the UI balance
        } catch (error) {
            console.error("Staking Sync Error:", error);
            Notify.show("Vault Error. Try again.", "error");
        }
    },

    // 2. AUTO-CLAIM MATURED STAKES
    async processMaturity() {
        const wallet = localStorage.getItem('userWallet');
        if (!wallet) return;

        const userData = await window.DBModule.getUserData(wallet);
        if (!userData || !userData.stakes) return;

        const userKey = wallet.toLowerCase().replace(/[^a-z0-9]/g, "");
        const { getDatabase, ref, update, increment } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js");
        const db = getDatabase();

        let totalClaimed = 0;
        const updates = {};

        // Check each stake
        Object.keys(userData.stakes).forEach(stakeId => {
            const stake = userData.stakes[stakeId];
            if (stake.status === 'locked' && Date.now() >= stake.unlockAt) {
                const payout = stake.amount + stake.bonus;
                totalClaimed += payout;
                
                updates[`users/${userKey}/stakes/${stakeId}/status`] = 'claimed';
                updates[`users/${userKey}/balance`] = increment(payout);
            }
        });

        if (totalClaimed > 0) {
            await update(ref(db), updates);
            Notify.show(`Staking Matured! +${totalClaimed} ABP added to Vault.`, "success");
        }
    }
};

window.StakingModule = StakingModule;
