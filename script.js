const gameContainer = document.getElementById('game');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
const scoreBody = document.getElementById('score-body');

let flipped = [];
let lockBoard = false;
let matchedCount = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let playerName = '';

function startTimer() {
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateMoves() {
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;
}

function createCard(image) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.image = image;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front" style="background-image: url('images/${image}')"></div>
      <div class="card-back"></div>
    </div>
  `;

card.addEventListener('click', () => flipCard(card));

  return card;
}

function flipCard(card) {
  if (lockBoard || card.classList.contains('matched') || flipped.includes(card)) return;

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    updateMoves();

    const [card1, card2] = flipped;
    const img1 = card1.dataset.image.replace(/_a|_b/, '');
    const img2 = card2.dataset.image.replace(/_a|_b/, '');

    if (img1 === img2) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      flipped = [];
      lockBoard = false;
      matchedCount++;

      if (matchedCount === 36) {
        stopTimer();
        setTimeout(() => {
          alert(`You won in ${moves} moves and ${timer} seconds!`);
        }, 300);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flipped = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

function initGame() {
  if (!playerName) {
    playerName = prompt("Enter your nickname:");
    if (!playerName || playerName.trim() === "") {
      playerName = "Player";
    }
  }

  gameContainer.innerHTML = '';
  moves = 0;
  matchedCount = 0;
  flipped = [];
  lockBoard = false;
  movesDisplay.textContent = 'Moves: 0';
  timerDisplay.textContent = 'Time: 0s';
  stopTimer();

  const images = [];
  for (let i = 1; i <= 36; i++) {
    images.push(`pair${i}_a.png`);
    images.push(`pair${i}_b.png`);
  }

  // Shuffle
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  images.forEach(img => {
    gameContainer.appendChild(createCard(img));
  });

  startTimer();
}

function showScoreboard() {
  const allScores = JSON.parse(localStorage.getItem('pexesoScores') || '[]');
  scoreBody.innerHTML = '';
  allScores.forEach(score => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${score.name}</td><td>${score.moves}</td><td>${score.time}</td>`;
    scoreBody.appendChild(row);
  });
}

restartBtn.addEventListener('click', initGame);

initGame();
showScoreboard();
