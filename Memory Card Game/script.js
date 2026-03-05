const emojis = ["🍎","🍌","🍇","🍉","🍎","🍌","🍇","🍉"];

let shuffled = emojis.sort(() => 0.5 - Math.random());

const board = document.getElementById("board");

let firstCard = null;
let secondCard = null;

shuffled.forEach((emoji) => {

let card = document.createElement("div");
card.classList.add("card");
card.dataset.emoji = emoji;

card.addEventListener("click", () => {

if(card.classList.contains("flipped")) return;

card.textContent = emoji;
card.classList.add("flipped");

if(!firstCard){
firstCard = card;
}
else{
secondCard = card;

if(firstCard.dataset.emoji === secondCard.dataset.emoji){

firstCard = null;
secondCard = null;

}else{

setTimeout(()=>{

firstCard.textContent = "";
secondCard.textContent = "";

firstCard.classList.remove("flipped");
secondCard.classList.remove("flipped");

firstCard = null;
secondCard = null;

},1000);

}

}

});

board.appendChild(card);

});
