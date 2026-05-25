import { Navigate } from "react-router-dom";

import { getStoredAdminSession } from "../admin/utils/adminHelpers";

const AdminRoute = ({ children }) => {
  const session =
    getStoredAdminSession();
  const admin = session?.admin;

  if (!session?.accessToken || !admin) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  if (admin.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
