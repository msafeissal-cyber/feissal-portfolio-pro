let count = 0;

const buttons = document.querySelectorAll(".cart-btn");
const counter = document.getElementById("count");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        count++;
        counter.textContent = count;
        alert("Added to cart!");
    });
}); 
