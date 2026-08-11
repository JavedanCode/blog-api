import { Router } from "express";
import { body, param, query, checkExact } from "express-validator";

import {
  listPosts,
  getPost,
  create,
  update,
  remove,
  publish,
  unpublish,
} from "../controllers/post.controller.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { handleValidationErrors } from "../middleware/validation.js";

import {
  MAX_LIMIT,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SORT_ORDERS,
} from "../constants/pagination.js";

const router = Router();

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

  [
    query("page")
      .optional()
      .isInt({
        min: 1,
      })
      .withMessage("Page must be a positive integer.")
      .toInt(),

    query("limit")
      .optional()
      .isInt({
        min: 1,
        max: MAX_LIMIT,
      })
      .withMessage("Limit must be between 1 and 100.")
      .toInt(),

    query("sort")
      .optional()
      .isIn(ALLOWED_SORT_FIELDS)
      .withMessage("Sort must be one of: createdAt, updatedAt, title."),

    query("order")
      .optional()
      .isIn(ALLOWED_SORT_ORDERS)
      .withMessage("Order must be either asc or desc."),

    checkExact(),
  ],

  handleValidationErrors,

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

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

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
      .isString()
      .withMessage("Title must be a string.")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .isLength({
        max: 200,
      })
      .withMessage("Title cannot exceed 200 characters."),

    body("content")
      .isString()
      .withMessage("Content must be a string.")
      .notEmpty()
      .withMessage("Content is required.")
      .isLength({
        max: 100_000,
      })
      .withMessage("Content cannot exceed 100,000 characters."),

    checkExact(),
  ],

  handleValidationErrors,

  create,
);

/*
 * PUT /api/posts/:id
 *
 * Admin only.
 *
 * Both title and content are optional,
 * allowing partial updates.
 */
router.put(
  "/:id",

  authenticate,
  authorize("ADMIN"),

  [
    param("id").isUUID().withMessage("Invalid post ID."),

    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string.")
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty.")
      .isLength({
        max: 200,
      })
      .withMessage("Title cannot exceed 200 characters."),

    body("content")
      .optional()
      .isString()
      .withMessage("Content must be a string.")
      .notEmpty()
      .withMessage("Content cannot be empty.")
      .isLength({
        max: 100_000,
      })
      .withMessage("Content cannot exceed 100,000 characters."),

    checkExact(),
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

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

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

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

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

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

  handleValidationErrors,

  unpublish,
);

export default router;
