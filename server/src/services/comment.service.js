import { AppError } from "../errors/AppError.js";
import prisma from "../lib/prisma.js";
import { serializeComment } from "../utils/comment.js";

const commentInclude = {
  author: {
    select: {
      username: true,
    },
  },
};

/*
 * Get comments for a published post.
 */
export async function getCommentsForPost(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      published: true,
    },
  });

  if (!post || !post.published) {
    throw new AppError("Post not found.", 404, "POST_NOT_FOUND");
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: commentInclude,
  });

  return comments.map(serializeComment);
}

/*
 * Create a comment on a published post.
 */
export async function createComment({ content, postId, authorId }) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      published: true,
    },
  });

  if (!post || !post.published) {
    throw new AppError("Post not found.", 404, "POST_NOT_FOUND");
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      authorId,
    },
    include: commentInclude,
  });

  return serializeComment(comment);
}

/*
 * Find a comment by ID.
 *
 * We keep this internal to the service because callers
 * should not need to know how ownership is represented.
 */
async function getCommentById(commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: commentInclude,
  });

  if (!comment) {
    throw new AppError("Comment not found.", 404, "COMMENT_NOT_FOUND");
  }

  return comment;
}

/*
 * Check whether the current user can modify a comment.
 *
 * ADMIN → always allowed
 * USER  → only if they own the comment
 */
function assertCanModifyComment(comment, user) {
  if (user.role === "ADMIN") {
    return;
  }

  if (comment.authorId !== user.id) {
    throw new AppError(
      "You do not have permission to perform this action.",
      403,
      "FORBIDDEN",
    );
  }
}

/*
 * Update a comment.
 */
export async function updateComment({ commentId, content, user }) {
  const existingComment = await getCommentById(commentId);

  assertCanModifyComment(existingComment, user);

  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: content.trim(),
    },
    include: commentInclude,
  });

  return serializeComment(comment);
}

/*
 * Delete a comment.
 */
export async function deleteComment({ commentId, user }) {
  const existingComment = await getCommentById(commentId);

  assertCanModifyComment(existingComment, user);

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
