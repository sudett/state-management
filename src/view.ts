import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  addToCart,
} from "./model.js";
import { state } from "./store.js";
import { CART_EVENTS, CartEvent, ProductItem } from "./types.js";

const main = document.querySelector("main");

function createProductItem(product: ProductItem) {
  const productEl = document.createElement("article");
  productEl.classList.add("product-item");
  productEl.dataset.id = `${product.id}`;

  const productImageContainer = document.createElement("a");
  productImageContainer.href = `/product-details.html?id=${product.id}`;
  productImageContainer.target = "_self";

  const productImage = document.createElement("img");
  productImage.src = product.img;
  productImage.classList.add("product-img");
  productImageContainer.appendChild(productImage);
  productEl.appendChild(productImageContainer);

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

  const productIndex = state.cartItems.findIndex(
    (item) => item.product.id === product.id,
  );

  function addToCartHandler(e: MouseEvent) {
    e.stopPropagation();
    addToCart(product);
  }

  if (productIndex === -1) {
    quantityStepperButton.textContent = "Add to cart";
    quantityStepperButton.addEventListener("click", addToCartHandler);
  } else {
    quantityStepperButton.removeEventListener("click", addToCartHandler);
    quantityStepperButton.appendChild(
      createQuantityStepperUI(state.cartItems[productIndex].quantity),
    );
  }

  cartDetailsContainer.appendChild(quantityStepperButton);
  productEl.appendChild(cartDetailsContainer);
  main?.appendChild(productEl);
}

function calculateTargetProductId(e: MouseEvent) {
  if (!(e.target instanceof HTMLElement)) {
    return;
  }

  const targetItem = e.target.closest("*[data-id]");

  if (!(targetItem instanceof HTMLElement)) {
    return;
  }

  return Number(targetItem.dataset.id);
}

function handleRemoveFromCart(e: MouseEvent) {
  e.stopPropagation();
  const targetProductId = calculateTargetProductId(e);

  if (targetProductId !== undefined) {
    removeFromCart(targetProductId);
  }
}

function handleIncreaseQuantity(e: MouseEvent) {
  e.stopPropagation();
  const targetProductId = calculateTargetProductId(e);
  if (targetProductId !== undefined) {
    increaseQuantity(targetProductId);
  }
}

function handleDecreaseQuantity(e: MouseEvent) {
  e.stopPropagation();
  const targetProductId = calculateTargetProductId(e);
  if (targetProductId !== undefined) {
    decreaseQuantity(targetProductId);
  }
}

function createQuantityStepperUI(productQuantity: number) {
  const quantityStepperContainer = document.createElement("div");
  quantityStepperContainer.classList.add("quantity-stepper");

  if (productQuantity === 1) {
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("stepper-btn", "remove-btn");
    removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
    removeBtn.addEventListener("click", handleRemoveFromCart);
    quantityStepperContainer.appendChild(removeBtn);
  } else {
    const decreaseBtn = document.createElement("button");
    decreaseBtn.classList.add("stepper-btn", "decrease-btn");
    decreaseBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
    decreaseBtn.addEventListener("click", handleDecreaseQuantity);
    quantityStepperContainer.appendChild(decreaseBtn);
  }

  const itemQuantity = document.createElement("span");
  itemQuantity.textContent = `${productQuantity}`;
  quantityStepperContainer.appendChild(itemQuantity);

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("stepper-btn", "increase-btn");
  increaseBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
  increaseBtn.addEventListener("click", handleIncreaseQuantity);
  quantityStepperContainer.appendChild(increaseBtn);

  return quantityStepperContainer;
}

function updateQuantityStepperUI({
  productId,
  eventType,
  quantityStepperBtn,
}: CartEvent & { quantityStepperBtn: HTMLButtonElement }) {
  const targetProduct = state.cartItems.find(
    (item) => item.product.id === productId,
  );

  if (!targetProduct) {
    return;
  }

  const itemQuantity = quantityStepperBtn.querySelector("span");
  if (itemQuantity) {
    itemQuantity.textContent = `${targetProduct.quantity}`;
  }

  if (
    eventType === CART_EVENTS.ITEM_INCREASED &&
    targetProduct.quantity === 2
  ) {
    const removeBtn = quantityStepperBtn.querySelector(".remove-btn");
    if (!(removeBtn instanceof HTMLButtonElement)) {
      return;
    }

    removeBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
    removeBtn.classList.remove("remove-btn");
    removeBtn.classList.add("decrease-btn");
    removeBtn.removeEventListener("click", handleRemoveFromCart);
    removeBtn.addEventListener("click", handleDecreaseQuantity);
  }

  if (
    eventType === CART_EVENTS.ITEM_DECREASED &&
    targetProduct.quantity === 1
  ) {
    const decreaseBtn = quantityStepperBtn.querySelector(".decrease-btn");
    if (!(decreaseBtn instanceof HTMLButtonElement)) {
      return;
    }

    decreaseBtn.innerHTML = '<i class="fa fa-trash"></i>';
    decreaseBtn.classList.remove("decrease-btn");
    decreaseBtn.classList.add("remove-btn");
    decreaseBtn.removeEventListener("click", handleDecreaseQuantity);
    decreaseBtn.addEventListener("click", handleRemoveFromCart);
  }
}

function renderProducts({ productId, eventType }: CartEvent) {
  if (!main) {
    return;
  }

  const targetItem = main.querySelector(`article[data-id="${productId}"]`);

  if (!targetItem) {
    return;
  }

  const quantityStepperBtn = targetItem.querySelector(".quantity-stepper-btn");

  if (!(quantityStepperBtn instanceof HTMLButtonElement)) {
    return;
  }

  if (eventType === CART_EVENTS.ITEM_REMOVED) {
    quantityStepperBtn.innerHTML = "";
    quantityStepperBtn.textContent = "Add to cart";
  } else if (eventType === CART_EVENTS.ITEM_ADDED) {
    const targetItem = state.cartItems.find(
      (item) => item.product.id === productId,
    );
    quantityStepperBtn.textContent = "";
    if (targetItem) {
      quantityStepperBtn.appendChild(
        createQuantityStepperUI(targetItem.quantity),
      );
    }
  } else {
    updateQuantityStepperUI({ productId, eventType, quantityStepperBtn });
  }
}

export {
  renderProducts,
  createProductItem,
  createQuantityStepperUI,
  updateQuantityStepperUI,
};
