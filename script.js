"use strict";

const CART_KEY = "stylekart-cart";
const WISHLIST_KEY = "stylekart-wishlist";

const productCards = Array.from(document.querySelectorAll(".product-card"));
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");
const cartCount = document.getElementById("cartCount");

function readStorage(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = readStorage(CART_KEY, []);

    const count = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
        : 0;

    if (cartCount) {
        cartCount.textContent = count;
    }
}

function addProductToCart(name, price) {
    const cart = readStorage(CART_KEY, []);

    const existing = cart.find(item =>
        item.name === name &&
        !item.size &&
        !item.color
    );

    if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1,
            size: "",
            color: ""
        });
    }

    saveCart(cart);
}

// Add to Bag buttons
productCards.forEach(card => {
    const addButton = card.querySelector(".add-btn");

    addButton.addEventListener("click", () => {
        addProductToCart(
            addButton.dataset.name,
            addButton.dataset.price
        );

        const oldText = addButton.textContent;

        addButton.textContent = "ADDED ✓";
        addButton.disabled = true;

        setTimeout(() => {
            addButton.textContent = oldText;
            addButton.disabled = false;
        }, 900);
    });
});

// Wishlist
function readWishlist() {
    const list = readStorage(WISHLIST_KEY, []);

    return Array.isArray(list) ? list : [];
}

function refreshHeartButtons() {
    const wishlist = readWishlist();

    productCards.forEach(card => {
        const button = card.querySelector(".wishlist-btn");
        const name = card.querySelector("h3").textContent.trim();

        const saved = wishlist.includes(name);

        button.textContent = saved ? "♥" : "♡";
        button.classList.toggle("active", saved);
    });
}

productCards.forEach(card => {
    const heart = card.querySelector(".wishlist-btn");

    heart.addEventListener("click", () => {
        const name = card.querySelector("h3").textContent.trim();

        let wishlist = readWishlist();

        if (wishlist.includes(name)) {
            wishlist = wishlist.filter(item => item !== name);
        } else {
            wishlist.push(name);
        }

        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));

        refreshHeartButtons();
    });
});

// Search
function updateNoResults() {
    if (noResults) {
        noResults.hidden = productCards.some(card => !card.hidden);
    }
}

function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();

    productCards.forEach(card => {
        card.hidden = !card.textContent.toLowerCase().includes(query);
    });

    updateNoResults();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchProducts();
    }
});

searchInput.addEventListener("input", () => {
    if (!searchInput.value.trim()) {
        productCards.forEach(card => {
            card.hidden = false;
        });

        updateNoResults();
        filterAndSortProducts();
    }
});

// Category Filters and Price Sorting
const filterButtons = document.querySelectorAll(".filter-btn");
const priceSort = document.getElementById("priceSort");
const productGrid = document.querySelector(".product-grid");

let selectedCategory = "all";
const originalOrder = [...productCards];

function getPrice(card) {
    return Number(
        card.querySelector(".price").textContent.replace(/[^\d]/g, "")
    ) || 0;
}

function filterAndSortProducts() {
    productCards.forEach(card => {
        const matches =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        card.hidden = !matches;
    });

    const visibleProducts = productCards.filter(card => !card.hidden);

    if (priceSort.value === "low-high") {
        visibleProducts.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (priceSort.value === "high-low") {
        visibleProducts.sort((a, b) => getPrice(b) - getPrice(a));
    } else {
        visibleProducts.sort(
            (a, b) => originalOrder.indexOf(a) - originalOrder.indexOf(b)
        );
    }

    visibleProducts.forEach(card => {
        productGrid.appendChild(card);
    });

    updateNoResults();
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        filterButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        filterAndSortProducts();
    });
});

priceSort.addEventListener("change", filterAndSortProducts);

// Initial setup
updateCartCount();
refreshHeartButtons();
filterAndSortProducts();