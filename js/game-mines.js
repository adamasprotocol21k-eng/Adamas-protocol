const MinesGame = {
    grid: [], // Will store 0 for Diamond, 1 for Bomb
    bombsCount: 3,
    active: false,
    betAmount: 10,
    diamondsFound: 0,

    init: function() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="mines-wrapper">
                <h2 class="ultra-glow-text">DIAMOND MINES</h2>
                <div class="stats-bar">
                    <span>Reward: <b id="currentMultiplier">1.0x</b></span>
                    <span>Found: <b id="diamondCount">0</b></span>
                </div>
                <div id="mineGrid" class="mine-grid"></div>
                <div class="controls">
                    <button id="mineActionBtn" onclick="MinesGame.startGame()" class="btn-primary">START (Bet 10 ABP)</button>
                    <button id="cashoutBtn" onclick="MinesGame.cashout()" class="btn-action" style="display:none; background:#00ff88; color:#000;">CASHOUT</button>
                </div>
            </div>
        `;
        this.renderGrid(true); // Render disabled grid initially
    },

    renderGrid: function(disabled) {
        const gridDiv = document.getElementById('mineGrid');
        gridDiv.innerHTML = '';
        for(let i=0; i<25; i++) {
            gridDiv.innerHTML += `<div class="mine-tile ${disabled ? 'disabled' : ''}" onclick="MinesGame.reveal(${i}, this)">?</div>`;
        }
    },

    startGame: function() {
        // Reset Logic
        this.grid = new Array(25).fill(0);
        this.diamondsFound = 0;
        this.active = true;
        
        // Plant Bombs randomly
        let planted = 0;
        while(planted < this.bombsCount) {
            let r = Math.floor(Math.random() * 25);
            if(this.grid[r] === 0) {
                this.grid[r] = 1; // 1 represents a Bomb
                planted++;
            }
        }

        this.renderGrid(false);
        document.getElementById('mineActionBtn').style.display = 'none';
        document.getElementById('cashoutBtn').style.display = 'inline-block';
        document.getElementById('diamondCount').innerText = '0';
        document.getElementById('currentMultiplier').innerText = '1.0x';
    },

    reveal: function(idx, element) {
        if(!this.active || element.classList.contains('revealed')) return;

        element.classList.add('revealed');
        
        if(this.grid[idx] === 1) { // HIT A BOMB
            element.innerHTML = "💣";
            element.style.background = "radial-gradient(circle, #ff4b2b, #ff416c)";
            element.style.boxShadow = "0 0 20px #ff4b2b";
            this.gameOver(false);
        } else { // HIT A DIAMOND
            this.diamondsFound++;
            element.innerHTML = "💎";
            element.style.background = "radial-gradient(circle, #00f2ff, #007bff)";
            element.style.boxShadow = "0 0 15px #00f2ff";
            
            // Update Multiplier (Simple math: each diamond adds 0.2x)
            let mult = (1 + (this.diamondsFound * 0.25)).toFixed(2);
            document.getElementById('currentMultiplier').innerText = mult + "x";
            document.getElementById('diamondCount').innerText = this.diamondsFound;

            if(this.diamondsFound === (25 - this.bombsCount)) {
                this.gameOver(true);
            }
        }
    },

    cashout: function() {
        if(!this.active || this.diamondsFound === 0) return;
        this.gameOver(true);
    },

    gameOver: function(isWin) {
        this.active = false;
        const tiles = document.querySelectorAll('.mine-tile');
        
        // Show all bombs
        this.grid.forEach((val, i) => {
            if(val === 1) {
                tiles[i].innerHTML = "💣";
                tiles[i].style.opacity = "0.8";
            }
        });

        if(isWin) {
            let mult = 1 + (this.diamondsFound * 0.25);
            let winAmount = Math.floor(this.betAmount * mult);
            alert(`EXCELLENT! You cashed out ${winAmount} ABP! 💎`);
            // Yahan par points update karne ka function (ui.js se) call kar sakte hain
        } else {
            alert("BOOM! Strategy failed. Try again!");
        }

        document.getElementById('mineActionBtn').style.display = 'inline-block';
        document.getElementById('cashoutBtn').style.display = 'none';
        document.getElementById('mineActionBtn').innerText = "PLAY AGAIN";
    }
};
