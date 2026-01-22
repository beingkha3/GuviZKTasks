const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");

// Modal elements
const resultModal = document.getElementById("resultModal");
const modalTitle = document.getElementById("modalTitle");
const modalStats = document.getElementById("modalStats");
const playAgainBtn = document.getElementById("playAgainBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// Instructions modal
const instructionsModal = document.getElementById("instructionsModal");
const startGameBtn = document.getElementById("startGameBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerId = null;

const symbols = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥝", "🍉"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  timerId = setInterval(() => {
    timer++;
    timerEl.textContent = "Time: " + formatTime(timer);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function createCard(symbol) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.symbol = symbol;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">?</div>
      <div class="card-face card-back">${symbol}</div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    if (moves === 0 && !timerId) startTimer();
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = "Moves: " + moves;

  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    resetTurn();

    if (matches === symbols.length) {
      stopTimer();
      setTimeout(() => showResultModal(), 500);
    }
  } else {
    lockBoard = true;
    // Add shake class for visual feedback
    firstCard.classList.add("shake");
    secondCard.classList.add("shake");

    setTimeout(() => {
      firstCard.classList.remove("flipped", "shake");
      secondCard.classList.remove("flipped", "shake");
      resetTurn();
    }, 700);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function initGame() {
  board.innerHTML = "";
  moves = 0;
  matches = 0;
  timer = 0;
  movesEl.textContent = "Moves: 0";
  timerEl.textContent = "Time: 00:00";
  stopTimer();
  timerId = null;

  const deck = shuffle([...symbols, ...symbols]);
  deck.forEach(symbol => board.appendChild(createCard(symbol)));
}

// Modal helpers
function showResultModal() {
  if (!resultModal) return;
  
  // Trigger Confetti!
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#22d3ee', '#ffffff']
  });

  modalTitle.textContent = "Victory!";
  modalStats.textContent = `Completed in ${moves} moves and ${formatTime(timer)}`;
  resultModal.classList.add("open");
  resultModal.setAttribute("aria-hidden", "false");
}

function closeResultModal() {
  if (!resultModal) return;
  resultModal.classList.remove("open");
  resultModal.setAttribute("aria-hidden", "true");
}

function closeInstructionsModal() {
  if (!instructionsModal) return;
  instructionsModal.classList.remove("open");
  instructionsModal.setAttribute("aria-hidden", "true");
  initGame(); // Start the game after closing instructions
}

// Modal events
if (playAgainBtn) playAgainBtn.addEventListener("click", () => { closeResultModal(); initGame(); });
if (closeModalBtn) closeModalBtn.addEventListener("click", closeResultModal);
if (startGameBtn) startGameBtn.addEventListener("click", closeInstructionsModal);

// Close modal on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (instructionsModal && instructionsModal.classList.contains("open")) {
      closeInstructionsModal();
    } else {
      closeResultModal();
    }
  }
});

// Click outside to close
if (resultModal) {
  resultModal.addEventListener("click", (e) => {
    if (e.target === resultModal) closeResultModal();
  });
}
if (instructionsModal) {
  instructionsModal.addEventListener("click", (e) => {
    if (e.target === instructionsModal) closeInstructionsModal();
  });
}

restartBtn.addEventListener("click", initGame);

// Show instructions on load
if (instructionsModal) {
  instructionsModal.classList.add("open");
  instructionsModal.setAttribute("aria-hidden", "false");
}
