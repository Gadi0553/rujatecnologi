// Variables globales
const currentState = {
    product: null,
    cart: []
};

// Inicialización de eventos
document.addEventListener('DOMContentLoaded', () => {
    initializeSearchBar();
    initializeHeroImages();
    loadCart();
    updateCartCounter();
    
    if (window.location.pathname.includes('carrito.html')) {
        displayCartItems();
    }
});

// Funciones de búsqueda
function initializeSearchBar() {
    const searchBar = document.getElementById('search-bar');
    const products = document.querySelectorAll('.product');
    
    searchBar?.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productDescription = product.querySelector('p').textContent.toLowerCase();
            
            product.style.display = 
                productName.includes(query) || productDescription.includes(query) 
                    ? 'block' 
                    : 'none';
        });
    });
}

// Funciones de imágenes hero
function initializeHeroImages() {
    const images = document.querySelectorAll(".hero img");
    images.forEach(img => {
        img.addEventListener("load", () => img.classList.add("loaded"));
    });
}

// Funciones del modal de producto
function showProductModal(imageUrl, title, description, price) {
    currentState.product = { image: imageUrl, title, description, price };
    
    const modal = document.getElementById('productModal');
    const modalElements = {
        image: document.getElementById('modalImage'),
        title: document.getElementById('modalTitle'),
        description: document.getElementById('modalDescription'),
        price: document.getElementById('modalPrice'),
        whatsapp: document.getElementById('whatsappLink')
    };
    
    // Actualizar elementos del modal
    modalElements.image.src = imageUrl;
    modalElements.title.textContent = title;
    modalElements.description.textContent = description;
    modalElements.price.textContent = price;
    
    // Actualizar enlace de WhatsApp
    const message = `Hola, estoy interesado en: ${title} - ${description} (${price})`;
    modalElements.whatsapp.href = `https://wa.me/18094784211?text=${encodeURIComponent(message)}`;
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    currentState.product = null;
}

// Funciones del carrito
function loadCart() {
    currentState.cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(currentState.cart));
    updateCartCounter();
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        cartCounter.textContent = currentState.cart.length;
    }
}

function addToCart() {
    if (!currentState.product) return;
    
    const cartItem = {
        id: Date.now(),
        ...currentState.product,
        quantity: 1
    };
    
    currentState.cart.push(cartItem);
    saveCart();
    alert('Producto agregado al carrito');
    closeProductModal();
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (currentState.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>No hay productos en el carrito</p>';
        return;
    }
    
    let total = 0;
    const cartHTML = generateCartHTML(total);
    cartItemsContainer.innerHTML = cartHTML;
}

function generateCartHTML(total) {
    let cartHTML = '<div class="cart-items">';
    
    currentState.cart.forEach(item => {
        const price = parseFloat(item.price.replace('RD$', '').replace(',', ''));
        total += price * item.quantity;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="remove-item">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        </div>
        <div class="cart-total">
            <h3>Total: RD$${total.toFixed(2)}</h3>
            <button onclick="checkout()" class="checkout-button">Proceder al pago</button>
        </div>
    `;
    
    return cartHTML;
}

function updateQuantity(itemId, change) {
    const itemIndex = currentState.cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        currentState.cart[itemIndex].quantity = Math.max(1, currentState.cart[itemIndex].quantity + change);
        saveCart();
        displayCartItems();
    }
}

function removeFromCart(itemId) {
    currentState.cart = currentState.cart.filter(item => item.id !== itemId);
    saveCart();
    displayCartItems();
}

function checkout() {
    if (currentState.cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const message = generateCheckoutMessage();
    window.location.href = `https://wa.me/18094784211?text=${encodeURIComponent(message)}`;
}

function generateCheckoutMessage() {
    let message = 'Hola, me gustaría comprar los siguientes productos:\n\n';
    let total = 0;
    
    currentState.cart.forEach(item => {
        const price = parseFloat(item.price.replace('RD$', '').replace(',', ''));
        total += price * item.quantity;
        message += `${item.title} - ${item.description}\n`;
        message += `Cantidad: ${item.quantity}\n`;
        message += `Precio: ${item.price}\n\n`;
    });
    
    message += `Total: RD$${total.toFixed(2)}`;
    return message;
}