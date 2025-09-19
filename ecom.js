// Product data example
const products = [
  {
    id: 1,
    name: "Men's T-Shirt",
    category: "men",
    price: 799,
    originalPrice: 999,
    image: "fas fa-tshirt",
    badge: "New",
  },
  {
    id: 2,
    name: "Women's Dress",
    category: "women",
    price: 1299,
    originalPrice: 1599,
    image: "fas fa-female",
    badge: "Sale",
  },
  {
    id: 3,
    name: "Leather Wallet",
    category: "accessories",
    price: 499,
    originalPrice: 699,
    image: "fas fa-wallet",
    badge: "",
  },
  // Add more products as needed
];

let displayedProducts = 8;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartItems = document.getElementById("cartItems");

// Render products
function renderProducts(filter = "all") {
  if (!productGrid) return;

  let filteredProducts = products;
  if (filter !== "all") {
    filteredProducts = products.filter(
      (product) => product.category === filter
    );
  }

  const productsToShow = filteredProducts.slice(0, displayedProducts);

  productGrid.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="${product.image}"></i>
                ${
                  product.badge
                    ? `<div class="product-badge">${product.badge}</div>`
                    : ""
                }
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${
                  product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)
                }</p>
                <div class="product-price">
                    <span class="current-price">&#8377;${product.price}</span>
                    ${
                      product.originalPrice
                        ? `<span class="original-price">&#8377;${product.originalPrice}</span>`
                        : ""
                    }
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `
    )
    .join("");

  // Add animation to product cards
  setTimeout(() => {
    document.querySelectorAll(".product-card").forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  }, 100);
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
  showNotification(`${product.name} added to cart!`, "success");
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }

  // Update cart total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }

  // Update cart items display
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="${item.image}"></i>
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">&#8377;${item.price}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${
                          item.id
                        }, ${item.quantity - 1})">-</button>
                        <span style="margin: 0 0.5rem; font-weight: 600;">${
                          item.quantity
                        }</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${
                          item.id
                        }, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${
                          item.id
                        })" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `
        )
        .join("");
    }
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
  const cartItem = cart.find((item) => item.id === productId);
  if (!cartItem) return;
  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    cartItem.quantity = newQuantity;
  }
  updateCartUI();
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

// Cart modal toggle
function toggleCart() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.toggle("active");
  }
}

// Show notification
function showNotification(message, type = "info") {
  let notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Simulate checkout process
  showNotification("Processing your order...", "info");

  setTimeout(() => {
    showNotification(
      `Order placed successfully! Total: &#8377;${total.toFixed(2)}`,
      "success"
    );
    cart = [];
    updateCartUI();
    toggleCart();
  }, 2000);
}

// Filter products
function filterProducts(category) {
  renderProducts(category);
}

// Load more products
function loadMoreProducts() {
  displayedProducts += 4;
  renderProducts();
}

// Scroll to products
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Scroll to categories
function scrollToCategories() {
  document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("active");
  }
}
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
  }
}

// Newsletter subscribe
function subscribeNewsletter(event) {
  event.preventDefault();
  showNotification("Subscribed to newsletter!", "success");
  event.target.reset();
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
