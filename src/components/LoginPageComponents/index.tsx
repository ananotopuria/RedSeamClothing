import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import { LuEye, LuEyeOff } from "react-icons/lu";
import ImgE from "/Rectangle10.png";

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

function LoginPageComponents() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function validate(): FormErrors {
    const e: FormErrors = {};

    if (!email.trim()) {
      e.email = "Email is required.";
    } else if (email.trim().length < 3) {
      e.email = "Email must be at least 3 characters.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      e.email = "Please enter a valid email address.";
    }

    if (!password) {
      e.password = "Password is required.";
    } else if (password.length < 3) {
      e.password = "Password must be at least 3 characters.";
    }

    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setErrors({ general: (err as Error).message || "Login failed." });
    }
  }

  const hasEmailError = Boolean(errors.email);
  const hasPasswordError = Boolean(errors.password);

  return (
    <main className="flex gap-[18rem]">
      <img
        src={ImgE}
        className="w-[50%] h-[100rem] object-cover"
        alt="Shopping illustration"
      />

      <div className="mt-[24rem] w-[55rem]">
        <h1 className="text-[4rem] font-[500]">Log in</h1>

        {errors.general && (
          <p className="mt-2 text-red-600">{errors.general}</p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-3" noValidate>
          <div>
            <input
              className={`w-full border rounded-[1rem] px-6 py-2 h-[4.2rem] text-[1.4rem] mt-[5rem] ${
                hasEmailError ? "border-red-500" : ""
              }`}
              placeholder="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              minLength={3}
              required
              autoComplete="email"
              spellCheck={false}
              aria-invalid={hasEmailError}
            />
            {hasEmailError && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              className={`w-full border rounded-[1rem] pr-12 pl-6 py-2 h-[4.2rem] text-[1.4rem] mt-[2rem] mb-[5rem] ${
                hasPasswordError ? "border-red-500" : ""
              }`}
              placeholder="Password *"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={3}
              required
              autoComplete="current-password"
              spellCheck={false}
              aria-invalid={hasPasswordError}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-3 bottom-10 my-auto h-9 w-9 grid place-items-center rounded-md hover:bg-gray-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              tabIndex={0}
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
            {hasPasswordError && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            className="w-full border rounded-[1rem] px-3 py-2 bg-[#FF4000] text-white h-[4rem] text-[1.4rem]"
            type="submit"
          >
            Log in
          </button>
        </form>

        <p className="text-center mt-[2.4rem] text-[#3E424A] text-[1.4rem]">
          Not a member?{" "}
          <Link to="/registration" className="text-[#ff4000] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPageComponents;
