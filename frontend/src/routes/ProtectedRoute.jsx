import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { getStoredAdminSession } from "../admin/utils/adminHelpers";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

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

  const isProfileSetupPending =
    user?.role === "student" && user?.profileSetupDone === false;

  if (isProfileSetupPending && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  if (!isProfileSetupPending && location.pathname === "/complete-profile") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
