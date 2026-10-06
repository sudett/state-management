import { state, notify } from "./store.js";
import { CART_EVENTS, ProductItem } from "./types.js";

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(state.cartItems));
}

function addToCart(product: ProductItem) {
  state.cartItems.push({ product, quantity: 1 });
  saveCartToLocalStorage();

  notify({ productId: product.id, eventType: CART_EVENTS.ITEM_ADDED });
}

function removeFromCart(targetProductId: number) {
  const targetIndex = state.cartItems.findIndex(
    (item) => item.product.id === targetProductId,
  );

  if (targetIndex === -1) {
    return;
  }

  state.cartItems.splice(targetIndex, 1);
  saveCartToLocalStorage();

  notify({ productId: targetProductId, eventType: CART_EVENTS.ITEM_REMOVED });
}

function increaseQuantity(targetProductId: number) {
  state.cartItems = state.cartItems.map((item) => {
    if (item.product.id !== targetProductId) {
      return item;
    }

    return { ...item, quantity: item.quantity + 1 };
  });
  saveCartToLocalStorage();

  notify({ productId: targetProductId, eventType: CART_EVENTS.ITEM_INCREASED });
}

function decreaseQuantity(targetProductId: number) {
  state.cartItems = state.cartItems.map((item) => {
    if (item.product.id !== targetProductId) {
      return item;
    }

    return { ...item, quantity: item.quantity - 1 };
  });
  saveCartToLocalStorage();

  notify({ productId: targetProductId, eventType: CART_EVENTS.ITEM_DECREASED });
}

export { addToCart, removeFromCart, increaseQuantity, decreaseQuantity };
