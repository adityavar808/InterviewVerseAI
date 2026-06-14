import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";
import OAuthSuccess from "../pages/auth/OAuthSuccess";
import CompleteProfile from "../pages/auth/CompleteProfile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Interviews from "../pages/interviews/Interviews";
import ResumeAnalyzer from "../pages/resume/ResumeAnalyzer";
import CodingPractice from "../pages/coding/CodingPractice";
import CodingQuestions from "../pages/coding/CodingQuestions";
import Analytics from "../pages/analytics/Analytics";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";

import InterviewSession from "../pages/interview-session/InterviewSession";
import Home from "../pages/landing/home";

import DashboardHome from "../pages/dashboard/DashboardHome";
import AdminLogin from "../pages/admin-auth/AdminLogin";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoutes from "../admin/routes/AdminRoutes";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home/>}></Route>

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* OAuth */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* AI Interviews */}

        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <Interviews />
            </ProtectedRoute>
          }
        />

        {/* Resume Analyzer */}

        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />

        {/* Coding Practice */}

        <Route
          path="/coding"
          element={
            <ProtectedRoute>
              <CodingQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding/:id"
          element={
            <ProtectedRoute>
              <CodingPractice />
            </ProtectedRoute>
          }
        />

        {/* Analytics */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Profile */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Settings */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-session"
          element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminRoutes />
            </AdminRoute>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
