const box = document.getElementById("colorBox");
const message = document.getElementById("message");
const button = document.getElementById("restartBtn");

let startTime;
let timeout;

function startGame() {
    box.style.backgroundColor = "red";
    message.textContent = "Wait for green...";
    box.style.pointerEvents = "none";

    const randomTime = Math.floor(Math.random() * 3000) + 2000;

    timeout = setTimeout(() => {
        box.style.backgroundColor = "green";
        message.textContent = "CLICK NOW!";
        startTime = Date.now();
        box.style.pointerEvents = "auto";
    }, randomTime);
}

box.addEventListener("click", () => {
    if (box.style.backgroundColor === "green") {
        const reactionTime = Date.now() - startTime;
        message.textContent = `Your reaction time: ${reactionTime} ms`;
    } else {
        clearTimeout(timeout);
        message.textContent = "Too soon! Wait for green.";
    }
});

button.addEventListener("click", startGame);

startGame();
