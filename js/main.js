// ===== Datos de hamburguesas =====
const menu = [
    {id:1, name:'Cheeseburger', price:5.99, img:'assets/cheeseburger.jpg', ingredients:['Queso','Lechuga','Tomate','Cebolla']},
    {id:2, name:'Bacon Burger', price:6.99, img:'assets/baconburger.jpg', ingredients:['Bacon','Queso','Cebolla','Salsa BBQ']},
    {id:3, name:'Veggie Burger', price:5.49, img:'assets/veggieburger.jpg', ingredients:['Lechuga','Tomate','Pepino','Huevo']}
];

let currentProduct = null;

// ===== Contenedores =====
const menuContainer = document.getElementById('menuContainer');
const customModalEl = document.getElementById('customModal');
const customModal = customModalEl ? new bootstrap.Modal(customModalEl) : null;
const customForm = document.getElementById('customForm');
const ingredientsDiv = document.getElementById('ingredientsContainer');
const cartBadge = document.getElementById('cartBadge');
const loginLink = document.getElementById('loginLink');
const logoutLink = document.getElementById('logoutLink');

// ===== Navbar dinámico =====
function updateNavbar(){
    const user = localStorage.getItem('activeUser');
    if(loginLink) loginLink.style.display = user ? 'none' : 'block';
    if(logoutLink) logoutLink.style.display = user ? 'block' : 'none';
}

// ===== Contador carrito =====
function updateCartBadge(){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cartBadge) cartBadge.innerText = cart.length;
}

// ===== Renderizar menú =====
function renderMenu(){
    if(!menuContainer) return;
    menuContainer.innerHTML = '';
    menu.forEach(item=>{
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML=`
            <div class="card">
                <img src="${item.img}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">$${item.price.toFixed(2)}</p>
                    <button class="btn btn-brand w-100" onclick="openModal(${item.id})">Personalizar</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(div);
    });
}

// ===== Abrir modal =====
function openModal(id){
    currentProduct = menu.find(p=>p.id===id);
    if(!currentProduct || !ingredientsDiv || !customModal) return;

    document.getElementById('modalTitle').innerText = `Personalizar ${currentProduct.name}`;
    ingredientsDiv.innerHTML = '';

    currentProduct.ingredients.forEach((ing,idx)=>{
        const div=document.createElement('div');
        div.classList.add('form-check');
        div.innerHTML=`
            <input class="form-check-input" type="checkbox" value="${ing}" id="ing${idx}" checked>
            <label class="form-check-label" for="ing${idx}">${ing}</label>
        `;
        ingredientsDiv.appendChild(div);
    });

    customModal.show();
}

// ===== Añadir al carrito =====
if(customForm){
    customForm.addEventListener('submit', e=>{
        e.preventDefault();
        if(!currentProduct || !ingredientsDiv) return;

        const selectedIngredients = Array.from(ingredientsDiv.querySelectorAll('input[type="checkbox"]:checked'))
            .map(input=>input.value);

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            ingredients: selectedIngredients
        });

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert(`${currentProduct.name} añadido al carrito`);
        customModal.hide();
    });
}

// ===== Cargar carrito =====
function loadCart(){
    const cartContainer = document.getElementById('cartContainer');
    const totalPriceEl = document.getElementById('totalPrice');
    if(!cartContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartContainer.innerHTML='';
    let total = 0;

    cart.forEach((item,index)=>{
        total += item.price;
        const div = document.createElement('div');
        div.classList.add('col-12');
        div.innerHTML = `
            <div class="card mb-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Ingredientes: ${item.ingredients.join(', ')}</p>
                        <p>Precio: $${item.price.toFixed(2)}</p>
                    </div>
                    <button class="btn btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    if(totalPriceEl) totalPriceEl.innerText = `Total: $${total.toFixed(2)}`;
    updateCartBadge();
}

// ===== Eliminar del carrito =====
function removeFromCart(index){
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index,1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// ===== Finalizar pedido =====
const checkoutBtn = document.getElementById('checkoutBtn');
const orderModalEl = document.getElementById('orderModal');
const orderModal = orderModalEl ? new bootstrap.Modal(orderModalEl) : null;
const orderDetails = document.getElementById('orderDetails');

if(checkoutBtn){
    checkoutBtn.addEventListener('click', ()=>{
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if(cart.length === 0) return alert('El carrito está vacío');

        const repartidores = ['Juan','María','Luis','Ana'];
        const repartidor = repartidores[Math.floor(Math.random()*repartidores.length)];

        let detailsHTML = `<p>Gracias por tu pedido, ${localStorage.getItem('activeUser') || 'Usuario'}!</p>`;
        detailsHTML += '<ul>';
        cart.forEach(item=>{
            detailsHTML += `<li>${item.name} (${item.ingredients.join(', ')}) - $${item.price.toFixed(2)}</li>`;
        });
        detailsHTML += '</ul>';
        detailsHTML += `<p><strong>Repartidor asignado:</strong> ${repartidor}</p>`;

        if(orderDetails) orderDetails.innerHTML = detailsHTML;

        localStorage.removeItem('cart');
        loadCart();
        orderModal?.show();
    });
}

// ===== Inicializar al cargar DOM =====
document.addEventListener('DOMContentLoaded', ()=>{
    renderMenu();
    loadCart();
    updateCartBadge();
    updateNavbar();
});
