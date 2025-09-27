import LogoImg from "./../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaUser, FaCartShopping } from "react-icons/fa6";
import { useIsLoggedIn } from "../../../hooks/useIsLoggedIn";
import { useCart } from "../../../state/useCart";

type HeaderProps = { onOpenCart: () => void };

export default function Header({ onOpenCart }: HeaderProps) {
  const isLoggedIn = useIsLoggedIn();
  const { totalQty } = useCart();

  return (
    <header className="flex justify-between px-[10rem] py-[2.8rem]">
      <Link to="/">
        <img className="w-[18rem]" src={LogoImg} alt="logo" />
      </Link>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <Link
            to="/login"
            className="flex items-center gap-2 font-400 text-[1.2rem]"
          >
            <FaUser />
            Log in
          </Link>
        ) : (
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 font-400 text-[2rem] px-3 py-2"
            aria-label="Open cart"
          >
            <FaCartShopping />

            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-black text-white text-xs px-2 py-0.5">
                {totalQty}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
