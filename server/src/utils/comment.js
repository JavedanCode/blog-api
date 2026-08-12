export function serializeComment(comment) {
  if (!comment) {
    return null;
  }

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: {
      id: comment.author.id,
      username: comment.author.username,
    },
  };
}
