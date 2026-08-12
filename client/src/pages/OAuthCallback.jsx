import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { request } from "../api/client.js";

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { setSession } = useAuth();

  const [error, setError] = useState(null);

  const exchangeStarted = useRef(false);

  useEffect(() => {
    if (exchangeStarted.current) {
      return;
    }

    exchangeStarted.current = true;

    const code = searchParams.get("code");

    if (!code) {
      setError(
        "OAuth authentication failed. No authentication code was provided.",
      );

      return;
    }

    async function exchangeCode() {
      try {
        const data = await request("/api/auth/oauth/exchange", {
          method: "POST",
          body: {
            code,
          },
        });

        setSession(data.accessToken, data.user);

        navigate("/", {
          replace: true,
        });
      } catch (error) {
        setError(error.message || "OAuth authentication failed.");
      }
    }

    exchangeCode();
  }, [searchParams, setSession, navigate]);

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Authentication failed
          </h1>

          <p className="mt-3 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() =>
              navigate("/login", {
                replace: true,
              })
            }
            className="mt-6 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while we finish authentication.
        </p>
      </div>
    </main>
  );
}

export default OAuthCallback;
