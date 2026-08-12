import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, FileText, Filter, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  deletePost,
  getPosts,
  publishPost,
  unpublishPost,
} from "../../api/posts.js";

import { useAuth } from "../../context/AuthContext.jsx";

import Loading from "../../components/ui/Loading.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";

function AdminPosts() {
  const { token, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    if (authLoading || !token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getPosts({
        token,
      });

      setPosts(data.posts ?? []);
    } catch (error) {
      setError(error.message || "Unable to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [authLoading, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    if (filter === "published") {
      return posts.filter((post) => post.published === true);
    }

    if (filter === "drafts") {
      return posts.filter((post) => post.published === false);
    }

    return posts;
  }, [posts, filter]);

  async function handlePublish(post) {
    setActionId(post.id);
    setError(null);

    try {
      const data = await publishPost(post.id, token);

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id ? data.post : currentPost,
        ),
      );
    } catch (error) {
      setError(error.message || "Unable to publish this post.");
    } finally {
      setActionId(null);
    }
  }

  async function handleUnpublish(post) {
    setActionId(post.id);
    setError(null);

    try {
      const data = await unpublishPost(post.id, token);

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id ? data.post : currentPost,
        ),
      );
    } catch (error) {
      setError(error.message || "Unable to unpublish this post.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(post) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setActionId(post.id);
    setError(null);

    try {
      await deletePost(post.id, token);

      setPosts((currentPosts) =>
        currentPosts.filter((currentPost) => currentPost.id !== post.id),
      );
    } catch (error) {
      setError(error.message || "Unable to delete this post.");
    } finally {
      setActionId(null);
    }
  }

  if (authLoading || loading) {
    return <Loading message="Loading posts..." />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-8">
      {/* Header */}

      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Manage Posts
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            Create, edit, publish, and manage your blog posts.
          </p>
        </div>

        <Link
          to="/admin/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <Plus size={17} />
          New post
        </Link>
      </section>

      {/* Error */}

      {error && (
        <div className="mt-8">
          <Alert>{error}</Alert>
        </div>
      )}

      {/* Filters */}

      <section className="mt-10 flex flex-col gap-4 border-b border-slate-200 pb-4 transition-colors dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Filter size={16} />

          <span>Filter:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All", posts.length],
            [
              "published",
              "Published",
              posts.filter((post) => post.published).length,
            ],
            [
              "drafts",
              "Drafts",
              posts.filter((post) => !post.published).length,
            ],
          ].map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                filter === value
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {label}

              <span
                className={`ml-1.5 ${
                  filter === value
                    ? "text-slate-300 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Empty state */}

      {filteredPosts.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center transition-colors dark:border-slate-700 dark:bg-slate-900">
          <FileText
            size={30}
            className="mx-auto text-slate-400 dark:text-slate-500"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {filter === "drafts"
              ? "No drafts"
              : filter === "published"
                ? "No published posts"
                : "No posts yet"}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {filter === "all"
              ? "Create your first post to get started."
              : "There are no posts in this category."}
          </p>

          {filter === "all" && (
            <Link
              to="/admin/posts/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <Plus size={16} />
              Create post
            </Link>
          )}
        </section>
      ) : (
        /* Posts */

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredPosts.map((post) => {
              const isBusy = actionId === post.id;

              const formattedDate = new Intl.DateTimeFormat("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(post.createdAt));

              return (
                <article
                  key={post.id}
                  className="p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Post information */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                          {post.title}
                        </h2>

                        {post.published ? (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                            Draft
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formattedDate}</span>

                        <span>
                          {post.commentCount ?? 0}{" "}
                          {(post.commentCount ?? 0) === 1
                            ? "comment"
                            : "comments"}
                        </span>

                        {post.author?.username && (
                          <span>By {post.author.username}</span>
                        )}
                      </div>

                      <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {post.content}
                      </p>
                    </div>

                    {/* Actions */}

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <Edit3 size={15} />
                        Edit
                      </Link>

                      {post.published ? (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isBusy}
                          loading={isBusy}
                          onClick={() => handleUnpublish(post)}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={isBusy}
                          loading={isBusy}
                          onClick={() => handlePublish(post)}
                        >
                          Publish
                        </Button>
                      )}

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(post)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Refresh */}

      {filteredPosts.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={fetchPosts}
            disabled={loading || actionId !== null}
          >
            <RefreshCw size={15} className="mr-2" />
            Refresh
          </Button>
        </div>
      )}
    </main>
  );
}

export default AdminPosts;
