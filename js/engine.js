// Adamas Protocol Core Engine
let balance = parseInt(localStorage.getItem('abp_balance')) || 0;

function updateUI() {
    document.getElementById('abpBalance').innerText = balance.toLocaleString();
    localStorage.setItem('abp_balance', balance);
}

function addPoints(amount) {
    balance += amount;
    updateUI();
}

function claimDaily() {
    const btn = document.getElementById('dailyBtn');
    addPoints(50);
    btn.disabled = true;
    btn.innerText = "Claimed";
    alert("Daily bonus added!");
}

function copyRef() {
    const copyText = document.getElementById("referralLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Referral link copied!");
}

// Global modal handlers
function openModal(id) {
    document.getElementById(id).style.display = "block";
    if (id === 'scratchModal') initScratch();
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// Start UI
window.onload = updateUI;
