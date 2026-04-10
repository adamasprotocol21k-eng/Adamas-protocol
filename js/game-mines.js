// game-mines.js - Core Logic for the Mines Game
export const minesGame = {
    grid: [],
    minesCount: 3,

    initGame() {
        this.grid = Array(25).fill('diamond');
        let placed = 0;
        while (placed < this.minesCount) {
            let idx = Math.floor(Math.random() * 25);
            if (this.grid[idx] !== 'mine') {
                this.grid[idx] = 'mine';
                placed++;
            }
        }
        console.log("Mines Board Ready");
    },

    checkTile(index) {
        return this.grid[index] === 'mine' ? 'BOOM' : 'SAFE';
    }
};
