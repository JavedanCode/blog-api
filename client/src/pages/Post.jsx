import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getPost } from "../api/posts.js";
import { useAuth } from "../context/AuthContext.jsx";

import Loading from "../components/ui/Loading.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import CommentsSection from "../components/comments/CommentsSection.jsx";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, loading: authLoading } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      setError(error.message || "Unable to load this post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, token, authLoading]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (authLoading || loading) {
    return <Loading message="Loading post..." />;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>

        <Alert>{error}</Alert>

        <div className="mt-4">
          <Button type="button" variant="secondary" onClick={fetchPost}>
            Try again
          </Button>
        </div>
      </main>
    );
  }

  if (!post) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));

  const formattedUpdatedDate = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.updatedAt));

  const wasUpdated =
    new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();

  const commentCount = post.commentCount ?? 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to posts
      </Link>

      <article className="mt-6 sm:mt-8">
        <header className="border-b border-slate-200 pb-6 dark:border-slate-800 sm:pb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            {post.author?.username && (
              <>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {post.author.username}
                </span>

                <span aria-hidden="true">·</span>
              </>
            )}

            <time dateTime={post.createdAt}>{formattedDate}</time>

            {wasUpdated && (
              <>
                <span aria-hidden="true">·</span>

                <span>Updated {formattedUpdatedDate}</span>
              </>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>
        </header>

        <div className="mt-6 max-w-none sm:mt-8">
          <p className="whitespace-pre-wrap text-base leading-8 text-slate-700 dark:text-slate-300">
            {post.content}
          </p>
        </div>

        <footer className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800 sm:mt-10 sm:pt-6">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </div>
        </footer>
      </article>

      <CommentsSection postId={post.id} />
    </main>
  );
}

export default Post;
