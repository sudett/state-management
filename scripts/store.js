import { renderCartQuantity, renderProducts, renderSidebar } from "./view.js";

const state = {
  cartItems: [],
};

const subscribers = [];

function subscribe(callback) {
  subscribers.push(callback);
}

function notify(event) {
  subscribers.forEach((callback) => callback(event));
}

subscribe((event) => {
  renderCartQuantity();
  renderProducts(event);
  renderSidebar(event);
});

export { state, notify };
