import { Router } from "express";
import passport from "../config/passport/index.js";

import { body } from "express-validator";

import {
  register,
  login,
  oauthCallback,
  me,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/authenticate.js";

import { handleValidationErrors } from "../middleware/validation.js";

const router = Router();

/*
 * POST /api/auth/register
 */
router.post(
  "/register",

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
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters long."),
  ],

  handleValidationErrors,
  register,
);

/*
 * POST /api/auth/login
 */
router.post(
  "/login",

  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Username or email is required."),

    body("password").notEmpty().withMessage("Password is required."),
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
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

/*
 * GET /api/auth/google/callback
 */
router.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
  }),

  oauthCallback,
);

/*
 * GET /api/auth/github
 */
router.get(
  "/github",

  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

/*
 * GET /api/auth/github/callback
 */
router.get(
  "/github/callback",

  passport.authenticate("github", {
    session: false,
  }),

  oauthCallback,
);

/*
 * GET /api/auth/me
 */
router.get("/me", authenticate, me);

export default router;
