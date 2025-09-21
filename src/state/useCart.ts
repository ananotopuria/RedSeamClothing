import { useContext } from "react";
import { CartCtx } from "./cart-context";

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
