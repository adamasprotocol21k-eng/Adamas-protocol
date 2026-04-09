const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const rewards = [50, 0, 100, 10, 500, 20, 0, 200]; // ABP Rewards
const colors = ['#050a0f', '#00f2ff', '#050a0f', '#00f2ff', '#050a0f', '#00f2ff', '#050a0f', '#00f2ff'];

let startAngle = 0;
const arc = Math.PI / (rewards.length / 2);

function drawWheel() {
    rewards.forEach((reward, i) => {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 145, angle, angle + arc, false);
        ctx.lineTo(150, 150);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = i % 2 === 0 ? "white" : "black";
        ctx.translate(150 + Math.cos(angle + arc / 2) * 100, 150 + Math.sin(angle + arc / 2) * 100);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(reward, -ctx.measureText(reward).width / 2, 0);
        ctx.restore();
    });
}

function spinTheWheel() {
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = true;
    
    let spinAngle = Math.random() * 10 + 10;
    let currentSpin = 0;
    
    const interval = setInterval(() => {
        startAngle += 0.1;
        drawWheel();
        currentSpin += 0.1;
        if (currentSpin >= spinAngle) {
            clearInterval(interval);
            calculateReward();
            spinBtn.disabled = false;
        }
    }, 10);
}

function calculateReward() {
    const winningIndex = Math.floor((((startAngle + Math.PI/2) % (Math.PI*2)) / (Math.PI*2)) * rewards.length);
    const win = rewards[rewards.length - 1 - winningIndex];
    
    document.getElementById('spinResult').innerText = `You won ${win} ABP!`;
    
    // Engine se balance update karein
    userStats.balance += win;
    updateUI();
    if(typeof updateABP === "function") updateABP(userStats.wallet, userStats.balance);
}

drawWheel();

