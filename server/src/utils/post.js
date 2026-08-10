export function serializePost(post, { admin = false } = {}) {
  const serializedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      username: post.author.username,
    },
    commentCount: post._count?.comments ?? 0,
  };

  if (admin) {
    serializedPost.published = post.published;
  }

  return serializedPost;
}
