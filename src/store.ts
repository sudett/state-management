import { renderProducts } from "./view.js";
import { renderSidebar } from "./sidebar.js";
import { renderCartQuantity } from "./navbar.js";
import { CartEvent, CartItem, SubscriberCallback } from "./types.js";

const savedCartItems = localStorage.getItem("cart");

const state: { cartItems: CartItem[] } = {
  cartItems: savedCartItems ? (JSON.parse(savedCartItems) as CartItem[]) : [],
};

const subscribers: SubscriberCallback[] = [];

function subscribe(callback: SubscriberCallback) {
  subscribers.push(callback);
}

function notify(event: CartEvent) {
  subscribers.forEach((callback) => callback(event));
}

subscribe((event: CartEvent) => {
  renderCartQuantity();
  renderProducts(event);
  renderSidebar(event);
});

export { state, notify };
