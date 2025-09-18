import LogoImg from "./../../../assets/images/logo.png";
import { FaUser } from "react-icons/fa6";

function Header() {
  return (
    <header className="flex justify-between px-[10rem] py-[2.8rem]">
      <img className="w-[18rem]" src={LogoImg} alt="logo" />
      <button className="flex justify-center items-center gap-4 font-400 text-[1.2rem]">
        <FaUser />
        Log in
      </button>
    </header>
  );
}

export default Header;
