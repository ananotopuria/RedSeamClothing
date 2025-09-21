const API_URL = "https://api.redseam.redberryinternship.ge/api";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export type ApiError = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem("token");
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (localStorage.getItem("token")) localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth:changed"));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth:changed"));
}

export function getAuthUser<T = unknown>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeErrors(err?: ApiError) {
  if (!err) return "Request failed.";
  if (err.errors)
    return Object.values(err.errors).flat().map(String).join(", ");
  return err.message ?? "Request failed.";
}

export async function authFetch(input: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    let text = "";
    try {
      text = await res.text();
    } catch {
      // ignore
    }
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return res;
}

export async function login(email: string, password: string) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw new Error(`Network error: ${(e as Error).message}`);
  }

  if (res.status === 401) throw new Error("Unauthorized: invalid credentials.");
  if (res.status === 422)
    throw new Error(normalizeErrors((await res.json()) as ApiError));
  if (!res.ok)
    throw new Error(`Login failed (${res.status}): ${await res.text()}`);

  const data: { token: string; user?: unknown } = await res.json();
  setToken(data.token);
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.token;
}

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  avatar?: File | null;
};

export async function register(payload: RegisterPayload) {
  const form = new FormData();
  form.append("email", payload.email);
  form.append("username", payload.username);
  form.append("password", payload.password);
  form.append("password_confirmation", payload.password_confirmation);
  if (payload.avatar) form.append("avatar", payload.avatar);

  let res: Response;
  try {
    res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    });
  } catch (e) {
    throw new Error(`Network error: ${(e as Error).message}`);
  }

  if (res.status === 422)
    throw new Error(normalizeErrors((await res.json()) as ApiError));
  if (res.status === 401) {
    const data = (await res.json()) as ApiError;
    throw new Error(data.message ?? "Unauthorized.");
  }
  if (!res.ok)
    throw new Error(`Registration failed (${res.status}): ${await res.text()}`);
  return true;
}
