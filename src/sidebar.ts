import { state } from "./store.js";
import { CART_EVENTS, CartEvent } from "./types.js";
import { createQuantityStepperUI, updateQuantityStepperUI } from "./view.js";

const sidebarList = document.querySelector(".side-list");
const sidebar = document.querySelector("aside");

function createSideItem(productId: number) {
  const targetProduct = state.cartItems.find(
    (item) => item.product.id === productId,
  );
  if (!targetProduct || !sidebarList) {
    return;
  }

  const sideItem = document.createElement("li");
  sideItem.classList.add("side-item");
  sideItem.dataset.id = `${productId}`;

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

  quantityStepperBtn.appendChild(
    createQuantityStepperUI(targetProduct.quantity),
  );
  sideItem.appendChild(quantityStepperBtn);

  sidebarList.appendChild(sideItem);
}

function removeSideItem(productId: number) {
  if (!sidebarList) {
    return;
  }

  const targetListItem = sidebarList.querySelector(
    `li[data-id="${productId}"]`,
  );

  if (targetListItem) {
    sidebarList.removeChild(targetListItem);
  }
}

function toggleSidebar() {
  const navMainContainer = document.querySelector(".nav-main-container");
  if (!sidebar || !(navMainContainer instanceof HTMLDivElement)) {
    return;
  }

  if (state.cartItems.length === 0) {
    sidebar.classList.add("hide-sidebar");
    navMainContainer.style.width = "100%";
  } else {
    sidebar.classList.remove("hide-sidebar");
    navMainContainer.style.width = "calc(100% - 10rem)";
  }
}

function renderSidebar(sideParam?: CartEvent) {
  toggleSidebar();

  if (!sidebarList) {
    return;
  }

  if (!sideParam) {
    sidebarList.innerHTML = "";
    state.cartItems.forEach((item) => {
      createSideItem(item.product.id);
    });
    return;
  }

  const { productId, eventType } = sideParam;

  if (eventType === CART_EVENTS.ITEM_REMOVED) {
    removeSideItem(productId);
  } else if (eventType === CART_EVENTS.ITEM_ADDED) {
    createSideItem(productId);
  } else {
    const targetItem = sidebarList.querySelector(`li[data-id="${productId}"]`);

    if (!targetItem) {
      return;
    }

    const quantityStepperBtn = targetItem.querySelector(
      ".quantity-stepper-btn",
    );

    if (quantityStepperBtn instanceof HTMLButtonElement) {
      updateQuantityStepperUI({ productId, eventType, quantityStepperBtn });
    }
  }
}

export { renderSidebar };
