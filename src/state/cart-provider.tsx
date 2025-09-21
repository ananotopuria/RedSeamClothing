import { useEffect, useMemo, useReducer } from "react";
import { CartCtx, type CartItem, type CartState } from "./cart-context";

type Action =
  | { type: "ADD"; payload: CartItem }
  | { type: "INC"; payload: { key: string } }
  | { type: "DEC"; payload: { key: string } }
  | { type: "REMOVE"; payload: { key: string } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };

const CART_KEY = "cart_items_v1";

function keyOf(i: CartItem) {
  return `${i.productId}::${i.colorId}::${i.size}`;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD": {
      const k = keyOf(action.payload);
      const idx = state.items.findIndex((x) => keyOf(x) === k);
      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = { ...next[idx], qty: next[idx].qty + action.payload.qty };
        return { items: next };
      }
      return { items: [...state.items, action.payload] };
    }
    case "INC":
      return {
        items: state.items.map((x) =>
          keyOf(x) === action.payload.key ? { ...x, qty: x.qty + 1 } : x
        ),
      };
    case "DEC":
      return {
        items: state.items
          .map((x) =>
            keyOf(x) === action.payload.key
              ? { ...x, qty: Math.max(1, x.qty - 1) }
              : x
          )
          .filter((x) => x.qty > 0),
      };
    case "REMOVE":
      return {
        items: state.items.filter((x) => keyOf(x) !== action.payload.key),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch (e) {
      console.error("Cart hydrate error", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Cart persist error", e);
    }
  }, [state]);

  const totalQty = useMemo(
    () => state.items.reduce((s, i) => s + i.qty, 0),
    [state.items]
  );
  const totalPrice = useMemo(
    () => state.items.reduce((s, i) => s + i.qty * i.price, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      state,
      add: (item: CartItem) => dispatch({ type: "ADD", payload: item }),
      inc: (key: string) => dispatch({ type: "INC", payload: { key } }),
      dec: (key: string) => dispatch({ type: "DEC", payload: { key } }),
      remove: (key: string) => dispatch({ type: "REMOVE", payload: { key } }),
      clear: () => dispatch({ type: "CLEAR" }),
      totalQty,
      totalPrice,
    }),
    [state, totalQty, totalPrice]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
