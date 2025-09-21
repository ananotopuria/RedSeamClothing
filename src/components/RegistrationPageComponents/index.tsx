import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/auth";

function RegistrationPageComponents() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        email,
        username,
        password,
        password_confirmation: passwordConfirmation,
        avatar,
      });
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    setAvatar(e.target.files?.[0] ?? null);
  }

  return (
    <main className="mx-auto max-w-md py-10">
      <h1 className="mb-6 text-2xl font-semibold">Registration</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-md border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-md border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-md border p-2"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          autoComplete="new-password"
        />

        <input type="file" accept="image/*" onChange={handleAvatarChange} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Registering…" : "Register"}
        </button>
      </form>
    </main>
  );
}

export default RegistrationPageComponents;
