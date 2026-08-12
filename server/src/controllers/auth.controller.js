import { createLocalUser } from "../services/auth.service.js";

import { createAccessToken } from "../utils/jwt.js";

import { consumeOAuthCode } from "../services/oauth.service.js";

import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import { createOAuthCode } from "../services/oauth.service.js";

import { sanitizeUser } from "../utils/user.js";

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

export async function oauthCallback(req, res, next) {
  try {
    const code = await createOAuthCode(req.user.id);

    const clientUrl = env.clientUrl;

    if (!clientUrl) {
      throw new AppError(
        "OAuth client URL is not configured.",
        500,
        "OAUTH_CLIENT_URL_MISSING",
      );
    }

    const redirectUrl = new URL("/oauth/callback", clientUrl);

    redirectUrl.searchParams.set("code", code);

    return res.redirect(302, redirectUrl.toString());
  } catch (error) {
    next(error);
  }
}

export async function exchangeOAuthCode(req, res, next) {
  try {
    const { code } = req.body;

    const user = await consumeOAuthCode(code);

    const accessToken = createAccessToken(user);

    return res.status(200).json({
      message: "OAuth authentication successful.",
      user: sanitizeUser(user),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}
