// SABJIWALA — Complete App
const App = {
  data: {
    categories: ['हरी सब्जियाँ', 'जड़ वाली सब्जियाँ', 'फल', 'मसाले', 'खास सब्जियाँ'],
    products: [
      { id: 'p1', name: 'पालक', category: 'हरी सब्जियाँ', price: 20, unit: 'kg', img: '🥬' },
      { id: 'p2', name: 'मेथी', category: 'हरी सब्जियाँ', price: 18, unit: 'kg', img: '🌿' },
      { id: 'p3', name: 'धनिया', category: 'हरी सब्जियाँ', price: 15, unit: 'bunch', img: '🌱' },
      { id: 'p4', name: 'आलू', category: 'जड़ वाली सब्जियाँ', price: 30, unit: 'kg', img: '🥔' },
      { id: 'p5', name: 'प्याज', category: 'जड़ वाली सब्जियाँ', price: 25, unit: 'kg', img: '🧅' },
      { id: 'p6', name: 'लहसुन', category: 'जड़ वाली सब्जियाँ', price: 40, unit: 'kg', img: '🧄' },
      { id: 'p7', name: 'अदरक', category: 'जड़ वाली सब्जियाँ', price: 45, unit: 'kg', img: '🫚' },
      { id: 'p8', name: 'टमाटर', category: 'फल', price: 35, unit: 'kg', img: '🍅' },
      { id: 'p9', name: 'नींबू', category: 'फल', price: 10, unit: 'pc', img: '🍋' },
      { id: 'p10', name: 'सेब', category: 'फल', price: 80, unit: 'kg', img: '🍎' },
      { id: 'p11', name: 'केला', category: 'फल', price: 40, unit: 'dozen', img: '🍌' },
      { id: 'p12', name: 'मिर्च', category: 'मसाले', price: 30, unit: 'kg', img: '🌶️' },
      { id: 'p13', name: 'हल्दी', category: 'मसाले', price: 50, unit: 'kg', img: '🟡' },
      { id: 'p14', name: 'भिंडी', category: 'खास सब्जियाँ', price: 35, unit: 'kg', img: '🫘' },
      { id: 'p15', name: 'बैंगन', category: 'खास सब्जियाँ', price: 28, unit: 'kg', img: '🍆' }
    ],
    cart: {},
    wishlist: [],
    orders: [],
    user: null,
    currentCategory: null
  },

  init() {
    this.loadData();
    this.renderHome();
    this.updateBadges();
    this.navigateTo('home');
  },

  loadData() {
    try {
      const saved = localStorage.getItem('sabjiwala');
      if (saved) Object.assign(this.data, JSON.parse(saved));
    } catch (e) {}
  },

  saveData() {
    localStorage.setItem('sabjiwala', JSON.stringify(this.data));
  },

  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
  },

  navigateTo(page) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + page);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navMap = { home: 0, categories: 1, cart: 2, orders: 3 };
    const idx = navMap[page];
    if (idx !== undefined) document.querySelectorAll('.nav-item')[idx]?.classList.add('active');

    if (page === 'home') this.renderHome();
    if (page === 'categories') this.renderCategories();
    if (page === 'cart') this.renderCart();
    if (page === 'wishlist') this.renderWishlist();
    if (page === 'orders') this.renderOrders();
    this.updateBadges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderHome() {
    this.renderHomeCategories();
    this.renderHomeProducts();
  },

  renderHomeCategories() {
    const container = document.getElementById('homeCategories');
    if (!container) return;
    container.innerHTML = this.data.categories.map(c => `
      <div class="category-card" onclick="App.filterByCategory('${c}')">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><circle cx="12" cy="12" r="2"/></svg>
        <h4>${c}</h4>
        <p>${this.data.products.filter(p => p.category === c).length} items</p>
      </div>
    `).join('');
  },

  renderHomeProducts() {
    const container = document.getElementById('homeProducts');
    if (!container) return;
    const products = this.data.products.slice(0, 6);
    container.innerHTML = products.map(p => this.productCardHTML(p)).join('');
  },

  productCardHTML(p) {
    const inCart = !!this.data.cart[p.id];
    const inWish = this.data.wishlist.includes(p.id);
    return `
      <div class="product-card" onclick="App.filterByCategory('${p.category}')">
        <div class="p-img">${p.img}</div>
        <div class="p-name">${p.name}</div>
        <div class="p-price">₹${p.price}</div>
        <div class="p-unit">per ${p.unit}</div>
        <div class="p-actions">
          <button class="add-btn" onclick="event.stopPropagation();App.toggleCart('${p.id}')">${inCart ? '✅' : '🛒'}</button>
          <button class="fav-btn ${inWish ? 'active' : ''}" onclick="event.stopPropagation();App.toggleWishlist('${p.id}')">❤️</button>
        </div>
      </div>
    `;
  },

  renderCategories() {
    const container = document.getElementById('allCategories');
    if (!container) return;
    container.innerHTML = this.data.categories.map(c => `
      <div class="category-card" onclick="App.filterByCategory('${c}')">
        <h4>${c}</h4>
        <p>${this.data.products.filter(p => p.category === c).length} items</p>
      </div>
    `).join('');
    this.filterByCategory(null);
  },

  filterByCategory(cat) {
    this.data.currentCategory = cat;
    const container = document.getElementById('categoryProducts');
    if (!container) return;
    const products = cat ? this.data.products.filter(p => p.category === cat) : this.data.products;
    if (products.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:20px 0;">कोई सब्जी नहीं मिली</p>';
      return;
    }
    container.innerHTML = products.map(p => this.productCardHTML(p)).join('');
    this.navigateTo('categories');
  },

  search() {
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!q) { this.toast('कुछ खोजें!'); return; }
    const results = this.data.products.filter(p => p.name.includes(q) || p.category.includes(q));
    if (results.length === 0) { this.toast('❌ कोई सब्जी नहीं मिली'); return; }
    this.data.currentCategory = null;
    const container = document.getElementById('categoryProducts');
    if (!container) return;
    container.innerHTML = results.map(p => this.productCardHTML(p)).join('');
    this.navigateTo('categories');
    this.toast('✅ ' + results.length + ' सब्जियाँ मिलीं!');
  },

  toggleCart(id) {
    if (this.data.cart[id]) {
      delete this.data.cart[id];
      this.toast('🗑️ कार्ट से हटा दिया!');
    } else {
      this.data.cart[id] = 1;
      this.toast('🛒 कार्ट में जोड़ा गया!');
    }
    this.saveData();
    this.renderHome();
    this.renderCategories();
    this.updateBadges();
  },

  renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    const ids = Object.keys(this.data.cart);
    if (ids.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">🛒 कार्ट खाली है</p>';
      return;
    }
    let total = 0;
    container.innerHTML = ids.map(id => {
      const p = this.data.products.find(x => x.id === id);
      const qty = this.data.cart[id];
      total += p.price * qty;
      return `
        <div class="cart-item">
          <div class="ci-img">${p.img}</div>
          <div class="ci-info">
            <div class="ci-name">${p.name}</div>
            <div class="ci-price">₹${p.price}</div>
            <div class="ci-qty">
              <button onclick="App.updateQty('${id}', -1)">−</button>
              <span>${qty}</span>
              <button onclick="App.updateQty('${id}', 1)">+</button>
            </div>
          </div>
          <button class="ci-remove" onclick="App.removeFromCart('${id}')">✕</button>
        </div>
      `;
    }).join('') + `
      <div class="cart-summary">
        <div class="cs-row"><span>कुल सब्जियाँ</span><span>${ids.reduce((s, id) => s + this.data.cart[id], 0)}</span></div>
        <div class="cs-row cs-total"><span>कुल राशि</span><span>₹${total}</span></div>
        <button class="checkout-btn" onclick="App.checkout()">📦 ऑर्डर करें</button>
      </div>
    `;
  },

  updateQty(id, delta) {
    if (this.data.cart[id]) {
      this.data.cart[id] += delta;
      if (this.data.cart[id] <= 0) delete this.data.cart[id];
      this.saveData();
      this.renderCart();
      this.updateBadges();
    }
  },

  removeFromCart(id) {
    delete this.data.cart[id];
    this.saveData();
    this.renderCart();
    this.updateBadges();
    this.toast('🗑️ हटा दिया!');
  },

  checkout() {
    if (Object.keys(this.data.cart).length === 0) { this.toast('कार्ट खाली है!'); return; }
    if (!this.data.user) { this.toast('⚠️ पहले लॉगिन करें!'); this.navigateTo('login'); return; }
    const items = Object.keys(this.data.cart).map(id => {
      const p = this.data.products.find(x => x.id === id);
      return { name: p.name, qty: this.data.cart[id], price: p.price };
    });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    this.data.orders.unshift({
      id: 'ORD' + Date.now().toString().slice(-6),
      items: items,
      total: total,
      status: 'placed',
      date: new Date().toLocaleDateString('hi-IN')
    });
    this.data.cart = {};
    this.saveData();
    this.toast('✅ ऑर्डर प्लेस हो गया!');
    this.navigateTo('orders');
    this.updateBadges();
  },

  toggleWishlist(id) {
    const idx = this.data.wishlist.indexOf(id);
    if (idx === -1) {
      this.data.wishlist.push(id);
      this.toast('❤️ पसंदीदा में जोड़ा!');
    } else {
      this.data.wishlist.splice(idx, 1);
      this.toast('💔 पसंदीदा से हटाया!');
    }
    this.saveData();
    this.renderHome();
    this.renderCategories();
    this.updateBadges();
  },

  renderWishlist() {
    const container = document.getElementById('wishlistContent');
    if (!container) return;
    const products = this.data.products.filter(p => this.data.wishlist.includes(p.id));
    if (products.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">❤️ कोई पसंदीदा नहीं</p>';
      return;
    }
    container.innerHTML = products.map(p => this.productCardHTML(p)).join('');
  },

  renderOrders() {
    const container = document.getElementById('ordersContent');
    if (!container) return;
    if (this.data.orders.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">📦 कोई ऑर्डर नहीं</p>';
      return;
    }
    container.innerHTML = this.data.orders.map(o => `
      <div class="order-card">
        <div class="oc-head">
          <span class="oc-id">#${o.id}</span>
          <span class="oc-status ${o.status}">${o.status === 'placed' ? '⏳ प्लेस्ड' : '✅ डिलीवर'}</span>
        </div>
        <div class="oc-items">${o.items.map(i => i.name + ' x' + i.qty).join(', ')}</div>
        <div class="oc-total">₹${o.total} • ${o.date}</div>
      </div>
    `).join('');
  },

  login() {
    const phone = document.getElementById('loginPhone').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();
    if (!phone || !pass) { this.toast('⚠️ सभी फील्ड भरें!'); return; }
    const users = JSON.parse(localStorage.getItem('sabjiwala_users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === pass);
    if (!user) { this.toast('❌ गलत नंबर या पासवर्ड!'); return; }
    this.data.user = user;
    this.saveData();
    this.toast('✅ लॉगिन सफल!');
    this.navigateTo('home');
  },

  register() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPassword').value.trim();
    const addr = document.getElementById('regAddress').value.trim();
    if (!name || !phone || !pass || !addr) { this.toast('⚠️ सभी फील्ड भरें!'); return; }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) { this.toast('⚠️ सही नंबर डालें!'); return; }
    if (pass.length < 6) { this.toast('⚠️ 6+ अंक का पासवर्ड!'); return; }
    const users = JSON.parse(localStorage.getItem('sabjiwala_users') || '[]');
    if (users.find(u => u.phone === phone)) { this.toast('⚠️ यह नंबर पहले से है!'); return; }
    const newUser = { name, phone, password, address: addr };
    users.push(newUser);
    localStorage.setItem('sabjiwala_users', JSON.stringify(users));
    this.data.user = newUser;
    this.saveData();
    this.toast('✅ रजिस्टर सफल!');
    this.navigateTo('home');
  },

  updateBadges() {
    const cartCount = Object.values(this.data.cart).reduce((a, b) => a + b, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) cartBadge.textContent = cartCount;
    const wishBadge = document.getElementById('wishBadge');
    if (wishBadge) wishBadge.textContent = this.data.wishlist.length;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;