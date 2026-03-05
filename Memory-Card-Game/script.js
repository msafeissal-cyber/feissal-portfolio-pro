const board = document.getElementById("board");
const restartBtn = document.getElementById("restart");

const emojis = ["🍎","🍌","🍇","🍉","🍎","🍌","🍇","🍉"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array){
return array.sort(()=>0.5-Math.random());
}

function createBoard(){

board.innerHTML="";

let shuffled = shuffle([...emojis]);

shuffled.forEach(emoji=>{

let card=document.createElement("div");
card.classList.add("card");
card.dataset.emoji=emoji;

card.addEventListener("click",flipCard);

board.appendChild(card);

});

}

function flipCard(){

if(lockBoard) return;
if(this===firstCard) return;

this.textContent=this.dataset.emoji;
this.classList.add("flipped");

if(!firstCard){

firstCard=this;
return;

}

secondCard=this;
lockBoard=true;

checkMatch();

}

function checkMatch(){

if(firstCard.dataset.emoji===secondCard.dataset.emoji){

resetTurn();

}else{

setTimeout(()=>{

firstCard.textContent="";
secondCard.textContent="";

firstCard.classList.remove("flipped");
secondCard.classList.remove("flipped");

resetTurn();

},1000);

}

}

function resetTurn(){

[firstCard,secondCard,lockBoard]=[null,null,false];

}

restartBtn.addEventListener("click",createBoard);

createBoard();
