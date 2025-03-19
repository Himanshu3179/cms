import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FeedEditForm from "../components/FeedEditForm";
import { Feed } from "../types";
import { fetchFeedById, editFeed } from "../api";
import toast from "react-hot-toast";

export default function FeedEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchFeedById(id)
        .then((data: Feed) => {
          setFeed(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (updatedData: Partial<Feed>) => {
    if (!feed) return;
    try {
      // Merge the updated data with the original feed.
      const updatedFeed = { ...feed, ...updatedData };
      const updated = await editFeed(feed._id, updatedFeed);
      setFeed(updated);
      toast.success("Feed updated successfully!");
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feed) return <div>No feed found.</div>;

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Feed</h1>
      <FeedEditForm feed={feed} onSubmit={handleSubmit} />
    </div>
  );
}
