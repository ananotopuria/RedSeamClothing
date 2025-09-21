import type { FormEvent, ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth";
import ImgE from "/Rectangle10.png";
import { FiUser } from "react-icons/fi";
import { LuEye, LuEyeOff } from "react-icons/lu";

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  avatar?: string;
  general?: string;
};

function RegistrationPageComponents() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!avatar) {
      setAvatarUrl(null);
      return;
    }
    const url = URL.createObjectURL(avatar);
    setAvatarUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  function validate(): FormErrors {
    const e: FormErrors = {};

    if (!username.trim()) e.username = "Username is required.";
    else if (username.trim().length < 3) e.username = "Minimum 3 characters.";

    if (!email.trim()) e.email = "Email is required.";
    else if (email.trim().length < 3) e.email = "Minimum 3 characters.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      e.email = "Enter a valid email address.";
    }

    if (!password) e.password = "Password is required.";
    else if (password.length < 3) e.password = "Minimum 3 characters.";

    if (!passwordConfirmation) {
      e.passwordConfirmation = "Please confirm your password.";
    } else if (passwordConfirmation !== password) {
      e.passwordConfirmation = "Passwords do not match.";
    }

    if (avatar && !avatar.type.startsWith("image/")) {
      e.avatar = "Avatar must be an image file (jpg, png, webp, etc.).";
    }

    return e;
  }

  function onAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    setAvatar(e.target.files?.[0] ?? null);
  }
  function triggerFileDialog() {
    fileInputRef.current?.click();
  }
  function removeAvatar() {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setLoading(true);
    try {
      await register({
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
        avatar,
      });
      navigate("/login");
    } catch (err: unknown) {
      let general = "Registration failed.";
      const next: FormErrors = {};

      if (typeof err === "object" && err !== null) {
        const anyErr = err as {
          message?: string;
          errors?: Record<string, string[] | string>;
        };
        if (anyErr.message) general = anyErr.message;

        if (anyErr.errors) {
          for (const [key, val] of Object.entries(anyErr.errors)) {
            const msg = Array.isArray(val) ? val.join(", ") : String(val);
            if (key === "username") next.username = msg;
            else if (key === "email") next.email = msg;
            else if (key === "password") next.password = msg;
            else if (key === "password_confirmation")
              next.passwordConfirmation = msg;
            else next.general = msg;
          }
        }
      }

      if (!next.general) next.general = general;
      setErrors(next);
    } finally {
      setLoading(false);
    }
  }

  const hasEmailError = Boolean(errors.email);
  const hasPasswordError = Boolean(errors.password);
  const hasConfirmError = Boolean(errors.passwordConfirmation);

  return (
    <main className="flex gap-[18rem]">
      <img
        src={ImgE}
        className="w-[50%] h-[100rem] object-cover"
        alt="Shopping illustration"
      />

      <div className="mt-[15rem] w-[55rem]">
        <h1 className="text-[4rem] font-[500]">Registration</h1>

        {errors.general && (
          <p className="mb-4 text-red-600">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="flex items-center gap-6 mt-[4rem]">
            <div className="h-[10rem] w-[10rem] rounded-full overflow-hidden bg-gray-100 border">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <FiUser className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-[1.4rem] text-[#3E424A]">
              <button
                type="button"
                onClick={triggerFileDialog}
                className="hover:text-gray-900"
              >
                Upload new
              </button>
              <button
                type="button"
                onClick={removeAvatar}
                className="hover:text-red-600 disabled:opacity-40"
                disabled={!avatar}
              >
                Remove
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
              onChange={onAvatarChange}
              className="sr-only"
            />
          </div>
          {errors.avatar && (
            <p className="text-red-600 text-sm mt-[-0.75rem]">
              {errors.avatar}
            </p>
          )}

          <div>
            <input
              type="text"
              placeholder="Username *"
              className="w-full rounded-[1rem] border p-6 h-[4.2rem] text-[1.4rem] mt-[4rem] placeholder-gray-400 placeholder:text-[1.4rem]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email *"
              className={`w-full rounded-[1rem] border p-6 h-[4.2rem] text-[1.4rem] mt-[1.6rem] ${
                hasEmailError ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              minLength={3}
              autoComplete="email"
              aria-invalid={hasEmailError}
            />
            {hasEmailError && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              className={`w-full rounded-[1rem] border p-6 pr-12 h-[4.2rem] text-[1.4rem] mt-[1.6rem] ${
                hasPasswordError ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={3}
              autoComplete="new-password"
              aria-invalid={hasPasswordError}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-3 my-auto h-9 w-9 grid place-items-center rounded-md hover:bg-gray-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
            {hasPasswordError && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password *"
              className={`w-full rounded-[1rem] border p-6 pr-12 h-[4.2rem] text-[1.4rem] mt-[2rem] mb-[2rem] ${
                hasConfirmError ? "border-red-500" : ""
              }`}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              autoComplete="new-password"
              aria-invalid={hasConfirmError}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute inset-y-0 right-3 my-auto h-9 w-9 grid place-items-center rounded-md hover:bg-gray-100"
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
              aria-pressed={showConfirm}
            >
              {showConfirm ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
            {hasConfirmError && (
              <p className="text-red-600 text-sm mt-1">
                {errors.passwordConfirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[1rem] px-4 py-2 disabled:opacity-60 bg-[#FF4000] text-white h-[4rem] text-[1.4rem]"
          >
            {loading ? "Registering…" : "Register"}
          </button>

          <p className="text-center text-[#3E424A] text-[1.4rem]">
            Already member?{" "}
            <Link to="/login" className="text-[#ff4000] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default RegistrationPageComponents;
