const menu = [{
    "id": "jollof",
    "name": "Jollof Rice",
    "price": 35,
    "category": "Food",
    "description": "Smoky tomato rice with grilled chicken and a bright pepper sauce.",
    "art": "\ud83c\udf5b"
}, {
    "id": "waakye",
    "name": "Waakye",
    "price": 30,
    "category": "Food",
    "description": "Rice and beans, spaghetti, egg, and our house shito.",
    "art": "\ud83e\udd58"
}, {
    "id": "kelewele",
    "name": "Kelewele",
    "price": 20,
    "category": "Sides",
    "description": "Golden plantain tossed with ginger, chilli, and warming spices.",
    "art": "\ud83c\udf4c"
}, {
    "id": "redred",
    "name": "Red Red",
    "price": 28,
    "category": "Food",
    "description": "Slow-cooked black-eyed beans with sweet fried plantain.",
    "art": "\ud83e\uded8"
}, {
    "id": "sobolo",
    "name": "Sobolo",
    "price": 10,
    "category": "Drinks",
    "description": "Chilled hibiscus with ginger and a hint of pineapple.",
    "art": "\ud83c\udf79"
}, {
    "id": "asaana",
    "name": "Asaana",
    "price": 10,
    "category": "Drinks",
    "description": "A refreshing traditional caramelised corn drink.",
    "art": "\ud83e\udd64"
}];
// Objects keep each dish's related values together.
class Order {
    constructor(lines = []) {
        this.lines = lines;
    }
    add(dish, qty = 1) {
        const existing = this.lines.find(line => line.id === dish.id);
        if (existing) existing.qty = Math.min(20, existing.qty + qty);
        else this.lines.push({
            id: dish.id,
            qty
        });
        return this;
    }
    total() {
        return this.lines.reduce((sum, line) => sum + menu.find(dish => dish.id === line.id).price * line.qty, 0);
    }
}
let saved = [];
try {
    const parsed = JSON.parse(localStorage.getItem('nightMarketOrder') || '[]');
    if (Array.isArray(parsed)) saved = parsed.filter(line => menu.some(dish => dish.id === line.id) && Number.isInteger(line.qty) && line.qty > 0 && line.qty <= 20);
} catch (error) {
    saved = [];
}
const order = new Order(saved);
const money = value => 'GHS ' + value.toFixed(2);

function persist() {
    try {
        localStorage.setItem('nightMarketOrder', JSON.stringify(order.lines));
    } catch (error) {
        /* The current page still works if browser storage is unavailable. */ }
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = order.lines.reduce((sum, line) => sum + line.qty, 0));
}
let toastTimer;

function notify(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.style.display = 'none', 2400);
}

function dishCard(dish) {
    return `<article class="dish"><div class="dish-art" aria-hidden="true">${dish.art}</div><div class="dish-body"><span class="eyebrow">${dish.category}</span><h3>${dish.name}</h3><p>${dish.description}</p><div class="dish-bottom"><strong>${money(dish.price)}</strong><button data-add="${dish.id}" aria-label="Add ${dish.name} to order">Add +</button></div></div></article>`;
}
let category = 'All';

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    const query = document.getElementById('search').value.trim().toLowerCase();
    const dishes = menu.filter(dish => (category === 'All' || dish.category === category) && (dish.name + ' ' + dish.description).toLowerCase().includes(query));
    const sort = document.getElementById('sort').value;
    if (sort === 'name') dishes.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price') dishes.sort((a, b) => a.price - b.price);
    grid.innerHTML = dishes.map(dishCard).join('') || '<p>No dishes found. Try another search or category.</p>';
    document.getElementById('menu-count').textContent = dishes.length + ' items found';
}

function renderOrder() {
    const container = document.getElementById('order-lines');
    if (!container) return;
    container.innerHTML = order.lines.map(line => {
        const dish = menu.find(dish => dish.id === line.id);
        return `<article class="order-line"><div><h3>${dish.name}</h3><span class="small">${money(dish.price)} each</span></div><label>Quantity<input type="number" min="1" max="20" step="1" value="${line.qty}" data-qty="${dish.id}" aria-label="Quantity of ${dish.name}"></label><div><strong>${money(dish.price * line.qty)}</strong><br><button class="remove" data-remove="${dish.id}" aria-label="Remove ${dish.name}">Remove</button></div></article>`;
    }).join('') || '<div class="empty"><h2>Your plate is empty.</h2><p>Explore the menu and add something delicious.</p><a class="button" href="menu.html">Browse the menu →</a></div>';
    document.getElementById('order-total').textContent = money(order.total());
    document.getElementById('confirm-order').disabled = order.lines.length === 0;
}
document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) {
        const dish = menu.find(dish => dish.id === add.dataset.add);
        const existing = order.lines.find(line => line.id === dish.id);
        if (existing && existing.qty >= 20) return notify('Maximum 20 of each item.');
        order.add(dish);
        persist();
        notify(dish.name + ' added to your order');
    }
    const filter = event.target.closest('[data-category]');
    if (filter) {
        category = filter.dataset.category;
        document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', button === filter));
        renderMenu();
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) {
        order.lines = order.lines.filter(line => line.id !== remove.dataset.remove);
        persist();
        renderOrder();
    }
});
document.addEventListener('change', event => {
    if (event.target.matches('[data-qty]')) {
        const input = event.target;
        const line = order.lines.find(line => line.id === input.dataset.qty);
        if (!input.validity.valid || !Number.isInteger(Number(input.value))) {
            input.value = line.qty;
            notify('Choose a whole quantity from 1 to 20.');
            return;
        }
        line.qty = Number(input.value);
        persist();
        renderOrder();
    }
});
document.getElementById('search')?.addEventListener('input', renderMenu);
document.getElementById('sort')?.addEventListener('change', renderMenu);
document.getElementById('checkout')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!order.lines.length) return;
    const name = document.getElementById('customer').value.trim();
    if (!name) {
        document.getElementById('customer').setCustomValidity('Please enter your name.');
        document.getElementById('customer').reportValidity();
        return;
    }
    document.getElementById('confirmation').textContent = `Thank you, ${name}! Your demo order totals ${money(order.total())}. Collection: ${document.getElementById('collection').value}. No order has been sent.`;
});
document.getElementById('customer')?.addEventListener('input', event => event.target.setCustomValidity(''));
document.getElementById('message')?.addEventListener('input', event => document.getElementById('character-count').textContent = event.target.value.length + ' / 500 characters');
document.getElementById('contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || message.length < 10) {
        document.getElementById('contact-status').textContent = 'Please enter a name and a message with at least 10 non-padding characters.';
        return;
    }
    document.getElementById('contact-status').textContent = `Thank you, ${name}. Your demo form passed validation. No message was sent or stored.`;
    event.target.reset();
    document.getElementById('character-count').textContent = '0 / 500 characters';
});
persist();
renderMenu();
renderOrder();
