import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { getStoredAdminSession } from "../admin/utils/adminHelpers";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "admin") {
    const adminSession = getStoredAdminSession();

    return (
      <Navigate
        to={adminSession?.accessToken ? "/admin" : "/admin-login"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;