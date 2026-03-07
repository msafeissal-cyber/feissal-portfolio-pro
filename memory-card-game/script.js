const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

const movesCounter = document.getElementById('moves');
let moves = 0;

const timerDisplay = document.getElementById('timer');
let time = 0;
let timerInterval;

const winMessage = document.getElementById('win-message');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');
const restartBtn = document.getElementById('restart-btn');

// Sounds
const flipSound = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3');
const winSound = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');
    flipSound.play();

    const back = this.querySelector('.card-back');
    back.textContent = this.dataset.name;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        startTimer();
        return;
    }

    secondCard = this;
    checkForMatch();

    moves++;
    movesCounter.textContent = moves;
}

function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Shuffle cards
const cardDivs = Array.from(cards);
cardDivs.sort(() => 0.5 - Math.random()).forEach(card => {
    card.parentNode.appendChild(card);
});

// Timer
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        time++;
        timerDisplay.textContent = time;
    }, 1000);
}

// Check win
function checkWin() {
    const allMatched = [...cards].every(card => card.classList.contains('matched'));
    if (allMatched) {
        clearInterval(timerInterval);
        finalMoves.textContent = moves;
        finalTime.textContent = time;
        winMessage.classList.remove('hidden');
        winSound.play();
    }
}

// Restart
restartBtn.addEventListener('click', () => {
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.querySelector('.card-back').textContent = '';
    });
    moves = 0;
    movesCounter.textContent = moves;
    time = 0;
    timerDisplay.textContent = time;
    winMessage.classList.add('hidden');
    timerInterval = null;

    // Shuffle again
    cardDivs.sort(() => 0.5 - Math.random()).forEach(card => {
        card.parentNode.appendChild(card);
    });
}); 
