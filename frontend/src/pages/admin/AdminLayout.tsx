import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/SideBar";

const AdminLayout = () => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex">
      <SideBar />
      <div className="flex-grow p-6 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
