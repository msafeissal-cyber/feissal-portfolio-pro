const box = document.getElementById("box");
const message = document.getElementById("message");
const result = document.getElementById("result");
const restart = document.getElementById("restart");

let startTime;
let timeout;
let ready = false;

function startGame() {
    message.textContent = "Wait for green...";
    result.textContent = "";
    box.style.background = "red";
    ready = false;

    const randomTime = Math.random() * 3000 + 2000;

    timeout = setTimeout(() => {
        box.style.background = "green";
        message.textContent = "CLICK NOW!";
        startTime = Date.now();
        ready = true;
    }, randomTime);
}

box.addEventListener("click", () => {
    if (!ready) {
        clearTimeout(timeout);
        message.textContent = "Too soon! Wait for green.";
        box.style.background = "red";
    } else {
        const reactionTime = Date.now() - startTime;
        result.textContent = `Your reaction time: ${reactionTime} ms`;
        ready = false;
    }
});

restart.addEventListener("click", startGame);

startGame();
