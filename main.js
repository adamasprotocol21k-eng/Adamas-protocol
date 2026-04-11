/**
 * ADAMAS PROTOCOL - CORE INTERACTION ENGINE
 * Updates: Deep Linking for Mobile, Social Redirects, and Dashboard Unlock
 */

// [Point 1 & 2 same rahenge, typing aur transition ekdum sahi hai]
const logoText = "ADAMAS PROTOCOL";
const typingEl = document.getElementById('typing-logo');
let charIdx = 0;

function typeLogo() {
    if (typingEl && charIdx < logoText.length) {
        typingEl.innerHTML += logoText.charAt(charIdx);
        charIdx++;
        setTimeout(typeLogo, 80); 
    }
}
window.onload = typeLogo;

window.startJourney = function() {
    const phaseIntro = document.getElementById('phase-intro');
    const phaseSocial = document.getElementById('phase-social');
    if (phaseIntro && phaseSocial) {
        phaseIntro.style.opacity = '0';
        phaseIntro.style.transform = 'scale(0.9)';
        setTimeout(() => {
            phaseIntro.classList.remove('active');
            phaseSocial.classList.add('active');
        }, 400);
    }
};

// 3. NODE VALIDATION LOGIC (Ab ye real links kholega)
let tasksDone = 0;

window.verifyTask = function(el) {
    const statusBox = el.querySelector('.node-status');
    const currentStatus = el.getAttribute('data-status');

    if (currentStatus === 'pending') {
        // REAL REDIRECT: Pehle social media khulega
        const taskName = el.querySelector('.node-name').innerText;
        if(taskName.includes("TELEGRAM")) {
            window.open('https://t.me/your_telegram_link', '_blank'); // Link baad mein replace kar lena
        } else {
            window.open('https://x.com/your_x_link', '_blank'); // Link baad mein replace kar lena
        }

        el.setAttribute('data-status', 'completed');
        el.style.borderColor = 'var(--cyan)';
        el.style.background = 'rgba(0, 242, 255, 0.08)';
        
        if (statusBox) {
            statusBox.innerText = 'VERIFIED';
            statusBox.style.color = '#00ff88';
            statusBox.style.textShadow = '0 0 10px #00ff88';
        }
        
        tasksDone++;
        checkValidation();
    }
};

function checkValidation() {
    if (tasksDone >= 2) {
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.classList.add('btn-active-blink');
            connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION";
        }
    }
}

// 4. WEB3 / METAMASK ENGINE (Fixing Mobile Popup & Redirect)
window.connectWeb3 = async function() {
    const connectBtn = document.getElementById('connect-wallet-btn');

    if (window.ethereum) {
        try {
            connectBtn.innerText = "PENDING...";
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length > 0) {
                localStorage.setItem('adamas_user', accounts[0]);
                connectBtn.style.background = "#00ff88";
                connectBtn.innerText = "IDENTITY SECURED";
                
                // REDIRECT UNLOCKED: Ab ye dashboard par lekar jayega
                setTimeout(() => {
                    window.location.href = "dashboard.html"; 
                }, 1000);
            }
        } catch (err) {
            connectBtn.innerText = "CONNECTION FAILED";
            setTimeout(() => { connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION"; }, 2000);
        }
    } else {
        // MOBILE DEEP LINK: Agar browser mein wallet nahi hai, toh MetaMask app khulega
        const dappUrl = window.location.href.replace('https://', '').replace('http://', '');
        window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
        
        // Testing fallback for you
        setTimeout(() => {
            alert("Redirecting to MetaMask... If testing on Desktop, please install the extension.");
        }, 1000);
    }
};
