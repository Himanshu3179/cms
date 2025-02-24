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
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const SideBar = () => {
  const [isArticlesOpen, setIsArticlesOpen] = useState(true);

  const navLinkStyles =
    "flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md";
  const activeStyles = "bg-gray-100 text-blue-600 font-semibold";
  const subNavLinkStyles = "ml-6"; // Added margin for sub-items

  const links = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/admin-articles", icon: FileText, label: "Admin Articles" },
    { to: "/admin/user-articles", icon: FileText, label: "User Articles" },
    { to: "/admin/scheduled-posts", icon: Calendar, label: "Scheduled Posts" },
    { to: "/admin/analytics", icon: BarChart2, label: "Analytics & Insights" },
    { to: "/admin/keywords", icon: Tag, label: "Tags & Keywords" },
    { to: "/admin/source-management", icon: Globe, label: "Source Management" },
    { to: "/admin/ai-editor", icon: Brain, label: "AI Editor" },
    { to: "/admin/user-management", icon: Users, label: "User Management" },
  ];

  return (
    <div className="w-64 fixed bg-white shadow-md h-screen flex flex-col pb-2 overflow-y-auto max-h-screen">
      <div className="py-2 px-4 flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {/* Articles Dropdown */}
          <div
            className={`${navLinkStyles} cursor-pointer flex items-center justify-between`}
            onClick={() => setIsArticlesOpen(true)}
          >
            <div className="flex items-center">
              <Newspaper className="mr-2 h-5 w-5" />
              Articles
            </div>
          </div>
          {isArticlesOpen && (
            <div className="space-y-2">
              {[
                { label: "RSS Feeds", to: "/admin/rss-articles" },
                { label: "Scraped Websites", to: "/admin/scraped-websites" },
              ].map(({ label, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) =>
                    `${navLinkStyles} ${subNavLinkStyles} ${
                      isActive ? activeStyles : ""
                    }`
                  }
                >
                  <Rss className="mr-2 h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          )}
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${navLinkStyles} ${isActive ? activeStyles : ""}`
              }
            >
              <Icon className="mr-2 h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Settings Section */}
      <div className="p-4 mt-auto">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Settings</h3>
        <nav className="space-y-2">
          {[
            { to: "/admin/settings/profile", icon: User, label: "Profile" },
            {
              to: "/admin/settings/database",
              icon: Database,
              label: "Database",
            },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${navLinkStyles} ${isActive ? activeStyles : ""}`
              }
            >
              <Icon className="mr-2 h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
