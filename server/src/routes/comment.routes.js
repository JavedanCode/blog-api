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

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: List comments for a post
 *     description: >
 *       Returns all comments belonging to a published post.
 *       Authentication is required.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: Unique identifier of the post.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Comments returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *               required:
 *                 - comments
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/posts/:postId/comments",

  authenticate,

  param("postId").isUUID().withMessage("Invalid post ID."),

  handleValidationErrors,

  listForPost,
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Create a comment
 *     description: >
 *       Creates a comment on a published post.
 *       Authentication is required.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: Unique identifier of the post.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment created successfully.
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *               required:
 *                 - message
 *                 - comment
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     description: >
 *       Updates a comment. The authenticated user must own the comment,
 *       unless they have administrator privileges.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: Unique identifier of the comment.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment updated successfully.
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *               required:
 *                 - message
 *                 - comment
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: >
 *       Deletes a comment. The authenticated user must own the comment,
 *       unless they have administrator privileges.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: Unique identifier of the comment.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully.
 *
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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
