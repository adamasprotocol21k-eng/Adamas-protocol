/**
 * ADAMAS PROTOCOL - Daily Reward System (Hamster/Notcoin Style)
 */
import { DBModule } from './database.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const DailySystem = {
    rewards: [100, 250, 500, 1000, 2500, 5000, 10000], // Reward amounts
    wallet: localStorage.getItem('userWallet'),

    async init() {
        if(!this.wallet) return;
        const userData = await window.DBModule.getUserData(this.wallet);
        const grid = document.getElementById('rewardGrid');
        if(!grid) return;
        
        grid.innerHTML = '';
        let streak = userData.streak || 0;
        const lastClaim = userData.lastCheckIn || 0;
        const now = Date.now();
        
        // Reset streak if missed more than 48 hours
        if (lastClaim !== 0 && (now - lastClaim) > (48 * 60 * 60 * 1000)) {
            streak = 0;
        }

        const currentDayIndex = streak % 7;
        const isReadyToClaim = lastClaim === 0 || (now - lastClaim) > (24 * 60 * 60 * 1000);

        this.rewards.forEach((amt, index) => {
            const isClaimed = index < currentDayIndex;
            const isToday = index === currentDayIndex && isReadyToClaim;
            
            grid.innerHTML += `
                <div class="glass-card" style="padding: 12px; border: 1px solid ${isToday ? 'var(--neon-blue)' : '#222'}; background: ${isClaimed ? 'rgba(0,255,136,0.1)' : 'none'};">
                    <div style="font-size: 0.5rem; color: #888;">DAY ${index + 1}</div>
                    <div style="font-size: 1.2rem; margin: 8px 0;">${isClaimed ? '✅' : '💰'}</div>
                    <div style="font-size: 0.7rem; font-weight: 800; color: ${isToday ? 'var(--neon-blue)' : 'white'};">+${amt}</div>
                </div>
            `;
        });

        const claimBtn = document.getElementById('claimBtn');
        if (claimBtn) {
            if (!isReadyToClaim) {
                claimBtn.innerText = "NEXT REWARD IN 24H";
                claimBtn.disabled = true;
                claimBtn.style.opacity = "0.5";
            } else {
                claimBtn.innerText = "CLAIM DAILY REWARD";
                claimBtn.disabled = false;
                claimBtn.style.opacity = "1";
            }
        }
    },

    async claim() {
        const userData = await window.DBModule.getUserData(this.wallet);
        let streak = userData.streak || 0;
        const currentDayIndex = streak % 7;
        const rewardAmount = this.rewards[currentDayIndex];

        await window.DBModule.updateBalance(this.wallet, rewardAmount);
        
        // Update Firebase
        const userRef = ref(window.db, 'users/' + this.wallet.toLowerCase());
        await update(userRef, {
            lastCheckIn: Date.now(),
            streak: streak + 1
        });

        window.Notify.show(`Day ${streak + 1} Claimed! +${rewardAmount} ABP`, "success");
        document.getElementById('rewardModal').style.display = 'none';
    }
};

window.DailySystem = DailySystem;

