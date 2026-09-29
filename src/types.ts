const CART_EVENTS = {
  ITEM_ADDED: "ITEM_ADDED",
  ITEM_REMOVED: "ITEM_REMOVED",
  ITEM_INCREASED: "ITEM_INCREASED",
  ITEM_DECREASED: "ITEM_DECREASED",
} as const;

type CartEventType = (typeof CART_EVENTS)[keyof typeof CART_EVENTS];

type CartEvent = {
  productId: number;
  eventType: CartEventType;
};

type ProductItem = {
  id: number;
  name: string;
  price: number;
  img: string;
};

type CartItem = {
  product: ProductItem;
  quantity: number;
};

type SubscriberCallback = (obj: CartEvent) => void;

export {
  ProductItem,
  CartItem,
  CartEvent,
  CartEventType,
  SubscriberCallback,
  CART_EVENTS,
};
