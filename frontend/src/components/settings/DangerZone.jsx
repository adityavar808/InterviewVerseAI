// src/components/settings/DangerZone.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { TriangleAlert, Trash2, LogOut, ShieldAlert } from "lucide-react";

import api from "../../services/api";
import { logout } from "../../redux/slices/authSlice";
import studentService from "../../services/studentApi";

const DangerZone = () => {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0); // 0: initial, 1: step 1 confirmation, 2: step 2 confirmation, 3: type DELETE confirm
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleLogoutDevices = async () => {
    try {
      setIsLoggingOut(true);
      await api.post("/auth/logout");
      dispatch(logout());
      toast.success("Logged out from all devices.");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Unable to logout from all devices.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    try {
      setIsDeleting(true);
      await studentService.deleteAccount();
      dispatch(logout());
      toast.success("Account deleted successfully.");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-red-500/[0.035] border border-red-500/20 backdrop-blur-xl rounded-3xl p-7"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-red-500/[0.05] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-orange-500/[0.03] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.45), rgba(249,115,22,0.25), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <TriangleAlert className="text-red-400" size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white leading-tight">Danger Zone</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sensitive account & security actions</p>
          </div>
        </div>

        {/* Action 1: Logout All Devices */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6 hover:bg-white/[0.045] transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <LogOut className="text-orange-400" size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white leading-tight mb-2">Logout All Devices</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This will immediately sign you out from all active devices and sessions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutDevices}
              disabled={isLoggingOut}
              className="px-5 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-200 text-orange-400 font-semibold text-xs sm:text-sm flex-shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Logging out..." : "Logout Devices"}
            </button>
          </div>
        </div>

        {/* Action 2: Delete Account (With 3 Confirmation Steps) */}
        <div className="bg-white/[0.03] border border-red-500/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="text-red-400" size={18} />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white leading-tight mb-2">Delete Account</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Permanently remove your InterviewVerse AI account, analytics, interviews, coding history, and all associated data.
                </p>
              </div>
            </div>

            {confirmStep === 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmStep(1)}
                  className="px-6 py-3.5 rounded-2xl bg-red-500 hover:bg-red-400 transition-all duration-200 text-white font-semibold text-sm shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] flex-shrink-0 active:scale-[0.98]"
                >
                  Delete Account
                </button>
              </div>
            )}

            {confirmStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mt-2"
              >
                <p className="text-xs text-red-300 font-medium mb-3">
                  Step 1 of 3: Are you sure you want to delete your account? This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmStep(0)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmStep(2)}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-semibold"
                  >
                    Yes, I am sure
                  </button>
                </div>
              </motion.div>
            )}

            {confirmStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mt-2"
              >
                <p className="text-xs text-red-300 font-medium mb-3">
                  Step 2 of 3: Confirm once more. You will lose access to all your resume analysis reports, mock interviews, feedback history, and coding progress immediately.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => { setConfirmStep(0); setDeleteConfirmText(""); }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmStep(3)}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-semibold"
                  >
                    Yes, proceed
                  </button>
                </div>
              </motion.div>
            )}

            {confirmStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mt-2"
              >
                <p className="text-xs text-red-300 font-medium mb-3">
                  Step 3 of 3: To confirm deletion, type <span className="font-bold text-white uppercase tracking-wider bg-red-500/20 px-2 py-0.5 rounded">DELETE</span> in the input field below:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-red-500/40 mb-3"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => { setConfirmStep(0); setDeleteConfirmText(""); }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                    className="px-5 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-semibold text-xs sm:text-sm active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Processing..." : "Permanently Delete Account"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Warning Alert Note */}
        <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-5 hover:bg-red-500/[0.14] transition-all duration-300">
          <div className="flex items-start gap-3.5">
            <ShieldAlert className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight mb-2">Important Warning</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Actions performed inside the danger zone are sensitive and may permanently affect your account, interview history, coding analytics, resume reports, and AI-generated insights. Please proceed carefully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DangerZone;