// 1. Typing Logo Animation on Load
const logoText = "ADAMAS PROTOCOL";
const typingEl = document.getElementById('typing-logo');
let charIdx = 0;

function typeLogo() {
    if (charIdx < logoText.length) {
        typingEl.innerHTML += logoText.charAt(charIdx);
        charIdx++;
        setTimeout(typeLogo, 100); // Speed of spelling pop-up
    }
}

window.onload = typeLogo;

// 2. Journey Start
function startJourney() {
    document.getElementById('phase-intro').classList.remove('active');
    document.getElementById('phase-social').classList.add('active');
}

// 3. Social Validation Logic
let tasksDone = 0;
function verifyTask(el) {
    const status = el.querySelector('.status-box');
    if (status.innerText === '✕') {
        status.innerText = '✓';
        status.style.color = '#00ff88';
        tasksDone++;
        checkValidation();
    }
}

function checkValidation() {
    if (tasksDone >= 2) {
        const btn = document.getElementById('connect-wallet-btn');
        btn.disabled = false;
        btn.classList.add('btn-active-blink');
        btn.innerText = "CONFIRM & CONNECT WALLET";
    }
}

// 4. MetaMask Logic
async function connectWeb3() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            alert("Wallet Connected: " + accounts[0]);
            // Next: Redirect to Dashboard Screen
        } catch (err) {
            alert("Connection Denied.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}
