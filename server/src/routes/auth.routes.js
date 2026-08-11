import { Router } from "express";
import passport from "../config/passport/index.js";

import { body, checkExact } from "express-validator";

import {
  register,
  login,
  oauthCallback,
  me,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/authenticate.js";

import { authenticateOAuth } from "../middleware/authenticateOAuth.js";

import { handleValidationErrors } from "../middleware/validation.js";

import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

/*
 * POST /api/auth/register
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

/*
 * POST /api/auth/login
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

  passport.authenticate("local", {
    session: false,
  }),

  login,
);

/*
 * GET /api/auth/google
 */
router.get(
  "/google",
  authLimiter,
  authenticateOAuth("google", {
    scope: ["profile", "email"],
  }),
);

/*
 * GET /api/auth/google/callback
 */
router.get(
  "/google/callback",

  authenticateOAuth("google"),

  oauthCallback,
);

/*
 * GET /api/auth/github
 */
router.get(
  "/github",
  authLimiter,

  authenticateOAuth("github", {
    scope: ["user:email"],
  }),
);

/*
 * GET /api/auth/github/callback
 */
router.get(
  "/github/callback",

  authenticateOAuth("github"),

  oauthCallback,
);

/*
 * GET /api/auth/me
 */
router.get("/me", authenticate, me);

export default router;
