class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = '2p'; // '2p' or 'ai'
        this.initializeGame();
        this.updateGameModeIndicator('2p');
    }

    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.resetButton = document.getElementById('reset');
        this.twoPlayerButton = document.getElementById('two-player');
        this.aiPlayerButton = document.getElementById('ai-player');

        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.twoPlayerButton.addEventListener('click', () => this.setGameMode('2p'));
        this.aiPlayerButton.addEventListener('click', () => this.setGameMode('ai'));
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.updateGameModeIndicator(mode);
        this.resetGame();
    }

    updateGameModeIndicator(mode) {
        // Remove active class from all buttons
        const buttons = document.querySelectorAll('.game-mode button');
        buttons.forEach(button => button.classList.remove('active'));

        // Add active class to selected mode
        if (mode === '2p') {
            document.getElementById('two-player').classList.add('active');
        } else {
            document.getElementById('ai-player').classList.add('active');
        }

        // Update status text to show current mode
        const modeText = mode === '2p' ? '2 Players' : 'vs AI';
        this.statusDisplay.textContent = `Mode: ${modeText} - Player X's turn`;
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        if (this.board[index] === '' && this.gameActive) {
            this.makeMove(index);

            if (this.gameMode === 'ai' && this.gameActive && this.currentPlayer === 'O') {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        
        if (this.checkWin()) {
            const winningCombination = this.getWinningCombination();
            this.drawWinningLine(winningCombination);
            const modeText = this.gameMode === '2p' ? '2 Players' : 'vs AI';
            this.statusDisplay.textContent = `Mode: ${modeText} - Player ${this.currentPlayer} wins!`;
            this.gameActive = false;
            return;
        }

        if (this.checkDraw()) {
            const modeText = this.gameMode === '2p' ? '2 Players' : 'vs AI';
            this.statusDisplay.textContent = `Mode: ${modeText} - Game ended in a draw!`;
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        const modeText = this.gameMode === '2p' ? '2 Players' : 'vs AI';
        this.statusDisplay.textContent = `Mode: ${modeText} - Player ${this.currentPlayer}'s turn`;
    }

    makeAIMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);

        if (availableMoves.length > 0) {
            // Simple AI: randomly select an available cell
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            const moveIndex = availableMoves[randomIndex];
            this.makeMove(moveIndex);
        }
    }

    checkWin() {
        return this.getWinningCombination().length > 0;
    }

    checkDraw() {
        return !this.board.includes('');
    }

    resetGame() {
        const board = document.getElementById('board');
        const lines = board.querySelectorAll('.winning-line');
        lines.forEach(line => line.remove());
        
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
            cell.removeAttribute('data-value');
            cell.style.animation = '';
        });
        const modeText = this.gameMode === '2p' ? '2 Players' : 'vs AI';
        this.statusDisplay.textContent = `Mode: ${modeText} - Player ${this.currentPlayer}'s turn`;
    }

    getWinningCombination() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return combination;
            }
        }
        return [];
    }

    drawWinningLine(combination) {
        const [a, b, c] = combination;
        const board = document.getElementById('board');
        const line = document.createElement('div');
        line.className = 'winning-line';

        // Convert combination array to string for comparison
        const combinationStr = combination.toString();

        // Determine line type and position
        if (a % 3 === 0 && b % 3 === 1 && c % 3 === 2) {
            // Horizontal line
            line.classList.add('horizontal-line');
            line.style.top = `${Math.floor(a / 3) * 33.33 + 16.5}%`;
            line.style.left = '10px';
        } else if (a < 3 && b >= 3 && b < 6 && c >= 6) {
            // Vertical line
            line.classList.add('vertical-line');
            line.style.left = `${(a % 3) * 33.33 + 16.5}%`;
            line.style.top = '10px';
        } else if (combinationStr === "0,4,8") {
            // Diagonal from top-left to bottom-right
            line.classList.add('diagonal-line', 'diagonal-right');
            line.style.top = '0';
            line.style.left = '0';
        } else if (combinationStr === "2,4,6") {
            // Diagonal from top-right to bottom-left
            line.classList.add('diagonal-line', 'diagonal-left');
            line.style.top = '0';
            line.style.right = '0';
        }

        board.appendChild(line);
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 