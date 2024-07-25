let products = [];
let allProducts = [];
const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            products = data.categories;
            allProducts = data.categories.flatMap(category => category.category_products.map(product => ({
                ...product,
                category: category.category_name
            })));
            displayAllProducts();
            updateCartCount();
        })
        .catch(error => console.error('Error fetching products:', error));
});

function displayProducts(productsToDisplay) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p><strong>Vendor:</strong> ${product.vendor}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <button onclick="addToCart('${product.title}', '${product.price}', '${product.image}', '${product.vendor}', '${product.category}')">Add to Cart</button>
            <button onclick="buyNow('${product.title}')">Buy Now</button>
        `;
        productList.appendChild(productDiv);
    });
}

function displayAllProducts() {
    displayProducts(allProducts);
}

function filterProducts(category) {
    const filteredProducts = allProducts.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchedProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchInput) ||
        product.vendor.toLowerCase().includes(searchInput) ||
        product.category.toLowerCase().includes(searchInput)
    );
    displayProducts(searchedProducts);
}

function addToCart(title, price, image, vendor, category) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = allProducts.find(p => p.title === title);
    if (product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ title, price: parseFloat(price), image, vendor, category, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${title} has been added to your cart!`);
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLink = document.getElementById('cart-link');
    cartLink.innerText = `Cart (${cart.length})`;
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="100">
            <div>
                <p><strong>${item.title}</strong></p>
                <p>Vendor: ${item.vendor}</p>
                <p>Category: ${item.category}</p>
                <p>Price: $<span class="item-price">${(item.price * item.quantity).toFixed(2)}</span></p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <input type="text" value="${item.quantity}" readonly>
                <button onclick="updateQuantity(${index}, 1)">+</button>
                <button onclick="removeFromCart(${index})" class="remove-button">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemElement);
    });
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity = Math.max((cart[index].quantity || 1) + change, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    displayCartItems();
}

function buyNow(title) {
    alert(`You have chosen to buy ${title} now!`);
    // Add logic to handle immediate purchase if needed
}

// Display cart items on cart.html page load
if (window.location.pathname.endsWith('cart.html')) {
    displayCartItems();
}
