import { state } from "./store.js";

function renderNav() {
  const navigation = document.querySelector(".main-nav");
  if (!navigation) {
    return;
  }

  const navList = document.createElement("ul");
  const listItem = document.createElement("li");
  const listItemLink = document.createElement("a");
  listItemLink.textContent = "HOME";
  listItemLink.href = "index.html";
  listItem.appendChild(listItemLink);
  navList.appendChild(listItem);
  navigation.appendChild(navList);

  const cartIconContainer = document.createElement("div");
  cartIconContainer.classList.add("cart-icon-container");
  cartIconContainer.innerHTML = `<i class="fa-solid fa-cart-shopping fa-2x"></i>`;

  const cartQuantity = document.createElement("span");
  cartQuantity.classList.add("cart-quantity");
  cartIconContainer.appendChild(cartQuantity);
  navigation.appendChild(cartIconContainer);

  renderCartQuantity();
}

function renderCartQuantity() {
  const navigation = document.querySelector(".main-nav");
  const cartQuantity = navigation?.querySelector(".cart-quantity");

  if (!cartQuantity) {
    return;
  }
  const totalItems = state.cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  cartQuantity.textContent = `${totalItems}`;
}

export { renderNav, renderCartQuantity };
