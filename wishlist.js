"use strict";

const CART_KEY = "stylekart-cart";
const WISHLIST_KEY = "stylekart-wishlist";

const catalog = {
    "Classic T-Shirt": {
        price: 599,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
        category: "MEN · CLOTHING"
    },

    "Elegant Dress": {
        price: 1299,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80",
        category: "WOMEN · CLOTHING"
    },

    "Sport Sneakers": {
        price: 1499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
        category: "FOOTWEAR"
    },

    "Everyday Handbag": {
        price: 899,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80",
        category: "ACCESSORIES"
    },

    "Kids Outfit": {
        price: 799,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80",
        category: "KIDS"
    },

    "Beauty Essentials": {
        price: 499,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80",
        category: "BEAUTY"
    },

    "Casual Jacket": {
        price: 1599,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80",
        category: "WOMEN · CLOTHING"
    },

    "Urban Jacket": {
        price: 1899,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80",
        category: "MEN · CLOTHING"
    },

    "Classic Heels": {
        price: 1099,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80",
        category: "FOOTWEAR"
    },

    "Everyday Watch": {
        price: 999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
        category: "ACCESSORIES"
    },

    "Summer Top": {
        price: 699,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80",
        category: "WOMEN · CLOTHING"
    },

    "Street Style Outfit": {
        price: 1399,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80",
        category: "WOMEN · CLOTHING"
    }
};

const grid = document.getElementById("wishlistProducts");
const emptyState = document.getElementById("emptyWishlist");
const countElement = document.getElementById("wishlistCount");
const message = document.getElementById("wishlistMessage");
const cartCount = document.getElementById("cartCount");

function getWishlist() {
    try {
        const list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

        return Array.isArray(list)
            ? list.filter(name => typeof name === "string" && catalog[name])
            : [];

    } catch {
        return [];
    }
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

        cartCount.textContent = Array.isArray(cart)
            ? cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
            : 0;

    } catch {
        cartCount.textContent = "0";
    }
}

function addToBag(name) {
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        cart = [];
    }

    if (!Array.isArray(cart)) {
        cart = [];
    }

    const item = catalog[name];

    const existing = cart.find(product =>
        product.name === name &&
        !product.size &&
        !product.color
    );

    if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + 1;

    } else {
        cart.push({
            name: name,
            price: item.price,
            quantity: 1,
            size: "",
            color: ""
        });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateCartCount();
}

function renderWishlist() {
    const wishlist = getWishlist();

    grid.replaceChildren();

    countElement.textContent = `(${wishlist.length})`;

    emptyState.hidden = wishlist.length !== 0;

    wishlist.forEach(name => {
        const item = catalog[name];

        const card = document.createElement("article");
        card.className = "wishlist-card";

        const link = document.createElement("a");
        link.href = `product.html?name=${encodeURIComponent(name)}`;

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = name;

        link.appendChild(image);

        const info = document.createElement("div");
        info.className = "wishlist-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = item.category;

        const title = document.createElement("h3");
        title.textContent = name;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "₹" + item.price.toLocaleString("en-IN");

        const actions = document.createElement("div");
        actions.className = "wishlist-actions";

        const add = document.createElement("button");
        add.className = "wishlist-add-btn";
        add.textContent = "ADD TO BAG";

        add.addEventListener("click", () => {
            addToBag(name);

            message.textContent = `${name} added to your bag.`;
        });

        const remove = document.createElement("button");
        remove.className = "wishlist-remove-btn";
        remove.textContent = "REMOVE";

        remove.addEventListener("click", () => {
            const updatedWishlist = getWishlist().filter(
                value => value !== name
            );

            localStorage.setItem(
                WISHLIST_KEY,
                JSON.stringify(updatedWishlist)
            );

            renderWishlist();

            message.textContent = `${name} removed from wishlist.`;
        });

        actions.append(add, remove);

        info.append(category, title, price, actions);

        card.append(link, info);

        grid.appendChild(card);
    });
}

updateCartCount();
renderWishlist();