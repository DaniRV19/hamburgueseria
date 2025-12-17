// ===============================
// STORAGE
// ===============================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===============================
// BADGE
// ===============================
function updateCartBadge(animate = false) {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  badge.textContent = getCart().length;

  if (animate) {
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 200);
  }
}

// ===============================
// TOAST
// ===============================
function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerText = text;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}

// ===============================
// MENU
// ===============================
function setupMenuButtons() {
  document.querySelectorAll(".burger-card button").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".burger-card");
      const name = card.querySelector("h5").innerText;
      const price = parseFloat(
        card.querySelector("span").innerText.replace("€","").replace(",",".")
      );

      const cart = getCart();
      cart.push({ name, price });
      saveCart(cart);

      updateCartBadge(true);
      showToast(`${name} añadida al carrito 🍔`);

      btn.innerText = "Añadido ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerText = "Añadir";
        btn.disabled = false;
      }, 700);
    };
  });
}

// ===============================
// CARRITO
// ===============================
function renderCart() {
  const section = document.querySelector(".cart-section");
  if (!section) return;

  const cart = getCart();
  let total = 0;

  section.querySelectorAll(".cart-item").forEach(i => i.remove());

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <h5>${item.name}</h5>
        <span>${item.price.toFixed(2)} €</span>
      </div>
      <button class="btn btn-sm btn-outline-danger">✖</button>
    `;

    div.querySelector("button").onclick = () => {
      cart.splice(index,1);
      saveCart(cart);
      renderCart();
      updateCartBadge(true);
    };

    section.insertBefore(div, section.querySelector(".cart-total"));
  });

  section.querySelector(".cart-total").innerText =
    `Total: ${total.toFixed(2)} €`;
}

// ===============================
// CHECKOUT PRO
// ===============================
function setupCheckout() {
  const btn = document.querySelector(".cart-section .btn-brand");
  if (!btn) return;

  btn.onclick = () => {
    if (getCart().length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const riders = ["Álex", "María", "Dani", "Lucía"];
    const rider = riders[Math.floor(Math.random()*riders.length)];

    localStorage.removeItem("cart");
    updateCartBadge();

    document.querySelector(".cart-section").innerHTML = `
      <div class="order-success">
        <h2>¡Pedido confirmado! 🍔</h2>
        <p>Tu repartidor es <strong>${rider}</strong></p>
        <p>Tiempo estimado: 25 minutos</p>
      </div>
    `;
  };
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  setupMenuButtons();
  renderCart();
  setupCheckout();
});