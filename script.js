const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const nameX = document.getElementById('nameX');
const nameO = document.getElementById('nameO');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const dialog = document.getElementById('dialog');
const dialogMessage = document.getElementById('dialogMessage');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let gameMode = '';
let playerNames = { X: 'Player X', O: 'Player O' };
let scores = { X: 0, O: 0 };

// Read mode from URL
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  gameMode = urlParams.get('mode');
  if (gameMode === 'computer') {
    playerNames = { X: 'You', O: 'Computer' };
    nameX.textContent = playerNames.X;
    nameO.textContent = playerNames.O;
    document.getElementById('nameInputs').style.display = 'none';
    startGame();
  } else {
    document.getElementById('nameInputs').style.display = 'block';
    statusText.textContent = "Enter player names";
  }
};

function startGame() {
  const p1 = document.getElementById('player1')?.value.trim();
  const p2 = document.getElementById('player2')?.value.trim();
  if (gameMode === 'friend') {
    if (p1) playerNames.X = p1;
    if (p2) playerNames.O = p2;
    nameX.textContent = playerNames.X;
    nameO.textContent = playerNames.O;
  }

  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => cell.textContent = '');
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `${playerNames[currentPlayer]}'s turn`;
}

function handleClick(event) {
  const index = event.target.getAttribute('data-index');
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner()) {
    scores[currentPlayer]++;
    updateScores();
    showDialog(`${playerNames[currentPlayer]} wins! 🎉`);
    statusText.textContent = `${playerNames[currentPlayer]} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    showDialog(`It's a draw! 🤝`);
    statusText.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${playerNames[currentPlayer]}'s turn`;

  if (gameMode === 'computer' && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  if (!gameActive) return;
  let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  let move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = 'O';
  cells[move].textContent = 'O';

  if (checkWinner()) {
    scores.O++;
    updateScores();
    showDialog(`${playerNames.O} wins! 🎉`);
    statusText.textContent = `${playerNames.O} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    showDialog(`It's a draw! 🤝`);
    statusText.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `${playerNames[currentPlayer]}'s turn`;
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => cell.textContent = '');
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `${playerNames[currentPlayer]}'s turn`;
}

function showDialog(message) {
  dialogMessage.textContent = message;
  dialog.style.display = 'block';
}

function closeDialog() {
  dialog.style.display = 'none';
}

function exitGame() {
  window.location.href = 'index.html';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
