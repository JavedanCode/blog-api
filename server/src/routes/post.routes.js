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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: List blog posts
 *     description: >
 *       Returns a paginated list of posts available to the authenticated user.
 *       Regular users can only see published posts, while administrators can
 *       see both published and unpublished posts.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of posts per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *
 *       - name: sort
 *         in: query
 *         required: false
 *         description: Field used to sort the posts.
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - updatedAt
 *             - title
 *           default: createdAt
 *
 *       - name: order
 *         in: query
 *         required: false
 *         description: Sort direction.
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *
 *     responses:
 *       200:
 *         description: Paginated list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *               required:
 *                 - posts
 *                 - pagination
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

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a blog post
 *     description: >
 *       Returns a single post. Regular users can only retrieve published posts.
 *       Administrators can retrieve both published and unpublished posts.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the post.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Post returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *               required:
 *                 - post
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
  "/:id",

  authenticate,

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

  handleValidationErrors,

  getPost,
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a blog post
 *     description: Creates a new unpublished blog post. Administrator privileges are required.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post created successfully.
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *               required:
 *                 - message
 *                 - post
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
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a blog post
 *     description: Updates the title and/or content of an existing post. Administrator privileges are required.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
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
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post updated successfully.
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *               required:
 *                 - message
 *                 - post
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

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Permanently deletes a blog post and its associated comments. Administrator privileges are required.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the post.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully.
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
  "/:id",

  authenticate,
  authorize("ADMIN"),

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

  handleValidationErrors,

  remove,
);

/**
 * @swagger
 * /posts/{id}/publish:
 *   patch:
 *     summary: Publish a blog post
 *     description: Publishes an existing unpublished post. Administrator privileges are required.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the post.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Post published successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post published successfully.
 *                 post:
 *                   $ref: '#/components/schemas/Post'
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
router.patch(
  "/:id/publish",

  authenticate,
  authorize("ADMIN"),

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

  handleValidationErrors,

  publish,
);

/**
 * @swagger
 * /posts/{id}/unpublish:
 *   patch:
 *     summary: Unpublish a blog post
 *     description: Removes a post from the public published posts list. Administrator privileges are required.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the post.
 *         schema:
 *           type: string
 *           format: uuid
 *
 *     responses:
 *       200:
 *         description: Post unpublished successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post unpublished successfully.
 *                 post:
 *                   $ref: '#/components/schemas/Post'
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
router.patch(
  "/:id/unpublish",

  authenticate,
  authorize("ADMIN"),

  [param("id").isUUID().withMessage("Invalid post ID."), checkExact()],

  handleValidationErrors,

  unpublish,
);

export default router;
