import { state, notify } from "./store.js";

function addToCart(product) {
  state.cartItems.push({ product, quantity: 1 });

  notify({ productId: product.id, eventType: "ITEM_ADDED" });
}

function removeFromCart(targetProductId) {
  const targetIndex = state.cartItems.findIndex(
    (item) => item.product.id === targetProductId,
  );

  state.cartItems.splice(targetIndex, 1);

  notify({ productId: targetProductId, eventType: "ITEM_REMOVED" });
}

function increaseQuantity(targetProductId) {
  state.cartItems = state.cartItems.map((item) => {
    if (item.product.id !== targetProductId) {
      return item;
    }

    return { ...item, quantity: item.quantity + 1 };
  });

  notify({ productId: targetProductId, eventType: "ITEM_INCREASED" });
}

function decreaseQuantity(targetProductId) {
  state.cartItems = state.cartItems.map((item) => {
    if (item.product.id !== targetProductId) {
      return item;
    }

    return { ...item, quantity: item.quantity - 1 };
  });

  notify({ productId: targetProductId, eventType: "ITEM_DECREASED" });
}

export { addToCart, removeFromCart, increaseQuantity, decreaseQuantity };
