import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer"; // Import Footer component
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import AdminLayout from "./pages/admin/AdminLayout";
import RSSArticles from "./pages/admin/RSSArticles";
import AdminArticles from "./pages/admin/AdminArticles"; // Admin Articles Page
import UserArticles from "./pages/admin/UserArticles";
import UserManagement from "./pages/admin/UserManagement";
import { AuthPage } from "./pages/AuthPage";
import AdminArticleById from "./pages/AdminArticleById";
import RssArticleById from "./pages/RssArticleById"; // Import RssArticleById component
import UserArticleById from "./pages/UserArticleById"; // Import UserArticleById component
import ArticleById from "./pages/ArticleById";
import ArticleEditorForm from "./pages/ArticleEditorForm";
import Profile from "./pages/Profile";
import MyArticles from "./pages/MyArticles"; // Import MyArticles component
import CopyRssArticle from "./pages/CopyRssArticle"; // Import CopyRssArticle component
import MyArticleById from "./pages/MyArticleById";
import EditArticle from "./pages/EditArticle";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="flex flex-col min-h-screen h-screen">
        <div className="flex-grow pb-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <ArticleEditorForm mode="create" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-articles"
              element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-articles/:id"
              element={
                <ProtectedRoute>
                  <MyArticleById />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/copy-rss-article/:id"
              element={
                <ProtectedRoute>
                  <CopyRssArticle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/user-articles/:id"
              element={
                <ProtectedRoute>
                  <ArticleById />
                </ProtectedRoute>
              }
            />

            {/* Admin Panel Nested Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="rss-articles" element={<RSSArticles />} />
              <Route
                path="rss-articles/:id"
                element={<RssArticleById />}
              />{" "}
              {/* Add this route */}
              <Route path="admin-articles" element={<AdminArticles />} />
              <Route
                path="admin-articles/:id"
                element={<AdminArticleById />}
              />{" "}
              {/* Add this route */}
              <Route path="user-articles" element={<UserArticles />} />
              <Route
                path="user-articles/:id"
                element={<UserArticleById />}
              />{" "}
              {/* Add this route */}
              <Route path="user-management" element={<UserManagement />} />
              <Route path="" element={<Navigate to="rss-articles" replace />} />
            </Route>

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/auth"}
                  replace
                />
              }
            />
          </Routes>
        </div>
        <Footer /> {/* Add Footer component */}
      </div>
    </Router>
  );
};

export default App;
