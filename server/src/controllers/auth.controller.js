import { createLocalUser } from "../services/auth.service.js";

import { createAccessToken } from "../utils/jwt.js";

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const user = await createLocalUser({
      username,
      email,
      password,
    });

    const accessToken = createAccessToken(user);

    return res.status(201).json({
      message: "User registered successfully.",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export function login(req, res) {
  const accessToken = createAccessToken(req.user);

  return res.status(200).json({
    message: "Login successful.",
    user: req.user,
    accessToken,
  });
}

export function oauthCallback(req, res) {
  const accessToken = createAccessToken(req.user);

  return res.status(200).json({
    message: "OAuth authentication successful.",
    user: req.user,
    accessToken,
  });
}

export function me(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}
