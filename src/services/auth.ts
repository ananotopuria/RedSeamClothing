export async function login(email: string, password: string) {
  const res = await fetch(
    "https://api.redseam.redberryinternship.ge/api/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!res.ok) throw new Error("Login failed");
  const data: { token: string } = await res.json();
  localStorage.setItem("token", data.token);
  return data.token;
}
