/**
 * ADAMAS MINES - CASINO ENGINE
 * Implementation: Random Seed Distribution
 */
export const minesEngine = {
    gameState: {
        active: false,
        board: [],
        bet: 0,
        revealed: []
    },

    init(mineCount = 3) {
        this.gameState.active = true;
        this.gameState.revealed = [];
        this.gameState.board = Array(25).fill('diamond');
        
        let placed = 0;
        while (placed < mineCount) {
            let pos = Math.floor(Math.random() * 25);
            if (this.board[pos] !== 'mine') {
                this.board[pos] = 'mine';
                placed++;
            }
        }
        console.log("Board Encrypted. Game Ready.");
    },

    selectTile(index) {
        if (!this.gameState.active || this.gameState.revealed.includes(index)) return null;
        
        this.gameState.revealed.push(index);
        const result = this.gameState.board[index];
        
        if (result === 'mine') {
            this.gameState.active = false;
            return { status: 'BUST', board: this.gameState.board };
        }
        return { status: 'SAFE', multiplier: this.calculateMultiplier() };
    },

    calculateMultiplier() {
        const count = this.gameState.revealed.length;
        return (count * 1.45).toFixed(2); // Dynamic Multiplier Logic
    }
};
