import { useEffect, useState } from "react";
import { getToken } from "../services/auth";

export function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getToken());

  useEffect(() => {
    const update = () => setIsLoggedIn(!!getToken());
    update();

    window.addEventListener("storage", update);
    window.addEventListener("auth:changed", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("auth:changed", update);
    };
  }, []);

  return isLoggedIn;
}
