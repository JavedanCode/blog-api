import { request } from "./client.js";

export async function register({ username, email, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: {
      username,
      email,
      password,
    },
  });
}

export async function login({ identifier, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: {
      identifier,
      password,
    },
  });
}

export async function getCurrentUser(token) {
  return request("/api/auth/me", {
    token,
  });
}
