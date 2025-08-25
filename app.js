
const state = {
  products: [
    {id:1, name:"Maya Puffer Jacket", brand:"Moncler", category:"Jackor", price:10999, img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"},
    {id:2, name:"UA Tech™ T-Shirt", brand:"Under Armour", category:"Tröjor", price:399, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop"},
    {id:3, name:"Burberry Scarf Classic", brand:"Burberry", category:"Accessoarer", price:3499, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"},
    {id:4, name:"Moncler Trail Sneaker", brand:"Moncler", category:"Skor", price:5999, img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"},
    {id:5, name:"UA Rival Hoodie", brand:"Under Armour", category:"Tröjor", price:799, img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop"},
    {id:6, name:"Burberry Trench Coat", brand:"Burberry", category:"Jackor", price:13999, img: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c7?q=80&w=1200&auto=format&fit=crop"},
    {id:7, name:"Moncler Beanie", brand:"Moncler", category:"Accessoarer", price:1699, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"},
    {id:8, name:"UA Charged Sneakers", brand:"Under Armour", category:"Skor", price:1299, img: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1200&auto=format&fit=crop"}
  ],
  cart: [],
  filters: { search:"", brand:"", category:"", maxPrice:15000, sort:"featured" }
};

const el = (sel) => document.querySelector(sel);
const grid = el("#grid");
const cartButton = el("#cartButton");
const cartDrawer = el("#cartDrawer");
const cartOverlay = el("#cartOverlay");
const closeCart = el("#closeCart");
const cartItems = el("#cartItems");
const subtotalEl = el("#subtotal");
const cartCountEl = el("#cartCount");

function currency(n){
  return new Intl.NumberFormat('sv-SE', {style:'currency', currency:'SEK'}).format(n);
}

function applyFilters(products){
  let list = products
    .filter(p => p.price <= state.filters.maxPrice)
    .filter(p => state.filters.brand ? p.brand === state.filters.brand : true)
    .filter(p => state.filters.category ? p.category === state.filters.category : true)
    .filter(p => state.filters.search ? (p.name.toLowerCase().includes(state.filters.search) || p.brand.toLowerCase().includes(state.filters.search)) : true);

  switch(state.filters.sort){
    case "price-asc": list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "name-asc": list.sort((a,b)=>a.name.localeCompare(b.name,"sv")); break;
    case "name-desc": list.sort((a,b)=>b.name.localeCompare(a.name,"sv")); break;
    default: /* featured: leave as is */ break;
  }
  return list;
}

function renderProducts(){
  const list = applyFilters(state.products);
  if(!list.length){
    grid.innerHTML = `<div class="card" style="padding:20px"><strong>Inga produkter matchar din filtrering.</strong></div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="card">
      <img class="card-img" src="${p.img}" alt="${p.name}"/>
      <div class="card-body">
        <span class="brand-pill">${p.brand}</span>
        <h3>${p.name}</h3>
        <div class="row">
          <span class="price">${currency(p.price)}</span>
          <button class="btn btn-outline add-btn" data-id="${p.id}">Lägg i varukorgen</button>
        </div>
      </div>
    </article>
  `).join("");
}

function openCart(){ cartDrawer.classList.add("show-drawer"); cartOverlay.classList.add("show-overlay"); cartDrawer.setAttribute("aria-hidden","false");}
function closeCartFn(){ cartDrawer.classList.remove("show-drawer"); cartOverlay.classList.remove("show-overlay"); cartDrawer.setAttribute("aria-hidden","true");}

function addToCart(id){
  const item = state.cart.find(i=>i.id===id);
  if(item){ item.qty++; }
  else{
    const p = state.products.find(p=>p.id===id);
    state.cart.push({id:p.id, name:p.name, brand:p.brand, price:p.price, img:p.img, qty:1});
  }
  updateCartUI();
}

function changeQty(id, delta){
  const item = state.cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ state.cart = state.cart.filter(i=>i.id!==id); }
  updateCartUI();
}

function updateCartUI(){
  cartItems.innerHTML = state.cart.map(i=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}"/>
      <div>
        <h4>${i.name}</h4>
        <div class="muted">${i.brand}</div>
        <div class="qty">
          <button aria-label="Minska" data-action="dec" data-id="${i.id}">−</button>
          <span>${i.qty}</span>
          <button aria-label="Öka" data-action="inc" data-id="${i.id}">+</button>
        </div>
      </div>
      <div><strong>${currency(i.price * i.qty)}</strong></div>
    </div>
  `).join("");
  const subtotal = state.cart.reduce((s,i)=>s + i.price*i.qty, 0);
  subtotalEl.textContent = currency(subtotal);
  cartCountEl.textContent = state.cart.reduce((s,i)=>s + i.qty, 0);
}

function attachEvents(){
  document.addEventListener("click", (e)=>{
    const addBtn = e.target.closest(".add-btn");
    if(addBtn){ addToCart(Number(addBtn.dataset.id)); }

    if(e.target.dataset.action==="inc"){ changeQty(Number(e.target.dataset.id), +1); }
    if(e.target.dataset.action==="dec"){ changeQty(Number(e.target.dataset.id), -1); }

    if(e.target === cartOverlay){ closeCartFn(); }
  });

  cartButton.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartFn);

  el("#search").addEventListener("input", (e)=>{
    state.filters.search = e.target.value.toLowerCase();
    renderProducts();
  });
  el("#brand").addEventListener("change", (e)=>{ state.filters.brand = e.target.value; renderProducts(); });
  el("#category").addEventListener("change", (e)=>{ state.filters.category = e.target.value; renderProducts(); });
  el("#price").addEventListener("input", (e)=>{
    state.filters.maxPrice = Number(e.target.value);
    el("#priceValue").textContent = new Intl.NumberFormat('sv-SE').format(e.target.value);
    renderProducts();
  });
  el("#sort").addEventListener("change", (e)=>{ state.filters.sort = e.target.value; renderProducts(); });

  el("#newsletterForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    alert("Tack! Du är nu med i vårt nyhetsbrev.");
    e.target.reset();
  });

  el("#checkout").addEventListener("click", ()=>{
    if(state.cart.length===0){ alert("Din varukorg är tom."); return; }
    alert("Kassasida är inte implementerad i denna demo. 📦");
  });

  // Keyboard ESC to close cart
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeCartFn();
  });
}

function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  renderProducts();
  attachEvents();
}
init();
