import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getStoredAdminSession,
} from "../admin/utils/adminHelpers";

const PublicRoute = () => {
  const {
    isAuthenticated,
    isAuthLoading,
    user,
  } = useSelector(
    (state) => state.auth
  );

  if (isAuthLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && user?.role === "admin") {
    const adminSession =
      getStoredAdminSession();

    return (
      <Navigate
        to={
          adminSession?.accessToken
            ? "/admin"
            : "/admin-login"
        }
        replace
      />
    );
  }

  if (isAuthenticated && user?.role === "student" && user?.profileSetupDone === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
