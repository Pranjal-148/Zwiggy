// Add to Cart functionality for all menu items
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
          // Get item name and price from the parent .apet-left
          const parent = btn.parentElement;
          const item = parent.querySelector('p').innerText;
          const price = parent.querySelectorAll('p')[1].innerText;
          alert(`${item} (${price}) added to cart!`);
          // Here you can add logic to update cart in localStorage or send to backend
      });
  });
});

// --- Cart Logic ---
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(item) {
  let cart = getCart();
  const existing = cart.find(i => i.name === item.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({...item, qty: 1});
  }
  saveCart(cart);
  updateCartUI();
}
function removeFromCart(name) {
  let cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
  updateCartUI();
}
function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);

  // Dropdown
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalDiv = document.getElementById('cartTotal');
  if (!cartItemsDiv || !cartTotalDiv) return;
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="text-center text-muted py-2">Cart is empty</div>';
    cartTotalDiv.textContent = 'Rs. 0';
    return;
  }
  let total = 0;
  cartItemsDiv.innerHTML = cart.map(item => {
    total += item.qty * item.price;
    return `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">Rs. ${item.price} x ${item.qty}</div>
        </div>
        <button class="cart-item-remove" data-name="${item.name}" title="Remove"><i class="bi bi-trash"></i></button>
      </div>
    `;
  }).join('');
  cartTotalDiv.textContent = `Rs. ${total}`;
  // Remove item event
  cartItemsDiv.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.onclick = () => removeFromCart(btn.dataset.name);
  });
}

// Dropdown show/hide (hover for desktop, click for mobile)
const cartWrapper = document.getElementById('cartDropdownWrapper');
const cartDropdown = document.getElementById('cartDropdown');
const closeCartDropdown = document.getElementById('closeCartDropdown');

function showCartDropdown() {
  cartDropdown.style.display = 'block';
  updateCartUI();
}
function hideCartDropdown() {
  cartDropdown.style.display = 'none';
}

if (cartWrapper && cartDropdown) {
  // Desktop: hover
  cartWrapper.addEventListener('mouseenter', showCartDropdown);
  cartWrapper.addEventListener('mouseleave', hideCartDropdown);
  // Mobile: click to open/close
  cartWrapper.addEventListener('click', function(e) {
    if(window.innerWidth < 700) {
      cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
      updateCartUI();
      e.preventDefault();
    }
  });
}
if (closeCartDropdown) {
  closeCartDropdown.onclick = hideCartDropdown;
}

// Add to cart buttons (for both Bootstrap cards and custom .apet)
// In your add-to-cart event listener:
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = btn.closest('.card, .apet');
      let name, price;
      
      // For Bootstrap cards
      if (card.querySelector('.card-title')) {
        name = card.querySelector('.card-title').innerText;
        const priceText = card.querySelector('.card-text').innerText;
        // Extract FIRST NUMBER from price text
        price = parseInt(priceText.match(/\d+/)[0]); // ← FIX IS HERE
      } 
      // For custom .apet layout
      else {
        name = card.querySelector('p').innerText;
        const priceText = card.querySelectorAll('p')[1].innerText;
        // Extract FIRST NUMBER from price text
        price = parseInt(priceText.match(/\d+/)[0]); // ← AND HERE
      }
      
      addToCart({name, price});
    });
  });
  updateCartUI();
});

// Cart Rendering & Payment Logic ---
const CART_KEY = 'food_cart_items';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  if (!cart.length) {
    cartList.innerHTML = '<div class="text-muted text-center">Your cart is empty.</div>';
    cartTotal.textContent = 'Rs. 0';
    return;
  }
  let total = 0;
  cartList.innerHTML = cart.map(item => {
    const itemTotal = item.qty * item.price;
    total += itemTotal;
    return `
      <div class="cart-item-row">
        <div>
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-meta">x ${item.qty}</span>
        </div>
        <div>Rs. ${itemTotal}</div>
      </div>
    `;
  }).join('');
  cartTotal.textContent = `Rs. ${total}`;
}

// Payment form validation and fake payment
document.addEventListener('DOMContentLoaded', function() {
  renderCart();

  const form = document.getElementById('paymentForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('cardName').value.trim();
      const number = document.getElementById('cardNumber').value.trim();
      const expiry = document.getElementById('cardExpiry').value.trim();
      const cvv = document.getElementById('cardCvv').value.trim();

      if (!name || !/^\d{4} \d{4} \d{4} \d{4}$/.test(number) ||
          !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ||
          !/^\d{3}$/.test(cvv)) {
        alert('Please enter valid payment details.');
        return;
      }

      // Simulate payment processing
      form.style.display = 'none';
      document.getElementById('orderSuccess').style.display = 'block';
      clearCart();
    });
  }
});


