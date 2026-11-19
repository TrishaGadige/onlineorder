const MENU = [
  { id: 1, name: "Classic Smash Burger", category: "Burgers", price: 9.5, emoji: "🍔", desc: "Double beef patty, cheddar, pickles, house sauce." },
  { id: 2, name: "Crispy Chicken Burger", category: "Burgers", price: 10.0, emoji: "🥪", desc: "Buttermilk fried chicken, slaw, spicy mayo." },
  { id: 3, name: "Margherita Pizza", category: "Pizza", price: 12.0, emoji: "🍕", desc: "San Marzano tomato, fresh mozzarella, sweet basil." },
  { id: 4, name: "Pepperoni Feast", category: "Pizza", price: 14.0, emoji: "🍕", desc: "Crispy pepperoni cups, mozzarella, oregano." },
  { id: 5, name: "Teriyaki Rice Bowl", category: "Bowls", price: 11.0, emoji: "🍲", desc: "Jasmine rice, glazed chicken, edamame, sesame." },
  { id: 6, name: "Avocado Grain Bowl", category: "Bowls", price: 10.5, emoji: "🥗", desc: "Quinoa, roasted chickpeas, avocado, lemon tahini." },
  { id: 7, name: "Fresh Lemonade", category: "Drinks", price: 3.5, emoji: "🍋", desc: "Squeezed lemons, cane sugar, chilled mint." },
  { id: 8, name: "Iced Cold Brew", category: "Drinks", price: 4.0, emoji: "🧊", desc: "Slow-steeped arabica coffee over ice." }
];

const DELIVERY_FEE = 2.5;
let activeCategory = "All";
let searchQuery = "";
let cart = [];

const menuGrid = document.getElementById("menuGrid");
const categoryBar = document.getElementById("categoryBar");
const searchInput = document.getElementById("searchInput");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const subtotalEl = document.getElementById("subtotal");
const totalPriceEl = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderConfirmationEl = document.getElementById("orderConfirmation");
const cartDrawer = document.getElementById("cartDrawer");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderMenu() {
  const filtered = MENU.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `<p class="empty-msg">No dishes match your filter.</p>`;
    return;
  }

  menuGrid.innerHTML = filtered
    .map(
      (dish) => `
      <article class="dish-card">
        <div>
          <div class="dish-emoji">${dish.emoji}</div>
          <h3 class="dish-title">${dish.name}</h3>
          <p class="dish-desc">${dish.desc}</p>
        </div>
        <div class="dish-footer">
          <span class="dish-price">${formatMoney(dish.price)}</span>
          <button class="add-btn" data-id="${dish.id}">Add to Cart</button>
        </div>
      </article>
    `
    )
    .join("");
}

function addToCart(id) {
  orderConfirmationEl.textContent = "";
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const dish = MENU.find((m) => m.id === id);
    if (dish) cart.push({ ...dish, qty: 1 });
  }
  renderCart();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  renderCart();
}

function renderCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
    subtotalEl.textContent = formatMoney(0);
    totalPriceEl.textContent = formatMoney(0);
    checkoutBtn.disabled = true;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br />
          <span>${formatMoney(item.price * item.qty)}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
    `
    )
    .join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.textContent = formatMoney(subtotal);
  totalPriceEl.textContent = formatMoney(subtotal + DELIVERY_FEE);
  checkoutBtn.disabled = false;
}

categoryBar.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cat-btn")) return;
  categoryBar.querySelectorAll(".cat-btn").forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  activeCategory = e.target.dataset.category;
  renderMenu();
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderMenu();
});

menuGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    addToCart(Number(e.target.dataset.id));
  }
});

cartItemsEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("qty-btn")) {
    updateQty(Number(e.target.dataset.id), Number(e.target.dataset.delta));
  }
});

checkoutBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
  orderConfirmationEl.textContent = "Order placed! Your food is being prepared.";
});

cartToggle.addEventListener("click", () => {
  cartDrawer.classList.toggle("open");
});

closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

renderMenu();
renderCart();