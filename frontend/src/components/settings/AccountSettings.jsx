// src/components/settings/AccountSettings.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  BriefcaseBusiness,
  FileText,
  Save,
  MapPin,
  Code2,
  Globe,
  Camera,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const AccountSettings = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    name: "",
    headline: "",
    location: "",
    bio: "",
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    profileImage: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFormValues({
      name: user.name || "",
      headline: user.headline || "",
      location: user.location || "",
      bio: user.bio || "",
      skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      portfolioUrl: user.portfolioUrl || "",
      profileImage: user.profileImage || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !formValues.name.trim() ||
      !formValues.location.trim() ||
      !formValues.bio.trim() ||
      !formValues.skills.trim()
    ) {
      toast.error("Name, location, bio, and skills are required.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: formValues.name.trim(),
        location: formValues.location.trim(),
        bio: formValues.bio.trim(),
        headline: formValues.headline.trim(),
        skills: formValues.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        githubUrl: formValues.githubUrl.trim(),
        linkedinUrl: formValues.linkedinUrl.trim(),
        portfolioUrl: formValues.portfolioUrl.trim(),
        profileImage: formValues.profileImage.trim(),
      };

      const updatedUser = await studentService.updateProfile(payload);
      dispatch(setCredentials({ user: updatedUser, accessToken }));
      toast.success("Account settings saved successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save account settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.05] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.55), rgba(139,92,246,0.3), transparent)" }}
        />
      </div>

      <div className="relative space-y-4">
        {/* Header Bar with Avatar + Action */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Avatar Circle */}
            <div className="relative group">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {formValues.profileImage && formValues.profileImage.startsWith("http") ? (
                  <img src={formValues.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-cyan-400" size={20} />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                title="Change Avatar URL"
              >
                <Camera size={10} />
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-white leading-tight">Account Settings</h2>
              <p className="text-[11px] text-slate-400">Update your profile, roles & social links.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {/* Optional Collapsible Profile Image URL Field */}
        {showImageInput && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <label className="text-[10px] font-mono text-cyan-300 uppercase block mb-1">Avatar Image URL</label>
            <input
              type="text"
              name="profileImage"
              value={formValues.profileImage}
              onChange={handleChange}
              placeholder="Paste image URL (https://...)"
              className="w-full bg-slate-950/60 border border-cyan-500/30 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400"
            />
          </motion.div>
        )}

        {/* Compact 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Full Name */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="Full Name"
              />
            </div>
          </div>

          {/* Email (Disabled) */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Career Role */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Career Role</label>
            <div className="relative">
              <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="headline"
                value={formValues.headline}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="Fullstack Engineer"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="location"
                value={formValues.location}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Account Type</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
              <input
                type="text"
                value={user?.role || "Student"}
                disabled
                className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-500 cursor-not-allowed outline-none uppercase"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Skills (Comma Separated)</label>
            <div className="relative">
              <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="skills"
                value={formValues.skills}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="React, Node.js, Python"
              />
            </div>
          </div>

          {/* GitHub URL */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">GitHub Profile</label>
            <div className="relative">
              <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="githubUrl"
                value={formValues.githubUrl}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">LinkedIn Profile</label>
            <div className="relative">
              <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="linkedinUrl"
                value={formValues.linkedinUrl}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          {/* Portfolio URL */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Portfolio Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                name="portfolioUrl"
                value={formValues.portfolioUrl}
                onChange={handleChange}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 transition-all"
                placeholder="https://yourportfolio.app"
              />
            </div>
          </div>
        </div>

        {/* Compact Bio */}
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Short Bio</label>
          <textarea
            name="bio"
            rows="2"
            value={formValues.bio}
            onChange={handleChange}
            className="w-full bg-slate-950/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none resize-none focus:border-cyan-400/50 transition-all"
            placeholder="Tell us a bit about yourself..."
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;