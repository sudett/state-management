import { products } from "./products.js";

const image = document.querySelector<HTMLImageElement>(
  ".product-details-image",
);
const header = document.querySelector<HTMLHeadingElement>(".product-heading");
const price = document.querySelector<HTMLSpanElement>(".product-price");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const targetProduct = products.find(
  (product) => product.id === Number(productId),
);

if (targetProduct) {
  if (image) image.src = targetProduct.img;
  if (header) header.textContent = targetProduct.name;
  if (price) price.textContent = `${targetProduct.price}$`;
}
