const cards = document.querySelectorAll(".card");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let time = 0;
let timerStarted = false;

const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");

const flipSound = new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");
const winSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");

function startTimer() {
  if (timerStarted) return;

  timerStarted = true;

  setInterval(() => {
    time++;
    timerText.textContent = time;
  }, 1000);
}

cards.forEach(card => {

  const back = card.querySelector(".card-back");
  back.textContent = card.dataset.name;

  card.addEventListener("click", flipCard);

});

function flipCard() {

  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  startTimer();

  flipSound.play();

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;

  moves++;
  movesText.textContent = moves;

  checkMatch();
}

function checkMatch() {

  if (firstCard.dataset.name === secondCard.dataset.name) {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    resetBoard();
    checkWin();

  } else {

    lockBoard = true;

    setTimeout(() => {

      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      resetBoard();

    }, 800);
  }
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkWin() {

  const matched = document.querySelectorAll(".matched");

  if (matched.length === cards.length) {

    winSound.play();

    setTimeout(() => {
      alert("🏆 Congratulations! You won!");
    }, 300);
  }
} 
