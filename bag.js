"use strict";

const CART_KEY = "stylekart-cart";
const ORDER_KEY = "stylekart-orders";

const bagItems = document.getElementById("bagItems");
const bagItemCount = document.getElementById("bagItemCount");

const totalMRP = document.getElementById("totalMRP");
const discountElement = document.getElementById("discount");
const deliveryFeeElement = document.getElementById("deliveryFee");
const totalAmount = document.getElementById("totalAmount");

const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderMessage = document.getElementById("orderMessage");

const products = {
    "Classic T-Shirt": { price: 599, mrp: 999 },
    "Elegant Dress": { price: 1299, mrp: 1999 },
    "Sport Sneakers": { price: 1499, mrp: 2199 },
    "Everyday Handbag": { price: 899, mrp: 1399 },
    "Kids Outfit": { price: 799, mrp: 1199 },
    "Beauty Essentials": { price: 499, mrp: 799 },
    "Casual Jacket": { price: 1599, mrp: 2299 },
    "Urban Jacket": { price: 1899, mrp: 2799 },
    "Classic Heels": { price: 1099, mrp: 1699 },
    "Everyday Watch": { price: 999, mrp: 1499 },
    "Summer Top": { price: 699, mrp: 1099 },
    "Street Style Outfit": { price: 1399, mrp: 2099 }
};

function readCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .filter(item =>
                item &&
                products[item.name] &&
                Number(item.quantity) > 0
            )
            .map(item => ({
                name: item.name,
                price: products[item.name].price,
                quantity: Math.floor(Number(item.quantity)),
                size: item.size || "",
                color: item.color || ""
            }));

    } catch {
        return [];
    }
}

let cart = readCart();

function money(value) {
    return "₹" + value.toLocaleString("en-IN");
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderBag() {
    bagItems.replaceChildren();

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    bagItemCount.textContent = `${count} item(s) in your bag`;

    if (cart.length === 0) {
        const empty = document.createElement("div");

        empty.className = "empty-bag";

        empty.innerHTML = `
            <p>Your shopping bag is empty.</p>
            <a href="index.html">CONTINUE SHOPPING</a>
        `;

        bagItems.appendChild(empty);
    }

    cart.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "bag-item";

        const details = document.createElement("div");
        details.className = "bag-item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = money(products[item.name].price);

        details.append(name, price);

        if (item.size || item.color) {
            const options = document.createElement("p");

            options.className = "bag-item-options";

            options.textContent = [
                item.size && `Size: ${item.size}`,
                item.color && `Color: ${item.color}`
            ].filter(Boolean).join(" | ");

            details.appendChild(options);
        }

        const quantity = document.createElement("div");
        quantity.className = "quantity-control";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.disabled = item.quantity <= 1;

        minus.addEventListener("click", () => {
            cart[index].quantity--;

            saveCart();
            renderBag();
        });

        const number = document.createElement("span");
        number.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";

        plus.addEventListener("click", () => {
            cart[index].quantity++;

            saveCart();
            renderBag();
        });

        quantity.append(minus, number, plus);

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "REMOVE";

        remove.addEventListener("click", () => {
            cart.splice(index, 1);

            saveCart();
            renderBag();
        });

        details.append(quantity, remove);
        card.appendChild(details);

        bagItems.appendChild(card);
    });

    const mrp = cart.reduce(
        (sum, item) =>
            sum + products[item.name].mrp * item.quantity, 0
    );

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + products[item.name].price * item.quantity, 0
    );

    const delivery =
        count === 0 ? 0 : subtotal >= 999 ? 0 : 49;

    totalMRP.textContent = money(mrp);
    discountElement.textContent = money(mrp - subtotal);

    deliveryFeeElement.textContent =
        delivery === 0 && count > 0 ? "FREE" : money(delivery);

    totalAmount.textContent = money(subtotal + delivery);

    placeOrderBtn.disabled = count === 0;
}

// Place Order
placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + products[item.name].price * item.quantity, 0
    );

    const delivery = subtotal >= 999 ? 0 : 49;

    const orderId = "SK" + Date.now().toString().slice(-8);

    const order = {
        orderId: orderId,
        date: new Date().toLocaleString("en-IN"),
        items: cart.map(item => ({ ...item })),
        total: subtotal + delivery
    };

    let orders = [];

    try {
        orders = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    } catch {
        orders = [];
    }

    if (!Array.isArray(orders)) {
        orders = [];
    }

    orders.push(order);

    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));

    cart = [];

    saveCart();
    renderBag();

    orderMessage.innerHTML = `
        Order placed successfully!<br>
        <strong>Order ID: ${orderId}</strong><br>
        This is a demo confirmation. No payment was processed.
    `;
});

renderBag();