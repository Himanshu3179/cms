import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../api";
import { User } from "../types/users";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>User profile not found</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">User Profile</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Username:</label>
          <p className="text-gray-600">{user.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Email:</label>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Role:</label>
          <p className="text-gray-600">{user.role}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Created At:</label>
          <p className="text-gray-600">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
