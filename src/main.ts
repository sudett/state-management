import { createProductItem } from "./view.js";
import { products } from "./products.js";
import { renderNav } from "./navbar.js";
import { renderSidebar } from "./sidebar.js";

window.addEventListener("load", () => {
  renderNav();
  renderSidebar();

  products.forEach((product) => {
    createProductItem(product);
  });
});
