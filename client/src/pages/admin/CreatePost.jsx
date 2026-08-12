import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { createPost } from "../../api/posts.js";
import { useAuth } from "../../context/AuthContext.jsx";

import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";

function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
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

    setLoading(true);
    setError(null);

    try {
      const data = await createPost({
        title: trimmedTitle,
        content: trimmedContent,
        token,
      });

      navigate(`/admin/posts/${data.post.id}/edit`);
    } catch (error) {
      setError(error.message || "Unable to create the post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-8">
      <div>
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={16} />
          Back to posts
        </Link>
      </div>

      <section className="mt-8">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create Post
        </h1>

        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          Write a new post. It will be saved as a draft until you publish it.
        </p>
      </section>

      {error && (
        <div className="mt-8">
          <Alert>{error}</Alert>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
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
            disabled={loading}
            maxLength={200}
            placeholder="Enter your post title"
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
            disabled={loading}
            maxLength={100000}
            rows={16}
            placeholder="Write your post..."
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700 dark:disabled:bg-slate-800"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {content.length}/100000
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
          <Link
            to="/admin/posts"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>

          <Button type="submit" loading={loading}>
            <Save size={16} className="mr-2" />
            Create draft
          </Button>
        </div>
      </form>
    </main>
  );
}

export default CreatePost;
