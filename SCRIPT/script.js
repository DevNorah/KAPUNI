document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

const cart = [];

async function initializeApp() {
    try {
       const products = await fetchData('https://fakestoreapi.com/products');
       const categories = await fetchData('https://fakestoreapi.com/products/categories');
        displayProducts(products);
        displayCategories(categories);
        setupCartModal();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching data from ${url}`);
    return response.json();
}

function displayCategories(categories) {
    const categoryDropdown = document.querySelector('#product-categories');
    categories.forEach(category => {
        const categoryLink = createElement('a', { href: '#', textContent: capitalize(category) });
        categoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            filterProductsByCategory(category);
        });
        categoryDropdown.appendChild(categoryLink);
    });
}

async function filterProductsByCategory(category) {
    try {
        const products = await fetchData(`https://fakestoreapi.com/products/category/${category}`);
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
    }
}

function displayProducts(products) {
    const productsContainer = document.querySelector('#products-container');
    productsContainer.innerHTML = ''; 
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

function createProductCard(product) {
    const productCard = createElement('div', { className: 'product-card' });

    const productImage = createElement('img', { src: product.image });
    const productTitle = createElement('h3', { textContent: product.title });
    const productPrice = createElement('p', { className: 'productPrice', textContent: `$${product.price}` });
    const addToCartButton = createElement('button', { className: 'add-to-cart', innerHTML: '<i class="fa fa-shopping-cart"></i> Add to Cart' });
    addToCartButton.addEventListener('click', () => addToCart(product));

    appendChildren(productCard, [productImage, productTitle, productPrice, addToCartButton]);

    return productCard;
}

function addToCart(product) {
    cart.push(product);
    updateCartCounter();
    updateCartView();
}

function updateCartCounter() {
    document.querySelector('#cart-counter').textContent = cart.length;
}

function updateCartView() {
    const cartItems = document.querySelector('#cart-items');
    cartItems.innerHTML = '';

    cart.forEach((product, index) => {
        const cartItem = createElement('li', { className: 'cart-item' });

        const itemInfo = createElement('span', { textContent: `${product.title} - $${product.price}` });
        const removeButton = createElement('button', { textContent: 'Remove' });
        removeButton.addEventListener('click', () => removeFromCart(index));

        appendChildren(cartItem, [itemInfo, removeButton]);
        cartItems.appendChild(cartItem);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCounter();
    updateCartView();
}

function setupCartModal() {
    const cartIcon = document.querySelector('#cart-icon');
    const modal = document.querySelector('#cart-modal');
    const closeBtn = document.querySelector('.close');

    cartIcon.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

//search for products
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
//sort products
document.getElementById('sort-select').addEventListener('change', (e) => {
    const sortValue = e.target.value;
    const productsContainer = document.getElementById('products-container');
    let products = Array.from(productsContainer.children);

    if (sortValue === 'price-asc') {
        products.sort((a, b) => parseFloat(a.querySelector('.productPrice').textContent.substring(1)) - parseFloat(b.querySelector('.productPrice').textContent.substring(1)));
    } else if (sortValue === 'price-desc') {
        products.sort((a, b) => parseFloat(b.querySelector('.productPrice').textContent.substring(1)) - parseFloat(a.querySelector('.productPrice').textContent.substring(1)));
    } else if (sortValue === 'name-asc') {
        products.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
    } else if (sortValue === 'name-desc') {
        products.sort((a, b) => b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
    }

    products.forEach(product => productsContainer.appendChild(product));
});


function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => element[key] = attributes[key]);
    return element;
}

function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}