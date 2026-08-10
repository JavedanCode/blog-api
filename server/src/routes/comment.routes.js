import { Router } from "express";
import { body, param } from "express-validator";

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
      .trim()
      .notEmpty()
      .withMessage("Comment content is required.")
      .isLength({
        max: 5000,
      })
      .withMessage("Comment cannot exceed 5000 characters."),
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
      .trim()
      .notEmpty()
      .withMessage("Comment content is required.")
      .isLength({
        max: 5000,
      })
      .withMessage("Comment cannot exceed 5000 characters."),
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

  param("commentId").isUUID().withMessage("Invalid comment ID."),

  handleValidationErrors,

  remove,
);

export default router;
