import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  deletePost,
  getPost,
  publishPost,
  unpublishPost,
  updatePost,
} from "../../api/posts.js";

import { useAuth } from "../../context/AuthContext.jsx";

import Loading from "../../components/ui/Loading.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();

  const [post, setPost] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (authLoading || !token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getPost(id, token);

      setPost(data.post);
      setTitle(data.post.title);
      setContent(data.post.content);
    } catch (error) {
      setError(error.message || "Unable to load this post.");
    } finally {
      setLoading(false);
    }
  }, [authLoading, id, token]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  async function handleSave(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedContent) {
      setError("Content is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const data = await updatePost({
        postId: id,
        title: trimmedTitle,
        content: trimmedContent,
        token,
      });

      setPost(data.post);
      setTitle(data.post.title);
      setContent(data.post.content);
    } catch (error) {
      setError(error.message || "Unable to save the post.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublishToggle() {
    setPublishing(true);
    setError(null);

    try {
      const data = post.published
        ? await unpublishPost(id, token)
        : await publishPost(id, token);

      setPost(data.post);
    } catch (error) {
      setError(error.message || "Unable to update the post status.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deletePost(id, token);

      navigate("/admin/posts");
    } catch (error) {
      setError(error.message || "Unable to delete the post.");

      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <Loading message="Loading post..." />;
  }

  if (error && !post) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-8">
        <Alert>{error}</Alert>

        <div className="mt-4">
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft size={16} />
            Back to posts
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-8">
      {/* Header */}

      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={16} />
          Back to posts
        </Link>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            post.published
              ? "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
          }`}
        >
          {post.published ? "Published" : "Draft"}
        </span>
      </div>

      <section className="mt-8">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Edit Post
        </h1>

        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          Update your post and manage its publication status.
        </p>
      </section>

      {error && (
        <div className="mt-8">
          <Alert>{error}</Alert>
        </div>
      )}

      {/* Editor */}

      <form
        onSubmit={handleSave}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={saving || deleting}
            maxLength={200}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 dark:disabled:bg-slate-800"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {title.length}/200
            </span>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Content
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={saving || deleting}
            maxLength={100000}
            rows={18}
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 dark:disabled:bg-slate-800"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {content.length}/100000
            </span>
          </div>
        </div>

        {/* Save */}

        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
          <Button type="submit" loading={saving} disabled={deleting}>
            <Save size={16} className="mr-2" />
            Save changes
          </Button>
        </div>
      </form>

      {/* Publishing controls */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Publication
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {post.published
              ? "This post is currently visible to regular users."
              : "This post is currently a draft and is hidden from regular users."}
          </p>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            variant="secondary"
            loading={publishing}
            disabled={saving || deleting}
            onClick={handlePublishToggle}
          >
            {post.published ? (
              <>
                <EyeOff size={16} className="mr-2" />
                Unpublish post
              </>
            ) : (
              <>
                <Eye size={16} className="mr-2" />
                Publish post
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Danger zone */}

      <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 transition-colors dark:border-red-900/60 dark:bg-red-950/30 sm:p-8">
        <div>
          <h2 className="text-base font-semibold text-red-900 dark:text-red-300">
            Danger zone
          </h2>

          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            Deleting this post is permanent and cannot be undone.
          </p>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            variant="danger"
            loading={deleting}
            disabled={saving || publishing}
            onClick={handleDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Delete post
          </Button>
        </div>
      </section>
    </main>
  );
}

export default EditPost;
