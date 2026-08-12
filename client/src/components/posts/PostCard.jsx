import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

function PostCard({ post }) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));

  return (
    <article className="border-b border-slate-200 py-8 transition-colors dark:border-slate-800 sm:py-10">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          {post.author?.username && (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {post.author.username}
              </span>

              <span aria-hidden="true">·</span>
            </>
          )}

          <time dateTime={post.createdAt}>{formattedDate}</time>

          <span aria-hidden="true">·</span>

          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={14} />

            {post.commentCount ?? 0}

            {post.commentCount === 1 ? " comment" : " comments"}
          </span>

          {post.published === false && (
            <>
              <span aria-hidden="true">·</span>

              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                Draft
              </span>
            </>
          )}
        </div>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {post.title}
        </h2>

        <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
          {post.content}
        </p>

        <div className="mt-5">
          <Link
            to={`/posts/${post.id}`}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
          >
            Read post
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
