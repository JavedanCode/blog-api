import {
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
} from "../services/comment.service.js";

export async function listForPost(req, res, next) {
  try {
    const comments = await getCommentsForPost(req.params.postId);

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const comment = await createComment({
      content: req.body.content,
      postId: req.params.postId,
      authorId: req.user.id,
    });

    return res.status(201).json({
      message: "Comment created successfully.",
      comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const comment = await updateComment({
      commentId: req.params.commentId,
      content: req.body.content,
      user: req.user,
    });

    return res.status(200).json({
      message: "Comment updated successfully.",
      comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await deleteComment({
      commentId: req.params.commentId,
      user: req.user,
    });

    return res.status(200).json({
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
