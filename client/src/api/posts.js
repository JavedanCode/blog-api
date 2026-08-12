import { request } from "./client.js";

export async function getPosts({
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  token,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
    order,
  });

  return request(`/api/posts?${params.toString()}`, {
    token,
  });
}

export async function getPost(postId, token) {
  return request(`/api/posts/${postId}`, {
    token,
  });
}

export async function createPost({ title, content, token }) {
  return request("/api/posts", {
    method: "POST",
    token,
    body: {
      title,
      content,
    },
  });
}

export async function updatePost({ postId, title, content, token }) {
  return request(`/api/posts/${postId}`, {
    method: "PUT",
    token,
    body: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });
}

export async function deletePost(postId, token) {
  return request(`/api/posts/${postId}`, {
    method: "DELETE",
    token,
  });
}

export async function publishPost(postId, token) {
  return request(`/api/posts/${postId}/publish`, {
    method: "PATCH",
    token,
  });
}

export async function unpublishPost(postId, token) {
  return request(`/api/posts/${postId}/unpublish`, {
    method: "PATCH",
    token,
  });
}
