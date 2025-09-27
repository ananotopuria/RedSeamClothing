import { cartItemKey } from "../../state/cart-helpers";
import { useCart } from "../../state/useCart";

function money(n: number) {
  return `$${n.toFixed(0)}`;
}

export default function OrderPageComponents() {
  const { state, totalPrice } = useCart();
  const delivery = 5;
  const itemsSubtotal = totalPrice;
  const total = itemsSubtotal + delivery;

  return (
    <main className="px-[10rem] mt-[4rem]">
      <h1 className="text-[4.2rem] font-semibold leading-none tracking-normal">
        Checkout
      </h1>
      <section className="mt-[7rem] flex gap-[13rem] ">
        <div className="rounded-[2rem] bg-zinc-50 ring-1 ring-zinc-100 w-[112rem] h-[63rem] px-[4.7rem] pt-[7.2rem]">
          <h2 className="text-[2.2rem] font-medium text-[#3E424A]">
            Order details
          </h2>
          <form
            className="mt-[4.6rem] w-[57.8rem] h-[4.2rem]"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex justify-between">
              <div>
                <label
                  htmlFor="name"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="name"
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Name"
                />
              </div>
              <div>
                <label
                  htmlFor="surname"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="surname"
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Surname"
                />
              </div>
            </div>

            <div className="mt-[3.3rem]">
              <label
                htmlFor="email"
                className="mb-[0.6rem] block text-[1.3rem] text-zinc-600"
              ></label>
              <input
                id="email"
                type="email"
                className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                placeholder="Email"
              />
            </div>
            <div className="flex justify-between">
              <div className="mt-[3.3rem]">
                <label
                  htmlFor="address"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="address"
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Address"
                />
              </div>
              <div className="mt-[3.3rem]">
                <label
                  htmlFor="zip"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="zip"
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Zip code"
                />
              </div>
            </div>
          </form>
        </div>
        <aside className="flex flex-col w-[46rem] h-[63rem] justify-between">
          <ul className="space-y-[2.4rem]">
            {state.items.map((it) => (
              <li key={cartItemKey(it)} className="flex gap-[1.6rem]">
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-[13rem] w-[10rem] object-cover bg-zinc-100 border rounded-lg "
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between font-medium text-[1.4rem] text-[#10151F]">
                    <h3 className="truncate text-[1.4rem] font-medium">
                      {it.name}
                    </h3>
                    <span className="text-[1.4rem] font-medium">
                      {money(it.price)}
                    </span>
                  </div>
                  <p className="mt-[0.4rem] text-[1.2rem] text-zinc-500">
                    {it.colorName ?? "-"}
                    {it.size ? ` · ${it.size}` : ""} · x{it.qty}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-[1.2rem]">
            <div className="flex items-center justify-between text-[1.4rem] text-zinc-600">
              <span>Items subtotal</span>
              <span className="text-zinc-900">{money(itemsSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[1.4rem] text-zinc-600">
              <span>Delivery</span>
              <span className="text-zinc-900">{money(delivery)}</span>
            </div>
            <div className="flex items-center justify-between text-[2rem] font-medium">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
          <div className="sticky bottom-0">
            <button
              type="button"
              className="w-full rounded-[10px] bg-[#FF4000] px-[2rem] py-[1.6rem] text-white text-[1.6rem] font-medium transition hover:brightness-95 active:translate-y-[1px]"
              onClick={() => {
                alert("Pay flow goes here");
              }}
            >
              Pay
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
