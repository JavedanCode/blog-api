import prisma from "../lib/prisma.js";
import { serializePost } from "../utils/post.js";

const postInclude = {
  author: {
    select: {
      username: true,
    },
  },
  _count: {
    select: {
      comments: true,
    },
  },
};

export async function getPosts(user) {
  const isAdmin = user.role === "ADMIN";

  const posts = await prisma.post.findMany({
    where: isAdmin
      ? undefined
      : {
          published: true,
        },

    orderBy: {
      createdAt: "desc",
    },

    include: postInclude,
  });

  return posts.map((post) =>
    serializePost(post, {
      admin: isAdmin,
    }),
  );
}

export async function getPostById(postId, user) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },

    include: postInclude,
  });

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  /*
   * Only admins can see unpublished posts.
   */
  if (!post.published && user.role !== "ADMIN") {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  return serializePost(post, {
    admin: user.role === "ADMIN",
  });
}

export async function createPost({ title, content, authorId }) {
  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      content,
      authorId,
    },

    include: postInclude,
  });

  return serializePost(post, {
    admin: true,
  });
}

export async function updatePost(postId, { title, content }) {
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const post = await prisma.post.update({
    where: {
      id: postId,
    },

    data: {
      ...(title !== undefined && {
        title: title.trim(),
      }),

      ...(content !== undefined && {
        content,
      }),
    },

    include: postInclude,
  });

  return serializePost(post, {
    admin: true,
  });
}

export async function deletePost(postId) {
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
}

export async function publishPost(postId) {
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const post = await prisma.post.update({
    where: {
      id: postId,
    },

    data: {
      published: true,
    },

    include: postInclude,
  });

  return serializePost(post, {
    admin: true,
  });
}

export async function unpublishPost(postId) {
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const post = await prisma.post.update({
    where: {
      id: postId,
    },

    data: {
      published: false,
    },

    include: postInclude,
  });

  return serializePost(post, {
    admin: true,
  });
}
