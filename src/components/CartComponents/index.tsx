import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../state/useCart";
import { cartItemKey } from "../../state/cart-helpers";
import cartImg from "./../../assets/images/MakingCreditPurchaseOnlineSecurely.png";

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
        className="fixed inset-y-0 right-0 z-[999] w-[54rem] bg-white shadow-xl transition-transform duration-300 translate-x-0 p-[4rem]"
      >
        <header className="flex items-center justify-between font-medium leading-none tracking-normal text-[2rem]">
          <h2 id={headingId}>Shopping cart ({totalQty})</h2>
          <button onClick={onClose} aria-label="Close" className="p-2">
            ✕
          </button>
        </header>

        <div className="mt-[6rem]">
          {state.loading ? (
            <div className="space-y-3">
              <div className="h-6 w-40 bg-zinc-200 animate-pulse rounded" />
              <div className="h-24 bg-zinc-100 animate-pulse rounded" />
              <div className="h-24 bg-zinc-100 animate-pulse rounded" />
            </div>
          ) : !hasItems ? (
            <div className="text-center py-16 flex flex-col justify-center items-center leading-none tracking-normal">
              <img
                className="w-[17rem] h-[13.5rem]"
                src={cartImg}
                alt="cart img icon"
              />
              <p className="text-[2.4rem] font-semibold mt-[2.4rem] ">Ooops!</p>
              <p className="text-[1.4rem] font-normal text-[#3E424A]  mt-[1rem]">
                Uh-oh, you’ve got nothing in your cart just yet!
              </p>
              <button
                className="mt-[5.8rem] rounded-[10px] bg-[#FF4000] text-white px-[20px] py-[10px] "
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
                data-autofocus
              >
                Start shopping
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
                    <li key={key} className="flex gap-[2rem] mb-[3.6rem]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-[13rem] w-[10rem] object-cover bg-zinc-100 border rounded-lg "
                      />
                      <div className="flex-1 min-w-0 font-medium text-[1.4rem] text-[#10151F]">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="mt-1">${item.price}</p>
                        </div>
                        <p className="text-[1.2rem] mt-[0.8rem] text-[#3E424A]">
                          {item.colorName ?? "-"}
                        </p>
                        <p className="text-[1.2rem] mt-[0.8rem] text-[#3E424A]">
                          {item.size}
                        </p>
                        <div className="mt-[2rem] flex items-center gap-2 ">
                          <div className="rounded-[10rem] border w-[7rem] h-[2rem] flex items-cetner justify-center gap-[1px] text-[12px]">
                            <button
                              onClick={() => dec(key)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">{item.qty}</span>
                            <button
                              onClick={() => inc(key)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="ml-auto text-[1.2rem] font-normal text-#3E424A"
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
              <div className="flex flex-col items-center p-[3rem] fixed bottom-0 left-0">
                <div className="flex justify-between w-[100%] text-[1.6rem] text-[#3E424A] mt-[1.6rem]">
                  <span>Items subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between w-[100%] text-[1.6rem] text-[#3E424A] mt-[1.6rem]">
                  <span>Delivery</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between font-medium text-[2rem] mt-[1.6rem] w-[100%] text-[#10151F]">
                  <span>Total</span>
                  <span>${totalPrice + 5}</span>
                </div>
                <div>
                  <button
                    className="mt-[10rem] w-[46rem] h-[6rem] rounded-[10px] bg-[#FF4000] text-white px-4 py-3 text-[1.8rem] font-medium"
                    onClick={() => {
                      onClose();
                      navigate("/order");
                    }}
                    data-autofocus
                  >
                    Go to checkout
                  </button>
                </div>
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
