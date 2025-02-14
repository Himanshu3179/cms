import { NavLink } from "react-router-dom";
import {
  User,
  FileText,
  Brain,
  Users,
  Rss,
  Newspaper,
  BarChart2,
  Calendar,
  Tag,
  Globe,
  LayoutDashboard,
  Database,
} from "lucide-react";

const SideBar = () => {
  const navLinkStyles =
    "flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md";
  const activeStyles = "bg-gray-100 text-blue-600 font-semibold";

  return (
    <div className="w-64 fixed bg-white shadow-md h-screen flex flex-col pb-2 overflow-y-auto max-h-screen">
      <div className="py-2 px-4 flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/rss-articles"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Rss className="mr-2 h-5 w-5" />
            Sources
          </NavLink>
          <NavLink
            to="/admin/admin-articles"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Newspaper className="mr-2 h-5 w-5" />
            Admin Articles
          </NavLink>
          <NavLink
            to="/admin/user-articles"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <FileText className="mr-2 h-5 w-5" />
            User Articles
          </NavLink>
          <NavLink
            to="/admin/scheduled-posts"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Calendar className="mr-2 h-5 w-5" />
            Scheduled Posts
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            Analytics & Insights
          </NavLink>
          <NavLink
            to="/admin/keywords"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Tag className="mr-2 h-5 w-5" />
            Tags & Keywords
          </NavLink>

          <NavLink
            to="/admin/source-management"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Globe className="mr-2 h-5 w-5" />
            Source Management
          </NavLink>
          <NavLink
            to="/admin/ai-editor"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Brain className="mr-2 h-5 w-5" />
            AI Editor
          </NavLink>
          <NavLink
            to="/admin/user-management"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Users className="mr-2 h-5 w-5" />
            User Management
          </NavLink>
        </nav>
      </div>

      {/* Settings Section */}
      <div className="p-4 mt-auto">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Settings</h3>
        <nav className="space-y-2">
          <NavLink
            to="/admin/settings/profile"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </NavLink>

          <NavLink
            to="/admin/settings/database"
            className={({ isActive }) =>
              `${navLinkStyles} ${isActive ? activeStyles : ""}`
            }
          >
            <Database className="mr-2 h-5 w-5" />
            Database
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
