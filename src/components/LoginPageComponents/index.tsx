import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";

function LoginPageComponents() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErr(null);
      await login(email, password);
      navigate("/");
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  return (
    <main className="mx-auto w-[95%] max-w-[420px] py-12">
      <h1 className="text-2xl font-semibold">Log in</h1>
      {err && <p className="mt-2 text-red-600">{err}</p>}
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full border rounded-lg px-3 py-2 bg-black text-white">
          Continue
        </button>
      </form>
    </main>
  );
}
export default LoginPageComponents;
