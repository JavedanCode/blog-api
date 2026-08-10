import { Router } from "express";
import { body, param } from "express-validator";

import {
  listPosts,
  getPost,
  create,
  update,
  remove,
  publish,
  unpublish,
} from "../controllers/post.controller.js";

import passport from "../config/passport/index.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = Router();

const jwtAuthentication = passport.authenticate("jwt", {
  session: false,
});

/*
 * GET /api/posts
 *
 * Authentication required.
 *
 * USER  → published posts
 * ADMIN → all posts
 */
router.get(
  "/",

  authenticate,

  listPosts,
);
/*
 * GET /api/posts/:id
 *
 * Authentication required.
 *
 * USER  → published posts
 * ADMIN → published + drafts
 */
router.get(
  "/:id",

  authenticate,

  param("id").isUUID().withMessage("Invalid post ID."),

  handleValidationErrors,

  getPost,
);

/*
 * POST /api/posts
 *
 * Admin only.
 */
router.post(
  "/",

  authenticate,
  authorize("ADMIN"),

  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .isLength({
        max: 200,
      })
      .withMessage("Title cannot exceed 200 characters."),

    body("content").notEmpty().withMessage("Content is required."),
  ],

  handleValidationErrors,

  create,
);

/*
 * PUT /api/posts/:id
 *
 * Admin only.
 */
router.put(
  "/:id",

  authenticate,
  authorize("ADMIN"),

  [
    param("id").isUUID().withMessage("Invalid post ID."),

    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty.")
      .isLength({
        max: 200,
      })
      .withMessage("Title cannot exceed 200 characters."),

    body("content")
      .optional()
      .notEmpty()
      .withMessage("Content cannot be empty."),
  ],

  handleValidationErrors,

  update,
);

/*
 * DELETE /api/posts/:id
 *
 * Admin only.
 */
router.delete(
  "/:id",

  authenticate,
  authorize("ADMIN"),

  param("id").isUUID().withMessage("Invalid post ID."),

  handleValidationErrors,

  remove,
);

/*
 * PATCH /api/posts/:id/publish
 *
 * Admin only.
 */
router.patch(
  "/:id/publish",

  authenticate,
  authorize("ADMIN"),

  param("id").isUUID().withMessage("Invalid post ID."),

  handleValidationErrors,

  publish,
);

/*
 * PATCH /api/posts/:id/unpublish
 *
 * Admin only.
 */
router.patch(
  "/:id/unpublish",

  authenticate,
  authorize("ADMIN"),

  param("id").isUUID().withMessage("Invalid post ID."),

  handleValidationErrors,

  unpublish,
);

export default router;
