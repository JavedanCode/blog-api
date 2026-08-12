import { request } from "./client.js";

export async function getComments(postId, token) {
  return request(`/api/posts/${postId}/comments`, {
    token,
  });
}

export async function createComment({ postId, content, token }) {
  return request(`/api/posts/${postId}/comments`, {
    method: "POST",
    token,
    body: {
      content,
    },
  });
}

export async function updateComment({ commentId, content, token }) {
  return request(`/api/comments/${commentId}`, {
    method: "PUT",
    token,
    body: {
      content,
    },
  });
}

export async function deleteComment(commentId, token) {
  return request(`/api/comments/${commentId}`, {
    method: "DELETE",
    token,
  });
}
