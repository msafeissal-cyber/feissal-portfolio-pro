const target = document.getElementById("target");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");

let score = 0;
let timeLeft = 15;
let moveSpeed = 800;
let gameInterval;
let timerInterval;

function moveTarget() {
    const maxX = gameArea.clientWidth - target.clientWidth;
    const maxY = gameArea.clientHeight - target.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
}

function startGame() {
    score = 0;
    timeLeft = 15;
    moveSpeed = 800;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    target.style.display = "block";
    startBtn.style.display = "none";

    moveTarget();

    gameInterval = setInterval(() => {
        moveTarget();
        if (moveSpeed > 300) {
            moveSpeed -= 20; // gets faster over time
            clearInterval(gameInterval);
            gameInterval = setInterval(moveTarget, moveSpeed);
        }
    }, moveSpeed);

    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    target.style.display = "none";
    startBtn.style.display = "inline-block";
    startBtn.textContent = "Play Again";
}

target.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    moveTarget();
});

startBtn.addEventListener("click", startGame); 
