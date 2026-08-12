import { useEffect, useState } from "react";
import { Check, Edit3, Trash2, X } from "lucide-react";

import { updateComment, deleteComment } from "../../api/comments.js";

import { useAuth } from "../../context/AuthContext.jsx";

import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";

function CommentItem({ comment, onUpdated, onDeleted }) {
  const { user, token, isAdmin } = useAuth();

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [error, setError] = useState(null);

  const canModify = isAdmin || comment.author?.id === user?.id;

  useEffect(() => {
    setContent(comment.content);
  }, [comment.content]);

  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(comment.createdAt));

  const wasUpdated =
    new Date(comment.updatedAt).getTime() !==
    new Date(comment.createdAt).getTime();

  function startEditing() {
    setError(null);
    setConfirmDelete(false);
    setContent(comment.content);
    setEditing(true);
  }

  function cancelEditing() {
    setError(null);
    setContent(comment.content);
    setEditing(false);
  }

  function startDeleteConfirmation() {
    setError(null);
    setConfirmDelete(true);
  }

  function cancelDelete() {
    setError(null);
    setConfirmDelete(false);
  }

  async function handleUpdate(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Comment cannot be empty.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const data = await updateComment({
        commentId: comment.id,
        content: trimmedContent,
        token,
      });

      setEditing(false);
      onUpdated(data.comment);
    } catch (error) {
      setError(error.message || "Unable to update this comment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      await deleteComment(comment.id, token);

      onDeleted(comment.id);
    } catch (error) {
      setError(error.message || "Unable to delete this comment.");

      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <article className="border-b border-slate-200 py-6 last:border-b-0 dark:border-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {comment.author?.username?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {comment.author?.username || "Unknown user"}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formattedDate}

              {wasUpdated && <span className="ml-1">· edited</span>}
            </p>
          </div>
        </div>

        {canModify && !editing && !confirmDelete && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={startEditing}
              disabled={deleting}
              aria-label="Edit comment"
              title="Edit comment"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Edit3 size={16} />
            </button>

            <button
              type="button"
              onClick={startDeleteConfirmation}
              disabled={deleting}
              aria-label="Delete comment"
              title="Delete comment"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {editing ? (
        <form onSubmit={handleUpdate} className="mt-4">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={saving}
            rows={4}
            maxLength={5000}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800 dark:disabled:bg-slate-800"
          />

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {content.length}/5000
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={saving}
                onClick={cancelEditing}
              >
                <X size={15} className="mr-1.5" />
                Cancel
              </Button>

              <Button type="submit" loading={saving}>
                <Check size={15} className="mr-1.5" />
                Save changes
              </Button>
            </div>
          </div>
        </form>
      ) : confirmDelete ? (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950/50">
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Delete this comment?
            </p>

            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={deleting}
              onClick={cancelDelete}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
            >
              <Trash2 size={15} className="mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
          {comment.content}
        </p>
      )}
    </article>
  );
}

export default CommentItem;
