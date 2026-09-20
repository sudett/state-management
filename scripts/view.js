import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  addToCart,
} from "./model.js";
import { state } from "./store.js";

const sidebarList = document.querySelector(".side-list");
const sidebar = document.querySelector("aside");
const cartQuantity = document.querySelector(".cart-quantity");
const main = document.querySelector("main");

function createProductItem(product) {
  const productItem = document.createElement("article");
  productItem.classList.add("product-item");
  productItem.dataset.id = product.id;

  const productImage = document.createElement("img");
  productImage.src = product.img;
  productImage.classList.add("product-img");
  productItem.appendChild(productImage);

  const cartDetailsContainer = document.createElement("div");
  cartDetailsContainer.classList.add("cart-details-container");

  const itemName = document.createElement("h3");
  itemName.textContent = product.name;
  cartDetailsContainer.appendChild(itemName);

  const itemPrice = document.createElement("span");
  itemPrice.textContent = `${product.price}$`;
  cartDetailsContainer.appendChild(itemPrice);

  const quantityStepperButton = document.createElement("button");
  quantityStepperButton.classList.add("quantity-stepper-btn");
  quantityStepperButton.textContent = "Add to cart";
  quantityStepperButton.addEventListener("click", () => {
    const productIndex = state.cartItems.findIndex(
      (item) => item.product.id === product.id,
    );

    if (productIndex === -1) {
      addToCart(product);
    }
  });

  cartDetailsContainer.appendChild(quantityStepperButton);
  productItem.appendChild(cartDetailsContainer);
  main.appendChild(productItem);
}

function calculateTargetProductId(e) {
  const targetItem = e.target.closest("*[data-id]");
  return Number(targetItem.dataset.id);
}

function handleRemoveFromCart(e) {
  e.stopPropagation();
  const targetProductId = calculateTargetProductId(e);
  removeFromCart(targetProductId);
}

function handleIncreaseQuantity(e) {
  const targetProductId = calculateTargetProductId(e);
  increaseQuantity(targetProductId);
}

function handleDecreaseQuantity(e) {
  e.stopPropagation();
  const targetProductId = calculateTargetProductId(e);
  decreaseQuantity(targetProductId);
}

function createQuantityStepperUI() {
  const quantityStepperContainer = document.createElement("div");
  quantityStepperContainer.classList.add("quantity-stepper");

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("stepper-btn", "remove-btn");
  removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
  removeBtn.addEventListener("click", handleRemoveFromCart);
  quantityStepperContainer.appendChild(removeBtn);

  const itemQuantity = document.createElement("span");
  itemQuantity.textContent = "1";
  quantityStepperContainer.appendChild(itemQuantity);

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("stepper-btn", "increase-btn");
  increaseBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
  increaseBtn.addEventListener("click", handleIncreaseQuantity);
  quantityStepperContainer.appendChild(increaseBtn);

  return quantityStepperContainer;
}

function updateQuantityStepperUI({ productId, eventType, quantityStepperBtn }) {
  const targetProduct = state.cartItems.find(
    (item) => item.product.id === productId,
  );

  if (!targetProduct) {
    return;
  }

  if (eventType === "ITEM_INCREASED" && targetProduct.quantity === 2) {
    const removeBtn = quantityStepperBtn.querySelector(".remove-btn");
    removeBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
    removeBtn.classList.remove("remove-btn");
    removeBtn.classList.add("decrease-btn");
    removeBtn.removeEventListener("click", handleRemoveFromCart);
    removeBtn.addEventListener("click", handleDecreaseQuantity);
  }

  if (eventType === "ITEM_DECREASED" && targetProduct.quantity === 1) {
    const decreaseBtn = quantityStepperBtn.querySelector(".decrease-btn");
    decreaseBtn.innerHTML = '<i class="fa fa-trash"></i>';
    decreaseBtn.classList.remove("decrease-btn");
    decreaseBtn.classList.add("remove-btn");
    decreaseBtn.removeEventListener("click", handleDecreaseQuantity);
    decreaseBtn.addEventListener("click", handleRemoveFromCart);
  }

  const itemQuantity = quantityStepperBtn.querySelector("span");
  itemQuantity.textContent = targetProduct.quantity;
}

function createSideItem(productId) {
  const targetProduct = state.cartItems.find(
    (item) => item.product.id === productId,
  );
  const sideItem = document.createElement("li");
  sideItem.classList.add("side-item");
  sideItem.dataset.id = productId;

  const sideTopContainer = document.createElement("div");
  sideTopContainer.classList.add("side-top-container");
  sideItem.appendChild(sideTopContainer);

  const sideImage = document.createElement("img");
  sideImage.classList.add("side-image");
  sideImage.src = targetProduct.product.img;
  sideTopContainer.appendChild(sideImage);

  const itemPrice = document.createElement("span");
  itemPrice.textContent = `${targetProduct.product.price}$`;
  sideTopContainer.appendChild(itemPrice);

  const quantityStepperBtn = document.createElement("button");
  quantityStepperBtn.classList.add("quantity-stepper-btn");

  quantityStepperBtn.appendChild(createQuantityStepperUI());
  sideItem.appendChild(quantityStepperBtn);

  sidebarList.appendChild(sideItem);
}

function removeSideItem(productId) {
  const targetListItem = sidebarList.querySelector(
    `li[data-id="${productId}"]`,
  );

  if (targetListItem) {
    sidebarList.removeChild(targetListItem);
  }
}

function toggleSidebar() {
  const navMainContainer = document.querySelector(".nav-main-container");
  if (state.cartItems.length === 0) {
    sidebar.classList.add("hide-sidebar");
    navMainContainer.style.width = "100%";
  } else {
    sidebar.classList.remove("hide-sidebar");
    navMainContainer.style.width = "calc(100% - 10rem)";
  }
}

function renderSidebar({ productId, eventType }) {
  toggleSidebar();

  if (eventType === "ITEM_REMOVED") {
    removeSideItem(productId);
  } else if (eventType === "ITEM_ADDED") {
    createSideItem(productId);
  } else {
    const targetItem = sidebarList.querySelector(`li[data-id="${productId}"]`);

    const quantityStepperBtn = targetItem.querySelector(
      ".quantity-stepper-btn",
    );

    updateQuantityStepperUI({ productId, eventType, quantityStepperBtn });
  }
}

function renderProducts({ productId, eventType }) {
  const targetItem = main.querySelector(`article[data-id="${productId}"]`);

  const quantityStepperBtn = targetItem.querySelector(".quantity-stepper-btn");

  if (eventType === "ITEM_REMOVED") {
    quantityStepperBtn.innerHTML = "";
    quantityStepperBtn.textContent = "Add to cart";
  } else if (eventType === "ITEM_ADDED") {
    quantityStepperBtn.textContent = "";
    quantityStepperBtn.appendChild(createQuantityStepperUI());
  } else {
    updateQuantityStepperUI({ productId, eventType, quantityStepperBtn });
  }
}

function renderCartQuantity() {
  const totalItems = state.cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  cartQuantity.textContent = totalItems;
}

export { renderCartQuantity, renderProducts, renderSidebar, createProductItem };
