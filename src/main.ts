import { createProductItem } from "./view.js";
import { products } from "./products.js";

window.addEventListener("load", () => {
  products.forEach((product) => {
    createProductItem(product);
  });
});
