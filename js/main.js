const CURRENCY = '₱';

const products = [
  { id: 1, name: "Modern Sofa", price: 28999, img: "https://i5.walmartimages.com/seo/HONBAY-Modern-Living-Room-Furniture-Sofa-Set-with-Storage-Ottomans-Grey_aba8e40f-0237-4624-9a0d-d5b2e740bbc3.1807a333a799e305d0081bcf7e56993e.jpeg" },
  { id: 2, name: "Luxury Dining Table", price: 45999, img: "https://italydesign.com/cdn/shop/products/reflex_chairs_new_york_2_01.jpg?v=1571733090" },
  { id: 3, name: "Mid-Century Chair", price: 16999, img: "https://assets.weimgs.com/weimgs/ab/images/wcm/products/202537/0031/mid-century-side-table-205-o.jpg" },
  { id: 4, name: "Outdoor Lounge Set", price: 57999, img: "https://m.media-amazon.com/images/I/91NdnNJwiDL._AC_UF894%2C1000_QL80_.jpg" },
  { id: 5, name: "Accent Armchair", price: 14999, img: "https://www.popmaison.com/cdn/shop/files/Maye-accentchair-beige_18_7eecaaf2-044c-4b1d-a614-1323560122d2.jpg?v=1708410398&width=1200" },
];

function formatPrice(n){ return CURRENCY + n.toLocaleString(); }

// localStorage cart helpers
function getCart(){ return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }

// add item (by id)
function addToCart(id){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else cart.push({id:id, qty:1});
  saveCart(cart);
  showToast('Added to cart');
}

// remove item by id
function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
  renderCart();
}

// update qty
function updateQuantity(id, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;

  qty = parseInt(qty, 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  item.qty = qty;
  saveCart(cart);
  renderCart();
}



// clear cart
function clearCart(){
  localStorage.removeItem('cart');
  updateCartCount();
  renderCart();
}

// update visual cart count badges
function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count').forEach(el=>el.textContent = count);
}

// produce a small toast element
function showToast(msg){
  const el = document.createElement('div');
  el.className = 'toast align-items-center text-bg-primary border-0 show';
  el.role = 'alert';
  el.style.position='fixed'; el.style.right='20px'; el.style.bottom='20px'; el.style.zIndex=9999;
  el.innerHTML = '<div class="d-flex"><div class="toast-body">'+msg+'</div><button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button></div>';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2500);
}

// Render products on products page
function renderProducts(containerId = 'productsContainer'){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  products.forEach(p=>{
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title mb-1">${p.name}</h6>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="fw-bold">${formatPrice(p.price)}</div>
            <button class="btn btn-sm btn-outline-primary" onclick="addToCart(${p.id})">Add</button>
          </div>
        </div>
      </div>`;
    container.appendChild(col);
  });
}
function renderCart() {
  const container = document.getElementById('cartContainer');
  const summary = document.getElementById('cartSummary');
  if (!container || !summary) { updateCartCount(); return; }

  container.style.opacity = 0; // fade out

  setTimeout(() => {
    // (existing cart rendering code goes here)

    container.style.opacity = 1; // fade in
  }, 80);
}

// Render cart table and summary
function renderCart(){
  const container = document.getElementById('cartContainer');
  const summary = document.getElementById('cartSummary');
  if(!container || !summary) { updateCartCount(); return; }

  const cart = getCart();
  if(cart.length === 0){
    container.innerHTML = '<div class="alert alert-info">Your cart is empty. <a href="products.html">Shop products</a></div>';
    summary.innerHTML = '';
    updateCartCount();
    return;
  }

  let html = `<div class="table-responsive">
  <table class="table cart-table align-middle">
    <thead>
      <tr>
        <th style="width:40%">Product</th>
        <th style="width:15%">Price</th>
        <th style="width:15%">Quantity</th>
        <th style="width:20%" class="text-end">Total</th>
        <th style="width:10%"></th>
      </tr>
    </thead>
    <tbody>`;

  let grand = 0;
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id);
    if(!p) return;
    const total = p.price * item.qty;
    grand += total;
    html += `<tr>
      <td>
        <div class="d-flex align-items-center">
          <img src="${p.img}" style="width:64px;height:64px;object-fit:cover" class="me-3 rounded" alt="">
          <div>
            <div class="fw-semibold">${p.name}</div>
            <div class="small text-muted">ID: ${p.id}</div>
          </div>
        </div>
      </td>
      <td>${formatPrice(p.price)}</td>
      <td><input type="number" min="1" class="form-control form-control-sm" value="${item.qty}" onchange="updateQuantity(${p.id}, parseInt(this.value) || 0)"></td>
      <td class="text-end">${formatPrice(total)}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${p.id})">Remove</button></td>
    </tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;

  summary.innerHTML = `
    <div class="mb-3"><strong>Grand Total:</strong> ${formatPrice(grand)}</div>
    <div class="d-grid gap-2">
      <button class="btn btn-accent" onclick="window.location.href='payment.html'">Proceed to Checkout</button>
      <button class="btn btn-outline-secondary" onclick="clearCart()">Clear Cart</button>
    </div>
  `;
  updateCartCount();
}

// Sorting for products page
function initSorting(){
  const sel = document.getElementById('sortSelect');
  if(!sel) return;
  sel.addEventListener('change', ()=>{
    const v = sel.value;
    if(v==='price-asc') products.sort((a,b)=>a.price-b.price);
    else if(v==='price-desc') products.sort((a,b)=>b.price-a.price);
    else products.sort((a,b)=>a.id-b.id);
    renderProducts();
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  renderCart();
  initSorting();
  updateCartCount();

  // Fill total on payment page
  const totalSpan = document.getElementById('totalAmount');
  if(totalSpan){
    const cart = getCart();
    const total = cart.reduce((sum, it)=>{
      const p = products.find(x=>x.id===it.id);
      return sum + (p ? p.price * it.qty : 0);
    }, 0);
    totalSpan.textContent = total.toLocaleString();
  }
});
