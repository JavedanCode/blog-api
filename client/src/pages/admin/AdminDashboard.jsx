import { useCallback, useEffect, useState } from "react";
import { FileText, MessageCircle, Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { getPosts } from "../../api/posts.js";
import { useAuth } from "../../context/AuthContext.jsx";

import PostCard from "../../components/posts/PostCard.jsx";
import Loading from "../../components/ui/Loading.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";

function AdminDashboard() {
  const { token, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setError(
        error.message || "Unable to load dashboard data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [authLoading, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (authLoading || loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <Alert>{error}</Alert>

          <div className="mt-4 flex justify-center">
            <Button type="button" variant="secondary" onClick={fetchPosts}>
              <RefreshCw size={16} className="mr-2" />
              Try again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const publishedPosts = posts.filter((post) => post.published === true);

  const draftPosts = posts.filter((post) => post.published === false);

  const totalComments = posts.reduce(
    (total, post) => total + (post.commentCount ?? 0),
    0,
  );

  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total posts",
      value: posts.length,
      icon: FileText,
    },
    {
      label: "Published",
      value: publishedPosts.length,
      icon: FileText,
    },
    {
      label: "Drafts",
      value: draftPosts.length,
      icon: FileText,
    },
    {
      label: "Comments",
      value: totalComments,
      icon: MessageCircle,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-8">
      {/* Header */}

      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Manage your posts, drafts, and blog content from one place.
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

      {/* Statistics */}

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Icon size={18} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Recent posts */}

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent posts
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your latest posts and drafts.
            </p>
          </div>

          <Link
            to="/admin/posts"
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Manage all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <FileText
              size={28}
              className="mx-auto text-slate-400 dark:text-slate-500"
            />

            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              No posts yet
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create your first post to get started.
            </p>

            <Link
              to="/admin/posts/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <Plus size={16} />
              Create post
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
