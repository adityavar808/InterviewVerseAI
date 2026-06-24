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
  Sparkles,
  ImagePlus,
  MapPin,
  Code2,
} from "lucide-react";

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-7"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.05] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.55), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <User
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">
                Account Settings
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Update your profile and contact details.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-semibold">
            <Sparkles size={11} />
            Profile Preferences
          </span>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Full Name
            </label>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                size={16}
              />

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-white/[0.01] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-500 cursor-not-allowed outline-none"
                placeholder="Connected email"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Career Role
            </label>

            <div className="relative">
              <BriefcaseBusiness
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="headline"
                value={formValues.headline}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="Your headline or role"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Location
            </label>

            <div className="relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="location"
                value={formValues.location}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="Your city or location"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Account Type
            </label>

            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                size={16}
              />

              <input
                type="text"
                value={user?.role || "Student"}
                disabled
                className="w-full bg-white/[0.01] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-500 cursor-not-allowed outline-none"
                placeholder="Account type"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              GitHub URL
            </label>

            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="githubUrl"
                value={formValues.githubUrl}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              LinkedIn URL
            </label>

            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="linkedinUrl"
                value={formValues.linkedinUrl}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Portfolio URL
            </label>

            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="portfolioUrl"
                value={formValues.portfolioUrl}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div className="lg:col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Profile Image URL
            </label>

            <div className="relative">
              <ImagePlus
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="profileImage"
                value={formValues.profileImage}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="Paste an image URL for your avatar"
              />
            </div>
          </div>

          {/* Skills (Missing Field Added) */}
          <div className="lg:col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Skills (comma separated)
            </label>

            <div className="relative">
              <Code2
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />

              <input
                type="text"
                name="skills"
                value={formValues.skills}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                placeholder="React, Node.js, Python, CSS"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
            Bio
          </label>

          <textarea
            name="bio"
            rows="4"
            value={formValues.bio}
            onChange={handleChange}
            className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-5 text-sm text-slate-200 placeholder:text-slate-500 outline-none resize-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
            placeholder="Tell us a little about yourself"
          />
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;