import { createProductItem } from "./view.js";

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

window.addEventListener("load", () => {
  products.forEach((product) => {
    createProductItem(product);
  });
});
