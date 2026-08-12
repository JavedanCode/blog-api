import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";

import Button from "../components/ui/Button.jsx";
import Alert from "../components/ui/Alert.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;

  const redirectTo = from
    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
    : "/";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login(form);

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      setError(error.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${API_URL}/api/auth/google`;
  }

  function handleGitHubLogin() {
    window.location.href = `${API_URL}/api/auth/github`;
  }

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your account to continue.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
          {error && (
            <div className="mb-6">
              <Alert>{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Username or email
              </label>

              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={form.identifier}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800 dark:disabled:bg-slate-800"
                placeholder="johndoe or john@example.com"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <span className="text-xs text-slate-400 dark:text-slate-500">
                  JWT authentication
                </span>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-800 dark:disabled:bg-slate-800"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              or continue with
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.54 13.58a5.86 5.86 0 0 1 0-3.16V7.89H3.3a9.75 9.75 0 0 0 0 8.22l3.24-2.53Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.39c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.48 14.62 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={handleGitHubLogin}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-slate-900 dark:text-white"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.342-3.369-1.342-.455-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-slate-900 hover:underline dark:text-white"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
