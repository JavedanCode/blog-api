import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
        <Navbar />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <a
            href="https://github.com/JavedanCode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            © 2026 JavedanCode
          </a>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
