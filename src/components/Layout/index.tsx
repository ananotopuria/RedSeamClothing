import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import CartSidePanel from "../CartComponents";

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />
      <Outlet />
      <CartSidePanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
