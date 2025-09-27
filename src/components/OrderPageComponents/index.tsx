import { useEffect, useState } from "react";
import { cartItemKey } from "../../state/cart-helpers";
import { useCart } from "../../state/useCart";
import { useNavigate } from "react-router-dom";

function money(n: number) {
  return `$${n.toFixed(0)}`;
}

type AuthUser = { email?: string } | null;

export default function OrderPageComponents() {
  const navigate = useNavigate();
  const { state, totalPrice, remove } = useCart();
  const delivery = 5;
  const itemsSubtotal = totalPrice;
  const total = itemsSubtotal + delivery;
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) {
        const u: AuthUser = JSON.parse(raw);
        if (u?.email) setEmail(u.email);
      }
    } catch {
      /* empty */
    }
  }, []);

  async function handleCheckout() {
    setError(null);
    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        "https://api.redseam.redberryinternship.ge/api/cart/checkout",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            surname,
            email,
            zip_code: zip,
            address,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Checkout failed");
      }

      state.items.forEach((it) => remove(cartItemKey(it)));

      setSuccessOpen(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

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
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckout();
            }}
          >
            <div className="flex justify-between">
              <div>
                <label
                  htmlFor="name"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="surname"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Surname"
                  required
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                placeholder="Email"
                required
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Address"
                  required
                />
              </div>
              <div className="mt-[3.3rem]">
                <label
                  htmlFor="zip"
                  className="mb-[0.6rem] block text-[1.3rem] text-zinc-600 w-[27.7rem]"
                ></label>
                <input
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full rounded-[10px] border border-zinc-200 bg-white px-[1.2rem] py-[0.9rem] text-[1.4rem] outline-none focus:border-zinc-300"
                  placeholder="Zip code"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-[1.3rem] text-red-600">{error}</p>
            )}
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
                    {it.size ? ` · ${it.size}` : ""} · x{it.qty}{" "}
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
              onClick={handleCheckout}
              disabled={submitting}
            >
              {submitting ? "Processing…" : "Pay"}
            </button>
          </div>
        </aside>
      </section>

      {successOpen && (
        <>
          <button
            aria-label="close"
            onClick={() => setSuccessOpen(false)}
            className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-[1px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[999] grid place-items-center"
          >
            <div className="relative w-full max-w-[560px] rounded-[20px] bg-white px-[40px] py-[48px] shadow-xl text-center">
              <button
                aria-label="Close"
                onClick={() => setSuccessOpen(false)}
                className="absolute right-[20px] top-[20px] text-[#1F2937] hover:opacity-80"
              >
                ×
              </button>
              <div className="mx-auto mb-[24px] grid h-[72px] w-[72px] place-items-center rounded-full bg-zinc-100">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="#16A34A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[3.6rem] leading-none font-semibold text-[#0B1221]">
                Congrats!
              </h3>
              <p className="mt-[12px] text-[1.6rem] text-[#6B7280]">
                Your order is placed successfully!
              </p>
              <button
                onClick={() => {
                  setSuccessOpen(false);
                  navigate("/");
                }}
                className="mt-[28px] inline-block rounded-[10px] bg-[#FF4000] px-[32px] py-[12px] text-white text-[1.6rem] font-medium"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
