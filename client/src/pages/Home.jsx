import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { getPosts } from "../api/posts.js";
import { useAuth } from "../context/AuthContext.jsx";

import PostCard from "../components/posts/PostCard.jsx";
import Loading from "../components/ui/Loading.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";

function Home() {
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
      setError(error.message || "Unable to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [authLoading, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (authLoading || loading) {
    return <Loading message="Loading posts..." />;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
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

  return (
    <main className="px-4 py-8 sm:py-10">
      {posts.length === 0 ? (
        <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900 sm:mt-12 sm:px-6 sm:py-16">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            No posts yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            There aren't any published posts to show right now.
          </p>
        </section>
      ) : (
        <section className="mx-auto max-w-3xl">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Home;
