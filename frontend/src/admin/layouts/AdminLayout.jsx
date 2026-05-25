import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { adminService } from "../services/adminApi";
import { clearStoredAdminSession } from "../utils/adminHelpers";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await adminService.logout();
      clearStoredAdminSession();
      toast.success(
        "Admin logged out successfully",
      );
      navigate("/admin-login");
    } catch (error) {
      clearStoredAdminSession();
      navigate("/admin-login");
      toast.error(
        error.response?.data?.message ||
          "Unable to logout cleanly",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:38px_38px]" />

      {sidebarOpen ? (
        <button
          type="button"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="absolute inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      ) : null}

      <div className="relative z-50">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminNavbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
