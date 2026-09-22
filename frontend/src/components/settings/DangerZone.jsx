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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-rose-500/[0.035] border border-rose-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-rose-500/10 blur-[40px]" />
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-amber-500/10 blur-[40px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(244,63,94,0.6), rgba(245,158,11,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <TriangleAlert className="text-rose-400" size={18} />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Danger Zone</h2>
            <p className="text-[11px] text-slate-400">Sensitive account & security actions</p>
          </div>
        </div>

        {/* Action 1: Logout All Devices */}
        <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3.5 mb-3.5 hover:bg-white/[0.04] transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <LogOut className="text-amber-400" size={16} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-white leading-tight mb-0.5">Logout All Devices</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sign out immediately from all active devices & sessions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutDevices}
              disabled={isLoggingOut}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all duration-200 text-amber-300 font-bold text-xs flex-shrink-0 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout Devices"}
            </button>
          </div>
        </div>

        {/* Action 2: Delete Account */}
        <div className="bg-white/[0.025] border border-rose-500/15 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="text-rose-400" size={16} />
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-bold text-white leading-tight mb-0.5">Delete Account</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Permanently remove your account, analytics, mock interviews, and data.
                </p>
              </div>
            </div>

            {confirmStep === 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmStep(1)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 transition-all duration-200 text-white font-bold text-xs shadow-md active:scale-[0.98]"
                >
                  Delete Account
                </button>
              </div>
            )}

            {confirmStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3"
              >
                <p className="text-xs text-rose-300 font-medium mb-2.5">
                  Step 1 of 3: Are you sure you want to delete your account? This action is permanent.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmStep(0)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmStep(2)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
                  >
                    Yes, I am sure
                  </button>
                </div>
              </motion.div>
            )}

            {confirmStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3"
              >
                <p className="text-xs text-rose-300 font-medium mb-2.5">
                  Step 2 of 3: Confirm once more. You will lose access to all your interview history and analytics.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => { setConfirmStep(0); setDeleteConfirmText(""); }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmStep(3)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
                  >
                    Yes, proceed
                  </button>
                </div>
              </motion.div>
            )}

            {confirmStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3"
              >
                <p className="text-xs text-rose-300 font-medium mb-2">
                  Step 3 of 3: Type <span className="font-bold text-white uppercase tracking-wider bg-rose-500/20 px-1.5 py-0.5 rounded">DELETE</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-rose-500/50 mb-2.5"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => { setConfirmStep(0); setDeleteConfirmText(""); }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== "DELETE"}
                    className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Warning Alert Note */}
        <div className="mt-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="text-rose-400 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <h3 className="text-xs font-bold text-white leading-tight mb-0.5">Important Warning</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Actions performed inside the danger zone are permanent and may erase all interview history and analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DangerZone;