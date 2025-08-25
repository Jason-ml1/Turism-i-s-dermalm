// En lista för att spara varukorgsprodukter
let cart = [];

function addToCart(productName) {
    cart.push(productName);
    alert(`${productName} har lagts till i varukorgen.`);
    console.log('Varukorg:', cart);
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Tack för ditt meddelande, ${name}! Vi återkommer till dig på ${email}.`);
    // Kan också lägga till kod för att skicka formuläret till en server
    this.reset();
});
