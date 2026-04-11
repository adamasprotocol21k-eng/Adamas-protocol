/**
 * ADAMAS PROTOCOL - MAIN INTERFACE LOGIC
 * Vision: Cinematic Entry -> Social Validation -> Web3 Connect
 */

// 1. TYPING ANIMATION (The "Cinematic Spelling" Effect)
const logoText = "ADAMAS PROTOCOL";
const typingEl = document.getElementById('typing-logo');
let charIdx = 0;

function typeLogo() {
    if (typingEl && charIdx < logoText.length) {
        typingEl.innerHTML += logoText.charAt(charIdx);
        charIdx++;
        // Speed control: 100ms per character for that premium feel
        setTimeout(typeLogo, 100); 
    }
}

// Start typing as soon as window loads
window.onload = typeLogo;

// 2. JOURNEY TRANSITION (Intro to Socials)
window.startJourney = function() {
    const phaseIntro = document.getElementById('phase-intro');
    const phaseSocial = document.getElementById('phase-social');

    if (phaseIntro && phaseSocial) {
        phaseIntro.classList.remove('active');
        // Small delay for smooth transition
        setTimeout(() => {
            phaseSocial.classList.add('active');
        }, 100);
    }
};

// 3. SOCIAL VALIDATION LOGIC (The "Lock & Blink" System)
let tasksDone = 0;

window.verifyTask = function(el) {
    const statusIndicator = el.querySelector('.status-indicator');
    const currentStatus = el.getAttribute('data-status');

    // Only allow clicking if it's still pending
    if (currentStatus === 'pending') {
        // Update Internal Data
        el.setAttribute('data-status', 'completed');
        
        // Update Visuals
        el.style.borderColor = 'rgba(0, 242, 255, 0.6)'; // Glowing Cyan Border
        el.style.background = 'rgba(0, 242, 255, 0.05)';
        
        statusIndicator.innerText = 'VERIFIED';
        statusIndicator.style.color = '#00ff88'; // Clean Green
        
        tasksDone++;
        checkValidation();
    }
};

function checkValidation() {
    // Only enable if BOTH Telegram and X are verified
    if (tasksDone >= 2) {
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.classList.remove('btn-locked');
            connectBtn.classList.add('btn-active-blink'); // Triggers CSS Blinking
            connectBtn.innerText = "CONFIRM & CONNECT WALLET";
        }
    }
}

// 4. METAMASK / WEB3 CONNECTION (Final Step)
window.connectWeb3 = async function() {
    const connectBtn = document.getElementById('connect-wallet-btn');

    if (window.ethereum) {
        try {
            connectBtn.innerText = "WAITING FOR CONFIRMATION...";
            
            // Trigger MetaMask Popup
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            if (accounts.length > 0) {
                const userWallet = accounts[0];
                connectBtn.style.background = "#00ff88";
                connectBtn.innerText = "IDENTITY SECURED";
                
                console.log("Connected to:", userWallet);
                
                // Final Success: Redirect or Open Dashboard
                setTimeout(() => {
                    alert("Welcome to Adamas Protocol.");
                    // window.location.href = "dashboard.html"; // Redirect command
                }, 1000);
            }
        } catch (err) {
            console.error("Connection Denied", err);
            connectBtn.innerText = "CONNECTION DENIED";
            setTimeout(() => {
                connectBtn.innerText = "CONFIRM & CONNECT WALLET";
            }, 2000);
        }
    } else {
        alert("MetaMask not detected! Please install the extension.");
    }
};
