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

// Card images
const cardImages = [
    "https://img.icons8.com/color/48/000000/apple.png",
    "https://img.icons8.com/color/48/000000/banana.png",
    "https://img.icons8.com/color/48/000000/grapes.png",
    "https://img.icons8.com/color/48/000000/watermelon.png",
    "https://img.icons8.com/color/48/000000/orange.png",
    "https://img.icons8.com/color/48/000000/strawberry.png"
];

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return; // matched cards cannot flip

    this.classList.add('flipped');

    // Show image on the back
    const back = this.querySelector('.card-back');
    back.innerHTML = `<img src="${this.dataset.img}" style="width:50px;height:50px;">`;

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
let pairedImages = [...cardImages, ...cardImages];
pairedImages = pairedImages.sort(() => 0.5 - Math.random());

cardDivs.forEach((card, index) => {
    card.dataset.name = index % cardImages.length;
    card.dataset.img = pairedImages[index];
    card.addEventListener('click', flipCard);
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
        // Optional: play win sound
        // new Audio('https://www.myinstants.com/media/sounds/tada.mp3').play();
    }
}

// Restart
restartBtn.addEventListener('click', () => {
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.querySelector('.card-back').innerHTML = "";
    });
    moves = 0;
    movesCounter.textContent = moves;
    time = 0;
    timerDisplay.textContent = time;
    winMessage.classList.add('hidden');
    timerInterval = null;
    pairedImages = pairedImages.sort(() => 0.5 - Math.random());
    cardDivs.forEach((card, index) => {
        card.dataset.name = index % cardImages.length;
        card.dataset.img = pairedImages[index];
    });
}); 
