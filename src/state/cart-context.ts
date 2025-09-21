import { createContext } from "react";

export type CartItem = {
  productId: number;
  name: string;
  image: string;
  brand?: string;
  colorId: number;
  colorName: string;
  size: string;
  price: number;
  qty: number;
};

export type CartState = { items: CartItem[] };

export const CartCtx = createContext<{
  state: CartState;
  add: (item: CartItem) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
} | null>(null);
