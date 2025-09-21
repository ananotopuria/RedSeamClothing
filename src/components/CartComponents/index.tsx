import { useNavigate } from "react-router-dom";
import { useCart } from "../../state/useCart";
import { cartItemKey } from "../../state/cart-helpers";

function CartSidePanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, inc, dec, remove, totalQty, totalPrice } = useCart();
  const navigate = useNavigate();

  const hasItems = state.items.length > 0;

  return (
    <aside
      aria-hidden={!open}
      className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={onClose} aria-label="Close" className="p-2">
          ✕
        </button>
      </header>

      <div className="p-4">
        {!hasItems ? (
          <div className="text-center py-16">
            <p className="text-xl font-medium">
              Uh-oh, you’ve got nothing in your cart just yet!
            </p>
            <p className="text-gray-600 mt-2">add items</p>
            <button
              className="mt-6 rounded-md bg-black text-white px-4 py-2"
              onClick={() => {
                onClose();
                navigate("/");
              }}
            >
              shop
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-4 max-h-[60vh] overflow-auto pr-1">
              {state.items.map((item) => {
                const k = cartItemKey(item);
                return (
                  <li key={k} className="flex gap-3 border rounded-lg p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        ფერი: {item.colorName} • ზომა: {item.size}
                      </p>
                      <p className="mt-1">${item.price}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          className="rounded border px-2 py-1"
                          onClick={() => dec(k)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <button
                          className="rounded border px-2 py-1"
                          onClick={() => inc(k)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>

                        <button
                          className="ml-auto text-sm text-red-600"
                          onClick={() => remove(k)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Summary */}
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
              >
                შეკვეთის გაფორმება
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default CartSidePanel;
