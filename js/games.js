// --- SPIN WHEEL LOGIC ---
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinRewards = [50, 0, 100, 10, 500, 20, 0, 200];
const colors = ['#050a0f', '#00f2ff', '#050a0f', '#00f2ff', '#050a0f', '#00f2ff', '#050a0f', '#00f2ff'];

let startAngle = 0;
const arc = Math.PI / (spinRewards.length / 2);

function drawWheel() {
    if (!canvas) return;
    ctx.clearRect(0,0,300,300);
    spinRewards.forEach((reward, i) => {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 140, angle, angle + arc, false);
        ctx.lineTo(150, 150);
        ctx.fill();
        ctx.strokeStyle = '#00f2ff';
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = i % 2 === 0 ? "white" : "black";
        ctx.font = "bold 16px Rajdhani";
        ctx.translate(150 + Math.cos(angle + arc / 2) * 100, 150 + Math.sin(angle + arc / 2) * 100);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(reward, -ctx.measureText(reward).width / 2, 0);
        ctx.restore();
    });
}

function spinTheWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    let totalRotation = Math.random() * 10 + 20;
    let currentRotation = 0;

    const animation = setInterval(() => {
        startAngle += 0.15;
        drawWheel();
        currentRotation += 0.15;
        if (currentRotation >= totalRotation) {
            clearInterval(animation);
            const winningIndex = Math.floor((((startAngle + Math.PI/2) % (Math.PI*2)) / (Math.PI*2)) * spinRewards.length);
            const win = spinRewards[spinRewards.length - 1 - winningIndex];
            document.getElementById('spinResult').innerText = `You won ${win} ABP!`;
            addPoints(win);
            btn.disabled = false;
        }
    }, 15);
}

// --- SCRATCH CARD LOGIC ---
const sCanvas = document.getElementById('scratchCanvas');
const sCtx = sCanvas ? sCanvas.getContext('2d') : null;
let scratched = false;

function initScratch() {
    if (!sCanvas) return;
    scratched = false;
    sCtx.globalCompositeOperation = 'source-over';
    sCtx.fillStyle = '#D4AF37';
    sCtx.fillRect(0, 0, 250, 150);
    
    const rewards = [50, 100, 250, 500];
    const win = rewards[Math.floor(Math.random() * rewards.length)];
    document.getElementById('scratchReward').innerText = win + " ABP";
    document.getElementById('scratchStatus').innerText = "Scratch to reveal!";
    
    const scratchAction = (e) => {
        if (scratched) return;
        const rect = sCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        sCtx.globalCompositeOperation = 'destination-out';
        sCtx.beginPath();
        sCtx.arc(x, y, 20, 0, Math.PI * 2);
        sCtx.fill();
        checkScratch(win);
    };

    sCanvas.onmousemove = scratchAction;
    sCanvas.ontouchmove = scratchAction;
}

function checkScratch(win) {
    // Basic logic to claim after a bit of scratching
    setTimeout(() => {
        if (!scratched) {
            scratched = true;
            document.getElementById('scratchStatus').innerText = "Winner!";
            addPoints(win);
        }
    }, 3000);
}

drawWheel();
