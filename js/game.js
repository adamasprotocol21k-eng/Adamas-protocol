let isGameOver = false;
let stats = JSON.parse(localStorage.getItem('adamas_game_stats')) || { played: 0, wins: 0 };

function updateGameStats() {
    document.getElementById('totalPlayed').innerText = stats.played;
    let rate = stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100);
    document.getElementById('winRate').innerText = rate + "%";
}

function playGame(element, index) {
    if (isGameOver) return;
    if (userStats.balance < 100) {
        alert("Minimum 100 ABP required to play!");
        return;
    }

    // Deduct entry fee
    userStats.balance -= 100;
    stats.played++;
    
    // Logic: 40% chance of winning
    let isWin = Math.random() < 0.4;
    isGameOver = true;

    if (isWin) {
        element.innerHTML = "💎";
        element.classList.add('win');
        document.getElementById('game-msg').innerText = "YOU WON 200 ABP!";
        document.getElementById('game-msg').classList.add('text-neon-green');
        userStats.balance += 200;
        stats.wins++;
    } else {
        element.innerHTML = "💣";
        element.classList.add('lose');
        document.getElementById('game-msg').innerText = "BOOM! YOU LOST.";
        document.getElementById('game-msg').classList.add('text-neon-red');
    }

    saveStats();
    localStorage.setItem('adamas_game_stats', JSON.stringify(stats));
    updateUI();
    updateGameStats();
}

function resetGame() {
    isGameOver = false;
    document.getElementById('game-msg').innerText = "Tap a box to start!";
    document.getElementById('game-msg').classList.remove('text-neon-green', 'text-neon-red');
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        cell.innerHTML = "?";
        cell.classList.remove('win', 'lose');
    });
}

// Initial stats load
updateGameStats();

