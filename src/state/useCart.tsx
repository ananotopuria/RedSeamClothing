import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AddPayload, LocalCartItem } from "../types/cart";
import { cartItemKey, computeTotals, mapDtoToLocal } from "./cart-helpers";
import {
  addCartProduct,
  getCart,
  removeCartProduct,
  updateCartProduct,
} from "../services/cartApi";

type CartState = {
  items: LocalCartItem[];
  loading: boolean;
  error: string | null;
};

type CartCtx = {
  state: CartState;
  add: (p: AddPayload) => Promise<void>;
  inc: (key: string) => Promise<void>;
  dec: (key: string) => Promise<void>;
  setQty: (key: string, qty: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
  refresh: () => Promise<void>;
  totalQty: number;
  totalPrice: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    loading: true,
    error: null,
  });

  const presentRef = useRef<Record<string, Partial<LocalCartItem>>>({});

  const refresh = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const dto = await getCart();
      console.log("🚀 ~ CartProvider ~ dto:", dto);
      const items = mapDtoToLocal(dto, presentRef.current);
      console.log("🚀 ~ CartProvider ~ items:", items);
      for (const it of items) presentRef.current[cartItemKey(it)] = it;
      setState({ items, loading: false, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load cart";
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const findByKey = useCallback(
    (key: string) => {
      return state.items.find((x) => cartItemKey(x) === key);
    },
    [state.items]
  );

  const add = useCallback(
    async (p: AddPayload) => {
      try {
        console.log("add cart", p);
        const key = cartItemKey({
          productId: p.productId,
          colorName: p.colorName || "",
          size: p.size,
        });
        presentRef.current[key] = {
          name: p.name,
          image: p.image,
          colorName: p.colorName,
          price: p.price,
        };
        await addCartProduct(p.productId, {
          color: p.colorName || "",
          size: p.size,
          quantity: p.qty,
        });
        await refresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to add to cart";
        setState((s) => ({ ...s, loading: false, error: msg }));
      }
    },
    [refresh]
  );

  const setQty = useCallback(
    async (key: string, qty: number) => {
      console.log("🚀 ~ CartProvider ~ key:", key);
      try {
        if (qty < 0) qty = 0;
        const current = findByKey(key);
        if (!current) return;

        if (qty === 0) {
          await removeCartProduct(current.productId, {
            colorName: current.colorName || "",
            size: current.size,
          });
        } else {
          await updateCartProduct(current.productId, {
            colorName: current.colorName || "",
            size: current.size,
            quantity: qty,
          });
        }
        await refresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to update cart";
        setState((s) => ({ ...s, loading: false, error: msg }));
      }
    },
    [findByKey, refresh]
  );

  const inc = useCallback(
    async (key: string) => {
      const it = findByKey(key);
      if (!it) return;
      await setQty(key, it.qty + 1);
    },
    [findByKey, setQty]
  );

  const dec = useCallback(
    async (key: string) => {
      const it = findByKey(key);
      if (!it) return;
      await setQty(key, Math.max(0, it.qty - 1));
    },
    [findByKey, setQty]
  );

  const remove = useCallback(
    async (key: string) => {
      await setQty(key, 0);
    },
    [setQty]
  );

  const { totalQty, totalPrice } = useMemo(
    () => computeTotals(state.items),
    [state.items]
  );

  const value = useMemo<CartCtx>(
    () => ({
      state,
      add,
      inc,
      dec,
      setQty,
      remove,
      refresh,
      totalQty,
      totalPrice,
    }),
    [state, add, inc, dec, setQty, remove, refresh, totalQty, totalPrice]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
