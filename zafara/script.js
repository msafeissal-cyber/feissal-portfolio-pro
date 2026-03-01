// Fade-in sections
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// Cart logic
let cart = [];
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", e => {
        const card = e.target.closest(".product-card");
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        cart.push({name, price});
        updateCart();
    });
});

function updateCart() {
    cartCount.textContent = `(${cart.length})`;
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item, i) => {
        total += item.price;
        const div = document.createElement("div");
        div.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(div);
    });
    totalPrice.textContent = `Total: $${total}`;
}

document.getElementById("checkout").addEventListener("click", () => {
    if(cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for shopping at ZAFARA! Your total is $" + cart.reduce((sum,i)=>sum+i.price,0));
        cart = [];
        updateCart();
    }
}); 
