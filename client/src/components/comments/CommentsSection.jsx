import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import { getComments, createComment } from "../../api/comments.js";

import { useAuth } from "../../context/AuthContext.jsx";

import CommentItem from "./CommentItem.jsx";

import Loading from "../ui/Loading.jsx";
import Alert from "../ui/Alert.jsx";
import Button from "../ui/Button.jsx";

function CommentsSection({ postId }) {
  const { token, user } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getComments(postId, token);

      setComments(data.comments ?? []);
    } catch (error) {
      setError(error.message || "Unable to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId, token]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = await createComment({
        postId,
        content: trimmedContent,
        token,
      });

      setComments((current) => [...current, data.comment]);

      setContent("");
    } catch (error) {
      setError(error.message || "Unable to post your comment.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleUpdated(updatedComment) {
    setComments((current) =>
      current.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    );
  }

  function handleDeleted(commentId) {
    setComments((current) =>
      current.filter((comment) => comment.id !== commentId),
    );
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800 sm:mt-12 sm:pt-10">
      <div className="flex items-center gap-2">
        <MessageCircle
          size={20}
          className="text-slate-500 dark:text-slate-400"
        />

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Comments
        </h2>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({comments.length})
        </span>
      </div>

      <div className="mt-6">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Leave a comment
          </label>

          <textarea
            id="comment"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={submitting}
            rows={4}
            maxLength={5000}
            placeholder={`What do you think, ${user?.username || "there"}?`}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800 dark:disabled:bg-slate-800"
          />

          <div className="mt-3 flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {content.length}/5000
            </span>

            <Button
              type="submit"
              loading={submitting}
              disabled={!content.trim()}
            >
              <Send size={15} className="mr-2" />
              Post comment
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-5">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <Loading message="Loading comments..." />
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <MessageCircle
              size={24}
              className="mx-auto text-slate-400 dark:text-slate-500"
            />

            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              No comments yet
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Be the first to share your thoughts.
            </p>
          </div>
        ) : (
          <div>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CommentsSection;
