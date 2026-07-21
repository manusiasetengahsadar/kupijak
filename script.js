// script.js — database keranjang & interaksi

// ---------- DATABASE KERANJANG (simulasi) ----------
// Struktur: array of objects { id, name, price, quantity, image }
let cart = [];

// Data produk (menu kopi)
const products = [
  { id: 1, name: 'Arabica Gayo', price: 85000, image: 'https://images.unsplash.com/photo-1518087428614-5afea0a2dddd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Asli Aceh, rasa fruity' },
  { id: 2, name: 'Robusta Flores', price: 72000, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Bold & earthy' },
  { id: 3, name: 'Kintamani Bali', price: 95000, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Seimbang, citrus' },
  { id: 4, name: 'Toraja Sapan', price: 110000, image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Kompleks, herbal' },
];

// DOM references
const produkGrid = document.getElementById('produkGrid');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartBadge = document.getElementById('cartBadge');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const checkoutBtn = document.getElementById('checkoutBtn');

// ---------- RENDER PRODUK ----------
function renderProducts() {
  produkGrid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'produk-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <div class="price">Rp ${p.price.toLocaleString()}</div>
      <div class="desc">${p.desc}</div>
      <button class="btn-add" data-id="${p.id}"><i class="fas fa-plus"></i> Tambah</button>
    `;
    produkGrid.appendChild(card);
  });

  // event listener untuk tombol tambah
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });
}

// ---------- KERANJANG: TAMBAH / KURANG / HAPUS ----------
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
  // efek animasi ringan (opsional)
  cartIcon.style.transform = 'scale(1.2)';
  setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
}

function removeFromCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    if (existing.quantity > 1) {
      existing.quantity -= 1;
    } else {
      cart = cart.filter(item => item.id !== id);
    }
  }
  updateCartUI();
}

function deleteItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

// ---------- UPDATE UI KERANJANG ----------
function updateCartUI() {
  // badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;

  // render items di sidebar
  cartItemsEl.innerHTML = '';
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div style="text-align:center; color:#8a7a6a; padding:2rem 0;">Keranjang kosong</div>`;
  } else {
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">Rp ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-id="${item.id}" data-action="dec">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
          <button class="qty-btn" data-id="${item.id}" data-action="del" style="background:#f2d5c7; margin-left:6px;"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    // event untuk tombol qty
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        if (action === 'inc') {
          const product = products.find(p => p.id === id);
          if (product) addToCart(product);
        } else if (action === 'dec') {
          removeFromCart(id);
        } else if (action === 'del') {
          deleteItem(id);
        }
      });
    });
  }

  // total harga
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalPrice.textContent = `Rp ${total.toLocaleString()}`;
}

// ---------- TOGGLE SIDEBAR ----------
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartIcon.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ---------- CHECKOUT (simulasi) ----------
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Keranjang kosong, tambahkan kopi dulu!');
    return;
  }
  alert('Terima kasih! Pesananmu sedang diproses ☕');
  cart = [];
  updateCartUI();
  closeCart();
});

// ---------- INIT ----------
renderProducts();
updateCartUI();