import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserArticleById } from "../api";
import { Article } from "../types/article";
import { Link } from "react-router-dom";
const UserArticleById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (id) {
          const data = await fetchUserArticleById(id);
          setArticle(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!article) {
    return <p>Article not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div
        className="text-gray-600 mb-4"
        dangerouslySetInnerHTML={{ __html: article.description }}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {article.category.map((category, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: "#E5E7EB", color: "#1F2937" }}
          >
            {category}
          </span>
        ))}
      </div>
      <div>
        Source :-
        <Link
          to={`/admin/articles/${article._id}/edit`}
          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          {" "}
          {article.sourceUrl}
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Published on: {new Date(article.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default UserArticleById;
