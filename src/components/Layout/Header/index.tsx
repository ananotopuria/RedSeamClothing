import LogoImg from "./../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaUser, FaCartShopping } from "react-icons/fa6";
import { useIsLoggedIn } from "../../../hooks/useIsLoggedIn";
import { useCart } from "../../../state/useCart";
import { getAuthUser } from "../../../services/auth";
import { useEffect, useState } from "react";
import defaultAvatar from "./../../../assets/images/Ellipse1.png";

type HeaderProps = { onOpenCart: () => void };

type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
};

export default function Header({ onOpenCart }: HeaderProps) {
  const isLoggedIn = useIsLoggedIn();
  const { totalQty } = useCart();

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setUser(getAuthUser<AuthUser>());
    }
    const handler = () => setUser(getAuthUser<AuthUser>());
    window.addEventListener("auth:changed", handler);
    return () => window.removeEventListener("auth:changed", handler);
  }, [isLoggedIn]);

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `https://api.redseam.redberryinternship.ge/${user.avatar.replace(
          /^\/+/,
          ""
        )}`
    : defaultAvatar;

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
          <div className="flex items-center gap-3">
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
            <img
              src={avatarSrc}
              alt={user ? `${user.username} avatar` : "User avatar"}
              className="h-[4rem] w-[4rem] rounded-full object-cover ring-1 ring-zinc-200"
            />
          </div>
        )}
      </div>
    </header>
  );
}
