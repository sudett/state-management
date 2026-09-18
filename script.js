const products = [
  {
    id: 1,
    name: "case",
    price: 150,
    img: "images/case.jpeg",
  },
  {
    id: 2,
    name: "earbuds",
    price: 50,
    img: "images/earbuds.jpg",
  },
  {
    id: 3,
    name: "headphone",
    price: 75,
    img: "images/headphone.webp",
  },
  {
    id: 4,
    name: "keyboard",
    price: 70,
    img: "images/keyboard.jpeg",
  },
  {
    id: 5,
    name: "laptop",
    price: 500,
    img: "images/laptop.jpeg",
  },
  {
    id: 6,
    name: "monitor",
    price: 130,
    img: "images/monitor.webp",
  },
  {
    id: 7,
    name: "mouse",
    price: 40,
    img: "images/mouse.jpeg",
  },
  {
    id: 8,
    name: "printer",
    price: 170,
    img: "images/printer.jpeg",
  },
  {
    id: 9,
    name: "scanner",
    price: 110,
    img: "images/scanner.jpeg",
  },
];

const main = document.querySelector("main");
const sidebar = document.querySelector("aside");
const nav = document.querySelector("nav");
const cartQuantity = document.querySelector(".cart-quantity");
const sidebarList = document.querySelector(".side-list");

const state = {
  cartItems: [],
  targetProduct: null,
};

const subscribers = [];

function subscribe(callback) {
  subscribers.push(callback);
}

function notify() {
  subscribers.forEach((callback) => callback());
}

window.addEventListener("load", () => {
  products.forEach((product) => {
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
  });
});

function addToCart(product) {
  state.cartItems.push({ product, quantity: 1 });
  state.targetProduct = state.cartItems[state.cartItems.length - 1];

  notify();
}

function removeFromCart(e) {
  e.stopPropagation();
  const targetItem = e.target.closest("*[data-id]");
  const targetId = Number(targetItem.dataset.id);

  const targetIndex = state.cartItems.findIndex(
    (item) => item.product.id === targetId,
  );

  state.targetProduct = { ...state.cartItems[targetIndex], quantity: 0 };
  state.cartItems.splice(targetIndex, 1);

  notify();
}

function increaseQuantity(e) {
  const targetItem = e.target.closest("*[data-id]");
  const targetId = Number(targetItem.dataset.id);

  state.cartItems = state.cartItems.map((item) => {
    if (item.product.id !== targetId) {
      return item;
    }

    state.targetProduct = { ...item, quantity: item.quantity + 1 };
    return { ...item, quantity: item.quantity + 1 };
  });

  notify();
}

function decreaseQuantity(e) {
  const targetItem = e.target.closest("*[data-id]");
  const targetId = Number(targetItem.dataset.id);

  state.cartItems = state.cartItems.map((item) => {
    if (item.product.id !== targetId) {
      return item;
    }

    state.targetProduct = { ...item, quantity: item.quantity - 1 };
    return { ...item, quantity: item.quantity - 1 };
  });

  notify();
}

function createQuantityStepperUI() {
  const quantityStepperContainer = document.createElement("div");
  quantityStepperContainer.classList.add("quantity-stepper");

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("stepper-btn", "remove-btn", "remove-subtract-btn");
  removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
  removeBtn.addEventListener("click", removeFromCart);
  quantityStepperContainer.appendChild(removeBtn);

  const itemQuantity = document.createElement("span");
  itemQuantity.textContent = "1";
  quantityStepperContainer.appendChild(itemQuantity);

  const increaseBtn = document.createElement("button");
  increaseBtn.classList.add("stepper-btn", "increase-btn");
  increaseBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
  increaseBtn.addEventListener("click", increaseQuantity);
  quantityStepperContainer.appendChild(increaseBtn);

  return quantityStepperContainer;
}

function updateQuantityStepperUI(quantityStepper) {
  if (state.targetProduct.quantity === 2) {
    const removeSubtractBtn = quantityStepper.querySelector(
      ".remove-subtract-btn",
    );

    if (removeSubtractBtn.classList.contains("remove-btn")) {
      removeSubtractBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
      removeSubtractBtn.classList.remove("remove-btn");
      removeSubtractBtn.classList.add("subtract-btn");
      removeSubtractBtn.removeEventListener("click", removeFromCart);
      removeSubtractBtn.addEventListener("click", decreaseQuantity);
    } else if (removeSubtractBtn.classList.contains("subtract-btn")) {
      removeSubtractBtn.innerHTML = '<i class="fa fa-trash"></i>';
      removeSubtractBtn.classList.remove("subtract-btn");
      removeSubtractBtn.classList.add("remove-btn");
      removeSubtractBtn.removeEventListener("click", decreaseQuantity);
      removeSubtractBtn.addEventListener("click", removeFromCart);
    }
  }

  const itemQuantity = quantityStepper.querySelector("span");
  itemQuantity.textContent = state.targetProduct.quantity;
}

function createSideItem() {
  const sideItem = document.createElement("li");
  sideItem.classList.add("side-item");
  sideItem.dataset.id = state.targetProduct.product.id;

  const sideTopContainer = document.createElement("div");
  sideTopContainer.classList.add("side-top-container");
  sideItem.appendChild(sideTopContainer);

  const sideImage = document.createElement("img");
  sideImage.classList.add("side-image");
  sideImage.src = state.targetProduct.product.img;
  sideTopContainer.appendChild(sideImage);

  const itemPrice = document.createElement("span");
  itemPrice.textContent = `${state.targetProduct.product.price}$`;
  sideTopContainer.appendChild(itemPrice);

  const quantityStepperBtn = document.createElement("button");
  quantityStepperBtn.classList.add("quantity-stepper-btn");

  quantityStepperBtn.appendChild(createQuantityStepperUI());
  sideItem.appendChild(quantityStepperBtn);

  sidebarList.appendChild(sideItem);
}

function removeSideItem() {
  const targetListItem = sidebarList.querySelector(
    `li[data-id="${state.targetProduct.product.id}"]`,
  );

  sidebarList.removeChild(targetListItem);
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

function renderSidebar() {
  toggleSidebar();

  console.log(state);

  if (state.targetProduct.quantity === 0) {
    removeSideItem();
  } else if (state.targetProduct.quantity === 1) {
    createSideItem();
  } else {
    const targetItem = sidebarList.querySelector(
      `li[data-id="${state.targetProduct.product.id}"]`,
    );

    const quantityStepperBtn = targetItem.querySelector(
      ".quantity-stepper-btn",
    );

    updateQuantityStepperUI(quantityStepperBtn);
  }
}

function renderProducts() {
  const targetItem = main.querySelector(
    `article[data-id="${state.targetProduct.product.id}"]`,
  );

  const quantityStepperBtn = targetItem.querySelector(".quantity-stepper-btn");

  if (state.targetProduct.quantity === 0) {
    quantityStepperBtn.innerHTML = "";
    quantityStepperBtn.textContent = "Add to cart";
  } else if (state.targetProduct.quantity === 1) {
    quantityStepperBtn.textContent = "";
    quantityStepperBtn.appendChild(createQuantityStepperUI());
  } else {
    updateQuantityStepperUI(quantityStepperBtn);
  }
}

function renderCartQuantity() {
  const totalItems = state.cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  cartQuantity.textContent = totalItems;
}

function render() {
  renderCartQuantity();
  renderProducts();
  renderSidebar();
}

subscribe(() => {
  render();
});
