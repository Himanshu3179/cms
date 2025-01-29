import { Link } from "react-router-dom";
import { AdminArticle } from "../types/adminArticles";
import { useAuth } from "../context/AuthContext";
import { Calendar } from "lucide-react";

interface ArticleCardProps {
  article: AdminArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  let role = user.role as string;
  if (role !== "admin") {
    role = "user";
  }

  return (
    <Link to={`/${role}/${role}-articles/${article._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-[280px] border ">
        {/* Title Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2 min-h-[3.5rem]">
          {article.title}
        </h2>

        {/* Categories Section */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-2">
            {article.category.map((category, index) => (
              <span
                key={index}
                className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 whitespace-nowrap hover:bg-blue-100 transition-colors duration-200"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Date Section */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
          <time dateTime={article.createdAt}>
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 20px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94A3B8;
        }
      `}</style>
    </Link>
  );
}
