import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../state/useCart";
import { cartItemKey } from "../../state/cart-helpers";

type Props = {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
};

export default function CartSidePanel({ open, onClose, triggerRef }: Props) {
  return open ? (
    <CartPanelContent onClose={onClose} triggerRef={triggerRef} />
  ) : null;
}

function CartPanelContent({
  onClose,
  triggerRef,
}: {
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}) {
  const { state, inc, dec, remove, totalQty, totalPrice } = useCart();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLElement | null>(null);
  const headingId = "cart-panel-title";
  const hasItems = state.items.length > 0;

  useEffect(() => {
    (async () => {
      // const dto = await getCart();
      // refresh();
      // console.log("🚀 ~ CartPanelContent ~ dto:", dto);
    })();
    const el = panelRef.current;
    const restoreFocusTo: HTMLElement | null = triggerRef?.current ?? null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const target: HTMLElement | null =
      (el &&
        (el.querySelector<HTMLElement>("[data-autofocus]") ||
          el.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ))) ||
      null;

    const id = window.setTimeout(() => {
      (target || el || document.body).focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;

      if (restoreFocusTo && document.contains(restoreFocusTo)) {
        restoreFocusTo.focus();
      }
    };
  }, [onClose, triggerRef]);

  return (
    <>
      <button
        aria-label="Close cart"
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[998]"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-[999] w-full max-w-md bg-white shadow-xl transition-transform duration-300 translate-x-0"
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h2 id={headingId} className="text-lg font-semibold">
            Your Cart
          </h2>
          <button onClick={onClose} aria-label="Close" className="p-2">
            ✕
          </button>
        </header>

        <div className="p-4">
          {state.loading ? (
            <div className="space-y-3">
              <div className="h-6 w-40 bg-zinc-200 animate-pulse rounded" />
              <div className="h-24 bg-zinc-100 animate-pulse rounded" />
              <div className="h-24 bg-zinc-100 animate-pulse rounded" />
            </div>
          ) : !hasItems ? (
            <div className="text-center py-16">
              <p className="text-xl font-medium">
                Uh-oh, you’ve got nothing in your cart just yet!
              </p>
              <p className="text-gray-600 mt-2">
                Start shopping to fill it up.
              </p>
              <button
                className="mt-6 rounded-md bg-black text-white px-4 py-2"
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
                data-autofocus
              >
                Shop
              </button>
              {state.error && (
                <p className="text-sm text-red-600 mt-4">{state.error}</p>
              )}
            </div>
          ) : (
            <>
              <ul className="space-y-4 max-h-[60vh] overflow-auto pr-1">
                {state.items.map((item) => {
                  const key = cartItemKey(item);
                  return (
                    <li key={key} className="flex gap-3 border rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-md bg-zinc-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ფერი: {item.colorName ?? "-"} • ზომა: {item.size}
                        </p>
                        <p className="mt-1">${item.price}</p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            className="rounded border px-2 py-1"
                            onClick={() => dec(key)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <button
                            className="rounded border px-2 py-1"
                            onClick={() => inc(key)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                          <button
                            className="ml-auto text-sm text-red-600"
                            onClick={() => remove(key)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between">
                  <span>სულ რაოდენობა</span>
                  <span>{totalQty}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>ჯამური ფასი</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  className="mt-4 w-full rounded-md bg-black text-white px-4 py-3"
                  onClick={() => {
                    onClose();
                    navigate("/order");
                  }}
                  data-autofocus
                >
                  შეკვეთის გაფორმება
                </button>

                {state.error && (
                  <p className="text-sm text-red-600 mt-3">{state.error}</p>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
