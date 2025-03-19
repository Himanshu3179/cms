import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import AdminLayout from "./pages/admin/AdminLayout";
import RSSArticles from "./pages/admin/RSSArticles";
import AdminArticles from "./pages/admin/AdminArticles";
import UserArticles from "./pages/admin/UserArticles";
import UserManagement from "./pages/admin/UserManagement";
import { AuthPage } from "./pages/AuthPage";
import AdminArticleById from "./pages/AdminArticleById";
import RssArticleById from "./pages/RssArticleById";
import UserArticleById from "./pages/UserArticleById";
import ArticleById from "./pages/ArticleById";
import ArticleEditorForm from "./pages/ArticleEditorForm";
import Profile from "./pages/Profile";
import MyArticles from "./pages/MyArticles";
import CopyRssArticle from "./pages/CopyRssArticle";
import AIEditor from "./pages/admin/AIEditor";
import { SelectedArticlesProvider } from "./context/SelectedArticlesContext";
import MyArticleById from "./pages/MyArticleById";
import SourceManagement from "./pages/admin/SourceManagement";
import AIGeneratedArticles from "./pages/admin/AIGeneratedArticles";
import AIGeneratedArticleById from "./pages/admin/AIGeneratedArticleById";
import ScrapedWebsites from "./pages/admin/ScrapedWebsites";
import FeedEditPage from "./pages/FeedEditPage";
import ScheduledPosts from "./pages/ScheduledPosts";
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
      <div className="flex flex-col min-h-screen h-screen pt-16">
        <div className="flex-grow pb-10">
          <SelectedArticlesProvider>
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
                    <ArticleEditorForm mode="edit" />
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
                <Route path="scraped-websites" element={<ScrapedWebsites />} />
                <Route path="rss-articles/:id" element={<RssArticleById />} />
                <Route
                  path="rss-articles/edit/:id"
                  element={<FeedEditPage />}
                />
                <Route path="admin-articles" element={<AdminArticles />} />
                <Route
                  path="admin-articles/:id"
                  element={<AdminArticleById />}
                />
                <Route path="user-articles" element={<UserArticles />} />
                <Route path="user-articles/:id" element={<UserArticleById />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="ai-editor" element={<AIEditor />} />
                <Route
                  path="source-management"
                  element={<SourceManagement />}
                />
                <Route
                  path="ai-generated-articles"
                  element={<AIGeneratedArticles />}
                />
                <Route
                  path="ai-generated-articles/:id"
                  element={<AIGeneratedArticleById />}
                />
                <Route path="calendar" element={<ScheduledPosts />} />
                <Route path="settings/profile" element={<Profile />} />
                {/* <Route path="settings/account" element={<Account />} /> */}
                <Route
                  path=""
                  element={<Navigate to="rss-articles" replace />}
                />
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
          </SelectedArticlesProvider>
        </div>
      </div>
    </Router>
  );
};

export default App;
