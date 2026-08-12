import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Post from "../pages/Post.jsx";
import Profile from "../pages/Profile.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminPosts from "../pages/admin/AdminPosts.jsx";
import CreatePost from "../pages/admin/CreatePost.jsx";
import EditPost from "../pages/admin/EditPost.jsx";
import OAuthCallback from "../pages/OAuthCallback.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Authenticated routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/posts/:id" element={<Post />} />

            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/posts" element={<AdminPosts />} />

            <Route path="/admin/posts/new" element={<CreatePost />} />

            <Route path="/admin/posts/:id/edit" element={<EditPost />} />
          </Route>

          {/* Fallback */}

          <Route
            path="*"
            element={
              <main className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold tracking-tight">404</h1>

                  <p className="mt-4 text-slate-500">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
