
let cardPaths = [];
for (let i = 1; i <= 36; i++) {
  cardPaths.push(`./images/pair${i}_a.png`);
  cardPaths.push(`./images/pair${i}_b.png`);
}

let flipped = [];
let matched = [];
let moves = 0;
let timer = 0;
let interval;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  timer = 0;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `Time: ${timer}s`;
  }, 1000);
}

function restartGame() {
  document.getElementById("game-board").innerHTML = "";
  flipped = [];
  matched = [];
  moves = 0;
  document.getElementById("moves").textContent = "Moves: 0";
  startTimer();
  buildBoard();
}

function buildBoard() {
  let board = document.getElementById("game-board");
  shuffle(cardPaths).forEach((src, index) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;

    let inner = document.createElement("div");
    inner.classList.add("card-inner");

    let front = document.createElement("div");
    front.classList.add("card-front");
    front.style.backgroundImage = `url('${src}')`;

    let back = document.createElement("div");
    back.classList.add("card-back");

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    board.appendChild(card);

    card.addEventListener("click", () => handleFlip(card, src));
  });
}

function handleFlip(card, src) {
  if (flipped.length >= 2 || card.classList.contains("flipped") || matched.includes(src)) return;
  card.classList.add("flipped");
  flipped.push({ card, src });

  if (flipped.length === 2) {
    moves++;
    document.getElementById("moves").textContent = `Moves: ${moves}`;
    const [first, second] = flipped;

    if (first.src.slice(0, -6) === second.src.slice(0, -6)) {
      matched.push(first.src, second.src);
      flipped = [];

      if (matched.length === cardPaths.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (confirm(`Congratulations! You won in ${moves} moves and ${timer} seconds. Play again?`)) {
            restartGame();
          }
        }, 500);
      }
    } else {
      setTimeout(() => {
        first.card.classList.remove("flipped");
        second.card.classList.remove("flipped");
        flipped = [];
      }, 800);
    }
  }
}

window.onload = () => {
  startTimer();
  buildBoard();
};
