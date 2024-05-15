let levels = [];
let currentLevel = 0;
let board = [];
let moves = 0;
let startTime;
let timerInterval;
let gameStarted = false;
const boardElement = document.getElementById('gameBoard');
const movesCounterElement = document.getElementById('movesCounter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const levelSelect = document.getElementById('levelSelect');
const startButton = document.getElementById('startButton');

function loadLevels() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'levels.json', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            levels = JSON.parse(xhr.responseText);
            populateLevelSelect();
            init();
        } else {
            console.error('Error loading levels:', xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error('Error loading levels');
    };

    xhr.send();
}

function populateLevelSelect() {
    levelSelect.innerHTML = '';
    levels.forEach((level, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Level ${index + 1}`;
        levelSelect.appendChild(option);
    });
}

function init() {
    board = [...levels[currentLevel].board];
    renderBoard();
    moves = 0;
    updateMovesCounter();
    clearTimer();
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell' + (board[i] ? ' on' : '');
        if (gameStarted) {
            cell.addEventListener('click', () => toggleCell(i));
        }
        boardElement.appendChild(cell);
    }
}

function toggleCell(index) {
    board[index] = 1 - board[index];
    const neighbors = [
        index - 5, index + 1, index + 5, index - 1
    ].filter(i => i >= 0 && i < 25 && (i % 5 !== 0 || i === index - 1) && (i % 5 !== 4 || i === index + 1));
    for (const neighbor of neighbors) {
        board[neighbor] = 1 - board[neighbor];
    }
    renderBoard();
    moves++;
    updateMovesCounter();
    checkWin();
}

function updateMovesCounter() {
    movesCounterElement.textContent = `Moves: ${moves}`;
}

function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    timerElement.textContent = `Time: ${seconds}`;
}

function clearTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = 'Time: 0';
}

function checkWin() {
    if (board.every(cell => cell === 0)) {
        clearTimer();
        if (moves === levels[currentLevel].minMoves) {
            alert(`Congratulations! You won in ${moves} moves!`);
        } else {
            alert(`You won, but not in the minimum number of moves (${levels[currentLevel].minMoves}).`);
        }
        currentLevel = (currentLevel + 1) % levels.length;
        init();
    }
}

resetButton.addEventListener('click', init);
levelSelect.addEventListener('change', () => {
    currentLevel = parseInt(levelSelect.value);
    init();
});
startButton.addEventListener('click', () => {
    gameStarted = true;
    startTimer();
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => toggleCell(Array.from(cells).indexOf(cell)));
    });
});

loadLevels();
