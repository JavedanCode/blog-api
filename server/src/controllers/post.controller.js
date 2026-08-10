import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
} from "../services/post.service.js";

export async function listPosts(req, res, next) {
  try {
    const posts = await getPosts(req.user);

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await getPostById(req.params.id, req.user);

    return res.status(200).json({
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const post = await createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.id,
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const post = await updatePost(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });

    return res.status(200).json({
      message: "Post updated successfully.",
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await deletePost(req.params.id);

    return res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function publish(req, res, next) {
  try {
    const post = await publishPost(req.params.id);

    return res.status(200).json({
      message: "Post published successfully.",
      post,
    });
  } catch (error) {
    next(error);
  }
}

export async function unpublish(req, res, next) {
  try {
    const post = await unpublishPost(req.params.id);

    return res.status(200).json({
      message: "Post unpublished successfully.",
      post,
    });
  } catch (error) {
    next(error);
  }
}
