import { Router } from "express";
import passport from "../config/passport/index.js";

import { body, checkExact } from "express-validator";

import {
  register,
  login,
  oauthCallback,
  exchangeOAuthCode,
  me,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/authenticate.js";

import { authenticateOAuth } from "../middleware/authenticateOAuth.js";

import { handleValidationErrors } from "../middleware/validation.js";

import { authLimiter } from "../middleware/rateLimiter.js";

import { AppError } from "../errors/AppError.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new local user account and returns a JWT access token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/register",
  authLimiter,

  [
    body("username")
      .trim()
      .isLength({
        min: 3,
        max: 30,
      })
      .withMessage("Username must be between 3 and 30 characters.")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores.",
      ),

    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email address is required.")
      .normalizeEmail(),

    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({
        min: 8,
        max: 128,
      })
      .withMessage("Password must be between 8 and 128 characters."),

    checkExact(),
  ],

  handleValidationErrors,
  register,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with username or email
 *     description: Authenticates a local user and returns a JWT access token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/login",
  authLimiter,

  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Username or email is required."),

    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({
        min: 1,
        max: 128,
      })
      .withMessage("Password must be between 1 and 128 characters."),

    checkExact(),
  ],

  handleValidationErrors,

  (req, res, next) => {
    passport.authenticate(
      "local",
      {
        session: false,
      },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return next(
            new AppError(
              "Invalid username/email or password.",
              401,
              "INVALID_CREDENTIALS",
            ),
          );
        }

        req.user = user;

        return next();
      },
    )(req, res, next);
  },

  login,
);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google OAuth authentication
 *     description: >
 *       Starts the Google OAuth 2.0 authentication flow.
 *       This endpoint redirects the user's browser to Google.
 *       It should be opened as a normal browser navigation rather than
 *       called using an AJAX or fetch request.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects the browser to Google's OAuth authorization page.
 */
router.get(
  "/google",
  authLimiter,
  authenticateOAuth("google", {
    scope: ["profile", "email"],
  }),
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     description: Handles the callback from Google after successful authentication and returns a JWT access token.
 *     tags:
 *       - Authentication
 *
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: Authorization code returned by Google.
 *         schema:
 *           type: string
 *
 *       - name: state
 *         in: query
 *         required: false
 *         description: OAuth state value, when provided by the OAuth flow.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: OAuth authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 *       400:
 *         description: Google OAuth authentication failed or the account does not have a verified email address.
 *
 *       502:
 *         $ref: '#/components/responses/OAuthProviderError'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/google/callback",

  authenticateOAuth("google"),

  oauthCallback,
);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Start GitHub OAuth authentication
 *     description: >
 *       Starts the GitHub OAuth authentication flow.
 *       This endpoint redirects the user's browser to GitHub.
 *       It should be opened as a normal browser navigation rather than
 *       called using an AJAX or fetch request.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects the browser to GitHub's OAuth authorization page.
 */
router.get(
  "/github",
  authLimiter,

  authenticateOAuth("github", {
    scope: ["user:email"],
  }),
);

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: Handle GitHub OAuth callback
 *     description: Handles the callback from GitHub after successful authentication and returns a JWT access token.
 *     tags:
 *       - Authentication
 *
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: Authorization code returned by GitHub.
 *         schema:
 *           type: string
 *
 *       - name: state
 *         in: query
 *         required: false
 *         description: OAuth state value, when provided by the OAuth flow.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: OAuth authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 *       400:
 *         description: GitHub OAuth authentication failed or the account does not have a verified email address.
 *
 *       502:
 *         $ref: '#/components/responses/OAuthProviderError'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/github/callback",

  authenticateOAuth("github"),

  oauthCallback,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the current authenticated user
 *     description: Returns the profile of the user associated with the supplied JWT.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user returned successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/me", authenticate, me);

router.post(
  "/oauth/exchange",

  [
    body("code")
      .isString()
      .withMessage("OAuth code must be a string.")
      .trim()
      .notEmpty()
      .withMessage("OAuth code is required."),

    checkExact(),
  ],

  handleValidationErrors,

  exchangeOAuthCode,
);

export default router;
