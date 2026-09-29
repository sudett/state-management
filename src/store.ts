import { renderCartQuantity, renderProducts, renderSidebar } from "./view.js";
import { CartEvent, CartItem, SubscriberCallback } from "./types.js";

const state: { cartItems: CartItem[] } = {
  cartItems: [],
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
