"use strict";

const CART_KEY = "stylekart-cart";

const productCatalog = {
    "Classic T-Shirt": {
        price: 599,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        description: "A comfortable everyday T-shirt with a simple and stylish design.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Blue"]
    },

    "Elegant Dress": {
        price: 1299,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        description: "An elegant dress designed to make your everyday style special.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Pink", "Blue"]
    },

    "Sport Sneakers": {
        price: 1499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        description: "Sporty sneakers for comfortable everyday movement.",
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Red", "White", "Black"]
    },

    "Everyday Handbag": {
        price: 899,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        description: "A versatile handbag that complements your everyday outfits.",
        sizes: ["Free Size"],
        colors: ["Brown", "Black", "Beige"]
    },

    "Kids Outfit": {
        price: 799,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
        description: "A cute and comfortable outfit for little fashion lovers.",
        sizes: ["2-3Y", "4-5Y", "6-7Y"],
        colors: ["Yellow", "Blue", "Pink"]
    },

    "Beauty Essentials": {
        price: 499,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
        description: "Everyday beauty essentials for your personal care routine.",
        sizes: ["Standard"],
        colors: ["Assorted"]
    },

    "Casual Jacket": {
        price: 1599,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        description: "A casual jacket that adds a stylish layer to your outfit.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige", "Black", "Brown"]
    },

    "Urban Jacket": {
        price: 1899,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        description: "A modern jacket for a confident urban look.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Brown", "Olive"]
    },

    "Classic Heels": {
        price: 1099,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
        description: "Classic heels that add elegance to your outfit.",
        sizes: ["5", "6", "7", "8", "9"],
        colors: ["Black", "Nude", "Red"]
    },

    "Everyday Watch": {
        price: 999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        description: "A timeless watch for everyday style.",
        sizes: ["Free Size"],
        colors: ["Silver", "Black", "Gold"]
    },

    "Summer Top": {
        price: 699,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        description: "A lightweight top for a fresh and relaxed summer look.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Pink", "Green"]
    },

    "Street Style Outfit": {
        price: 1399,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
        description: "A trendy outfit inspired by modern street fashion.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Grey", "Blue"]
    }
};

const params = new URLSearchParams(window.location.search);

const productName = params.get("name");
const product = productCatalog[productName];

const details = document.getElementById("productDetails");
const notFound = document.getElementById("productNotFound");

const sizeOptions = document.getElementById("sizeOptions");
const colorOptions = document.getElementById("colorOptions");

const message = document.getElementById("selectionMessage");
const addButton = document.getElementById("addToBagBtn");
const cartCount = document.getElementById("cartCount");

let selectedSize = "";
let selectedColor = "";

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

function makeOptions(container, options, type) {
    options.forEach((value, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = value;

        button.className = "option-button";

        if (index === 0) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            container.querySelectorAll("button").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            if (type === "size") {
                selectedSize = value;
            } else {
                selectedColor = value;
            }
        });

        container.appendChild(button);
    });

    if (type === "size") {
        selectedSize = options[0];
    } else {
        selectedColor = options[0];
    }
}

if (!product) {
    details.hidden = true;
    notFound.hidden = false;

} else {
    document.title = `${productName} | StyleKart`;

    document.getElementById("productName").textContent = productName;

    document.getElementById("productPrice").textContent =
        "₹" + product.price.toLocaleString("en-IN");

    document.getElementById("productDescription").textContent =
        product.description;

    const image = document.getElementById("productImage");

    image.src = product.image;
    image.alt = productName;

    makeOptions(sizeOptions, product.sizes, "size");
    makeOptions(colorOptions, product.colors, "color");

    addButton.addEventListener("click", () => {
        let cart = [];

        try {
            cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        } catch {
            cart = [];
        }

        if (!Array.isArray(cart)) {
            cart = [];
        }

        const existing = cart.find(item =>
            item.name === productName &&
            (item.size || "") === selectedSize &&
            (item.color || "") === selectedColor
        );

        if (existing) {
            existing.quantity = (Number(existing.quantity) || 0) + 1;

        } else {
            cart.push({
                name: productName,
                price: product.price,
                quantity: 1,
                size: selectedSize,
                color: selectedColor
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        updateCartCount();

        message.textContent = "Product added to your bag successfully!";

        addButton.textContent = "ADDED TO BAG ✓";

        setTimeout(() => {
            addButton.textContent = "ADD TO BAG";
        }, 1200);
    });
}

updateCartCount();