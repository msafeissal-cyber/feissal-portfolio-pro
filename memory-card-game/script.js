const grid = document.querySelector(".grid");
const cards = document.querySelectorAll(".card");

let firstCard=null;
let secondCard=null;
let lockBoard=false;

let moves=0;
let time=0;
let timerStarted=false;
let timer;

const movesText=document.getElementById("moves");
const timerText=document.getElementById("timer");
const bestScoreText=document.getElementById("best-score");

const difficulty=document.getElementById("difficulty");

const winMessage=document.getElementById("win-message");
const finalMoves=document.getElementById("final-moves");
const finalTime=document.getElementById("final-time");
const restartBtn=document.getElementById("restart-btn");

const flipSound=new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");
const winSound=new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");


loadBestScore();

cards.forEach(card=>{
card.querySelector(".card-back").textContent=card.dataset.name;
card.addEventListener("click",flipCard);
});


function startTimer(){

if(timerStarted)return;

timerStarted=true;

timer=setInterval(()=>{
time++;
timerText.textContent=time;
},1000);

}


function flipCard(){

if(lockBoard)return;
if(this===firstCard)return;
if(this.classList.contains("matched"))return;

startTimer();

flipSound.play();

this.classList.add("flipped");

if(!firstCard){
firstCard=this;
return;
}

secondCard=this;

moves++;
movesText.textContent=moves;

checkMatch();

}


function checkMatch(){

if(firstCard.dataset.name===secondCard.dataset.name){

firstCard.classList.add("matched");
secondCard.classList.add("matched");

resetBoard();
checkWin();

}else{

lockBoard=true;

setTimeout(()=>{

firstCard.classList.remove("flipped");
secondCard.classList.remove("flipped");

resetBoard();

},800);

}

}


function resetBoard(){

firstCard=null;
secondCard=null;
lockBoard=false;

}


function checkWin(){

const matched=document.querySelectorAll(".matched");

if(matched.length===cards.length){

clearInterval(timer);

winSound.play();

finalMoves.textContent=moves;
finalTime.textContent=time;

saveBestScore();

winMessage.classList.remove("hidden");

}

}


restartBtn.addEventListener("click",resetGame);


function resetGame(){

cards.forEach(card=>{
card.classList.remove("flipped","matched");
});

moves=0;
time=0;
timerStarted=false;

movesText.textContent=0;
timerText.textContent=0;

winMessage.classList.add("hidden");

}


function saveBestScore(){

let best=localStorage.getItem("memoryBest");

if(!best || moves<best){

localStorage.setItem("memoryBest",moves);
bestScoreText.textContent=moves;

}

}
function updateLeaderboard(score){

let scores=JSON.parse(localStorage.getItem("memoryLeaderboard")) || [];

scores.push(score);

scores.sort((a,b)=>a-b);

scores=scores.slice(0,5);

localStorage.setItem("memoryLeaderboard",JSON.stringify(scores));

displayLeaderboard();

}


function displayLeaderboard(){

let scores=JSON.parse(localStorage.getItem("memoryLeaderboard")) || [];

const list=document.getElementById("leaderboard-list");

list.innerHTML="";

scores.forEach(score=>{

let li=document.createElement("li");

li.textContent=score+" moves";

list.appendChild(li);

});

}

displayLeaderboard();

function loadBestScore(){

let best=localStorage.getItem("memoryBest");

if(best){
bestScoreText.textContent=best;
}

} 
