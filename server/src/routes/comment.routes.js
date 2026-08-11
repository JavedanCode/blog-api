import { Router } from "express";
import { body, param, checkExact } from "express-validator";

import {
  listForPost,
  create,
  update,
  remove,
} from "../controllers/comment.controller.js";

import { authenticate } from "../middleware/authenticate.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = Router();

/*
 * GET /api/posts/:postId/comments
 *
 * Authentication required.
 */
router.get(
  "/posts/:postId/comments",

  authenticate,

  param("postId").isUUID().withMessage("Invalid post ID."),

  handleValidationErrors,

  listForPost,
);

/*
 * POST /api/posts/:postId/comments
 *
 * Any authenticated user.
 */
router.post(
  "/posts/:postId/comments",

  authenticate,

  [
    param("postId").isUUID().withMessage("Invalid post ID."),

    body("content")
      .isString()
      .withMessage("Comment content must be a string.")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required.")
      .isLength({
        max: 5000,
      })
      .withMessage("Comment content cannot exceed 5,000 characters."),

    checkExact(),
  ],

  handleValidationErrors,

  create,
);

/*
 * PUT /api/comments/:commentId
 *
 * Owner or ADMIN.
 */
router.put(
  "/comments/:commentId",

  authenticate,

  [
    param("commentId").isUUID().withMessage("Invalid comment ID."),

    body("content")
      .isString()
      .withMessage("Comment content must be a string.")
      .trim()
      .notEmpty()
      .withMessage("Comment content cannot be empty.")
      .isLength({
        max: 5000,
      })
      .withMessage("Comment content cannot exceed 5,000 characters."),

    checkExact(),
  ],

  handleValidationErrors,

  update,
);

/*
 * DELETE /api/comments/:commentId
 *
 * Owner or ADMIN.
 */
router.delete(
  "/comments/:commentId",

  authenticate,

  [
    param("commentId").isUUID().withMessage("Invalid comment ID."),

    checkExact(),
  ],

  handleValidationErrors,

  remove,
);

export default router;
