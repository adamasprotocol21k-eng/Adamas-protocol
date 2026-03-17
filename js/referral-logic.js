/**
 * ADAMAS PROTOCOL - Referral Engine
 */
import { DBModule } from './database.js';

const ReferralModule = {
    wallet: localStorage.getItem('userWallet'),

    async init() {
        if(!this.wallet) return;

        // 1. Generate Link
        const shortAddr = this.wallet.substring(2, 8);
        const fullLink = `${window.location.origin}/index.html?ref=${shortAddr}`;
        document.getElementById('refLink').innerText = fullLink;

        // 2. Fetch Stats from Firebase
        const user = await DBModule.getUserData(this.wallet);
        if(user) {
            document.getElementById('totalRef').innerText = user.referrals || 0;
            document.getElementById('refEarned').innerText = (user.referrals || 0) * 50;
        }
    },

    copyLink() {
        const link = document.getElementById('refLink').innerText;
        navigator.clipboard.writeText(link);
        Notify.show("Link Copied! Share everywhere.", "success");
    }
};

window.ReferralModule = ReferralModule;
window.addEventListener('DOMContentLoaded', () => ReferralModule.init());

