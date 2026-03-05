const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Use image URLs for cards
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

    this.classList.add('flipped');

    // Show image when flipped
    const img = document.createElement('img');
    img.src = this.dataset.img;
    img.style.width = "50px";
    img.style.height = "50px";
    this.innerHTML = "";
    this.appendChild(img);

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        resetBoard();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerHTML = "";
            secondCard.innerHTML = "";
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Assign images to cards
const cardDivs = Array.from(cards);
let pairedImages = [...cardImages, ...cardImages]; // duplicate for pairs
pairedImages = pairedImages.sort(() => 0.5 - Math.random());

cardDivs.forEach((card, index) => {
    card.dataset.name = index % cardImages.length; // match pairs
    card.dataset.img = pairedImages[index];
    card.addEventListener('click', flipCard);
}); 
