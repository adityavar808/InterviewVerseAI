import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Interviews from "../pages/Interviews";
import CodingQuestions from "../pages/CodingQuestions";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="coding" element={<CodingQuestions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;