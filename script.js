const foods = [
  { id: 1, name: "Burger", price: 8.5 },
  { id: 2, name: "Pizza", price: 11.0 },
  { id: 3, name: "Pasta", price: 9.5 },
  { id: 4, name: "Juice", price: 3.0 }
];

const cart = [];
const menuEl = document.getElementById("menu");
const cartEl = document.getElementById("cart");
const countEl = document.getElementById("count");
const totalEl = document.getElementById("total");
const msgEl = document.getElementById("msg");

foods.forEach((food) => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <span><strong>${food.name}</strong> - $${food.price.toFixed(2)}</span>
    <button onclick="addItem(${food.id})">Add</button>
  `;
  menuEl.appendChild(div);
});

function addItem(id) {
  msgEl.textContent = "";
  const item = foods.find((f) => f.id === id);
  if (item) {
    cart.push(item);
    renderCart();
  }
}

function renderCart() {
  cartEl.innerHTML = "";
  let sum = 0;
  cart.forEach((item) => {
    sum += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartEl.appendChild(li);
  });
  countEl.textContent = cart.length;
  totalEl.textContent = sum.toFixed(2);
}

document.getElementById("orderBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    msgEl.textContent = "Add an item first.";
    return;
  }
  cart.length = 0;
  renderCart();
  msgEl.textContent = "Order placed!";
});