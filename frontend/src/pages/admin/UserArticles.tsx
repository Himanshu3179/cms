import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllUserArticles } from "../../api";
import { Article } from "../../types/article";

const UserArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchAllUserArticles();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">User Articles</h2>
      <p className="mt-2 text-gray-600">Manage user articles here.</p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Categories
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Link
                    to={`/admin/user-articles/${article._id}`}
                    className="hover:text-blue-700 hover:underline"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.category.join(", ")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      article.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserArticles;
