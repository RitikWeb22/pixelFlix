import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminProtected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#070707",
          color: "#f5f5f5",
        }}
      >
        Verifying admin access...
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtected;
