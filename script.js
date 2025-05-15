const gameContainer = document.getElementById('game');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart');

let flipped = [];
let lockBoard = false;
let matchedCount = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCard(src) {
  const card = document.createElement('div');
  card.className = 'card';

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const front = document.createElement('div');
  front.className = 'card-front';
  front.style.backgroundImage = `url('./images/${src}')`;

  const back = document.createElement('div');
  back.className = 'card-back';

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.dataset.image = src;

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
  // Clear board and reset stats
  gameContainer.innerHTML = '';
  moves = 0;
  matchedCount = 0;
  flipped = [];
  lockBoard = false;
  movesDisplay.textContent = 'Moves: 0';
  timerDisplay.textContent = 'Time: 0s';
  stopTimer();

  // Prepare card image names
  const cardPaths = [];
  for (let i = 1; i <= 36; i++) {
    cardPaths.push(`pair${i}_a.png`);
    cardPaths.push(`pair${i}_b.png`);
  }

  shuffle(cardPaths);

  // Create and append cards
  cardPaths.forEach(src => {
    const card = createCard(src);
    gameContainer.appendChild(card);
  });

  startTimer();
}

restartBtn.addEventListener('click', initGame);

// Start game initially
initGame();
