import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  const navLinkStyles =
    "px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md";

  const activeStyles = "bg-gray-100 text-blue-600 font-semibold";

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mt-8">Admin Panel</h1>

        {/* Navigation Tabs */}
        <div className="mt-6 flex space-x-4 border-b border-gray-200 pb-2">
          <NavLink
            to="/admin/rss-articles"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            RSS Articles
          </NavLink>
          <NavLink
            to="/admin/admin-articles"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            Admin Articles
          </NavLink>
          <NavLink
            to="/admin/user-articles"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            User Articles
          </NavLink>
          <NavLink
            to="/admin/user-management"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            User Management
          </NavLink>
        </div>

        {/* Outlet for nested routes */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
