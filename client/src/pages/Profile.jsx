import { CalendarDays, Mail, Shield, User } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user } = useAuth();

  const formattedDate = user?.createdAt
    ? new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "—";

  const isAdmin = user?.role === "ADMIN";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Your Profile
        </h1>

        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          View your account information and membership details.
        </p>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        {/* Profile header */}

        <div className="border-b border-slate-100 bg-slate-50 px-6 py-8 transition-colors dark:border-slate-800 dark:bg-slate-800/60 sm:px-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white dark:bg-slate-100 dark:text-slate-900">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
                {user?.username || "User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isAdmin ? "Administrator" : "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Account information */}

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Username
              </p>

              <p className="mt-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.username || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Mail size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Email
              </p>

              <p className="mt-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Shield size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Account role
              </p>

              <div className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    isAdmin
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <CalendarDays size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Member since
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Account management
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your profile information is currently read-only. Account editing will
          be available in a future version.
        </p>
      </section>
    </main>
  );
}

export default Profile;
