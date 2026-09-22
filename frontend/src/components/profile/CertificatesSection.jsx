// src/components/profile/CertificatesSection.jsx

import { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Award,
  ExternalLink,
  Sparkles,
  BadgeCheck,
  Plus,
  X,
  KeyRound,
  Calendar,
  Building2,
  FileCheck,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const certificateThemes = [
  {
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    accentHex: "#06b6d4",
    glow: "rgba(6,182,212,0.07)",
  },
  {
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    accentHex: "#8b5cf6",
    glow: "rgba(139,92,246,0.07)",
  },
  {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    accentHex: "#34d399",
    glow: "rgba(52,211,153,0.07)",
  },
  {
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    accentHex: "#f472b6",
    glow: "rgba(244,114,182,0.07)",
  },
];

const emptyCertificateForm = {
  title: "",
  issuer: "",
  description: "",
  certificateId: "",
  issueDateStart: "",
  issueDateEnd: "",
  fileUrl: "",
  fileName: "",
  fileType: "",
};

const CertificatesSection = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const certificates = Array.isArray(user?.certifications) ? user.certifications : [];

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [formValues, setFormValues] = useState(emptyCertificateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => setFormValues(emptyCertificateForm);

  const closeAddModal = () => {
    setIsAddOpen(false);
    resetForm();
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const closeViewModal = () => setSelectedCertificate(null);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormValues((prev) => ({
        ...prev,
        fileUrl: "",
        fileName: "",
        fileType: "",
      }));
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      toast.error("File is too large. Please upload a file smaller than 5MB.");
      setFormValues((prev) => ({
        ...prev,
        fileUrl: "",
        fileName: "",
        fileType: "",
      }));
      return;
    }

    try {
      const fileUrl = await readFileAsDataUrl(file);
      setFormValues((prev) => ({
        ...prev,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
      }));
    } catch (error) {
      toast.error("Unable to read the selected file.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCertificateDateText = (item) => {
    if (!item) return "";
    if (item.issueDateStart && item.issueDateEnd) {
      return `${item.issueDateStart} - ${item.issueDateEnd}`;
    }
    if (item.issueDateStart) {
      return item.issueDateStart;
    }
    return item.year || "";
  };

  const handleAddCertificate = async (event) => {
    event.preventDefault();

    if (!formValues.title.trim()) {
      toast.error("Certificate title is required.");
      return;
    }

    const newCertificate = {
      title: formValues.title.trim(),
      issuer: formValues.issuer.trim(),
      year:
        formValues.issueDateEnd || formValues.issueDateStart
          ? getCertificateDateText(formValues)
          : "",
      description: formValues.description.trim(),
      certificateId: formValues.certificateId.trim(),
      issueDateStart: formValues.issueDateStart,
      issueDateEnd: formValues.issueDateEnd,
      fileUrl: formValues.fileUrl,
      fileName: formValues.fileName,
      fileType: formValues.fileType,
    };

    const updatedCertificates = [...certificates, newCertificate];

    try {
      setIsSubmitting(true);

      const payload = {
        name: user?.name || "",
        location: user?.location || "",
        bio: user?.bio || "",
        skills: user?.skills || [],
        headline: user?.headline || "",
        profileImage: user?.profileImage || "",
        githubUrl: user?.githubUrl || "",
        linkedinUrl: user?.linkedinUrl || "",
        portfolioUrl: user?.portfolioUrl || "",
        certifications: updatedCertificates,
      };

      const updatedUser = await studentService.updateProfile(payload);
      dispatch(setCredentials({ user: updatedUser, accessToken }));
      toast.success("Certificate added successfully.");
      closeAddModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save certificate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-xl"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(52,211,153,0.25), transparent)",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <Award className="text-cyan-400" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white leading-tight">Certifications</h2>
              <p className="text-[11px] text-slate-400">Professional learning & achievements</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[10px] font-medium">
              <Sparkles size={11} />
              Verified Learning
            </span>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
            >
              <Plus size={13} />
              Add Certificate
            </button>
          </div>
        </div>

        {/* Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((item, i) => {
              const theme = certificateThemes[i % certificateThemes.length];
              return (
                <motion.div
                  key={`${item.title}-${i}`}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  className={`relative overflow-hidden rounded-2xl border ${theme.border} p-4`}
                  style={{ background: theme.glow }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1.5px]"
                    style={{ background: `linear-gradient(90deg, ${theme.accentHex}80, transparent)` }}
                  />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.bg}`}>
                        <BadgeCheck className={theme.color} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight truncate">{item.title || "Certification"}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.issuer || "Credential"}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{getCertificateDateText(item)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCertificate(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-black/20 hover:border-cyan-400/30 hover:text-cyan-300 transition-all duration-200 text-xs text-slate-300 cursor-pointer"
                  >
                    <ExternalLink size={12} />
                    <span>View Certificate</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-sm text-slate-400">
            Certifications will appear here after you add them in your profile setup.
          </div>
        )}

        {/* AI summary */}
        <div
          className="mt-4 rounded-xl border border-white/10 px-4 py-3"
          style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(52,211,153,0.08))" }}
        >
          <div className="flex items-start gap-2">
            <Sparkles size={13} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white mb-0.5">AI Learning Summary</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your certifications demonstrate strong commitment to continuous learning in frontend,
                AI systems, full-stack engineering, and problem solving.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ADD CERTIFICATE MODAL ────────────────────────────────────────────── */}
      {isAddOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl px-4 py-6 overflow-y-auto"
            onClick={closeAddModal}
          >
            <div
              className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 sm:p-7 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl overflow-hidden my-auto"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Top accent line & ambient glows */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }} />
              </div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Award size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Add Certificate</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Upload and link verified learning credentials</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 flex items-center justify-center transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleAddCertificate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                      Certificate Title*
                      <input
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
                        placeholder="e.g. Fullstack React & Node Certification"
                      />
                    </label>
                    <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                      Issuing Organization / Issuer
                      <input
                        name="issuer"
                        value={formValues.issuer}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
                        placeholder="e.g. Coursera, AWS, Meta"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                      Issue Date
                      <input
                        type="date"
                        name="issueDateStart"
                        value={formValues.issueDateStart}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-cyan-400/50"
                      />
                    </label>
                    <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                      Expiry / End Date
                      <input
                        type="date"
                        name="issueDateEnd"
                        value={formValues.issueDateEnd}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-cyan-400/50"
                      />
                    </label>
                  </div>

                  <label className="space-y-1.5 text-xs font-semibold text-slate-300 block">
                    Certificate ID (Optional)
                    <input
                      name="certificateId"
                      value={formValues.certificateId}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
                      placeholder="e.g. ABCD-1234-XYZ"
                    />
                  </label>

                  <label className="space-y-1.5 text-xs font-semibold text-slate-300 block">
                    Description
                    <textarea
                      name="description"
                      rows={2}
                      value={formValues.description}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
                      placeholder="Brief details about skills mastered or coursework completed."
                    />
                  </label>

                  <label className="space-y-1.5 text-xs font-semibold text-slate-300 block">
                    Upload PDF or Image (Max 5MB)
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 cursor-pointer"
                    />
                  </label>

                  {formValues.fileName && (
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-2 text-xs text-cyan-300 flex items-center gap-2">
                      <FileCheck size={14} />
                      <span>Uploaded file: <strong>{formValues.fileName}</strong></span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Add Certificate"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ─── VIEW CERTIFICATE PREVIEW MODAL (25% Left Details / 75% Right Document Split) ────── */}
      {selectedCertificate &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/85 backdrop-blur-2xl p-4 sm:p-6"
            onClick={closeViewModal}
          >
            <div
              className="relative w-full max-w-6xl h-[85vh] max-h-[780px] rounded-3xl border border-white/10 bg-slate-900/95 p-5 sm:p-6 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl overflow-hidden flex flex-col my-auto"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Top accent line & ambient glows */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
                <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }} />
              </div>

              {/* 25% Left / 75% Right Split Flex Container */}
              <div className="relative flex flex-col lg:flex-row gap-6 h-full min-h-0">
                
                {/* ─── LEFT PANEL (25% Width - Certificate Details) ───────────────── */}
                <div className="w-full lg:w-1/4 lg:max-w-[320px] flex-shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-5 min-h-0">
                  <div className="space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                    {/* Header Badge & Title */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                          <Award size={20} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold">
                          <BadgeCheck size={11} />
                          Verified
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                        {selectedCertificate.title || "Certificate Details"}
                      </h3>
                      {selectedCertificate.issuer && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Building2 size={13} className="text-cyan-400 flex-shrink-0" />
                          <span>{selectedCertificate.issuer}</span>
                        </p>
                      )}
                    </div>

                    {/* Metadata Chips */}
                    <div className="space-y-2.5 pt-1">
                      {selectedCertificate.certificateId && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5 flex items-center gap-1.5">
                            <KeyRound size={12} className="text-cyan-400" />
                            Certificate ID
                          </p>
                          <p className="text-xs font-mono text-white font-medium break-all">{selectedCertificate.certificateId}</p>
                        </div>
                      )}

                      {getCertificateDateText(selectedCertificate) && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5 flex items-center gap-1.5">
                            <Calendar size={12} className="text-violet-400" />
                            Issue Period
                          </p>
                          <p className="text-xs text-white font-medium">{getCertificateDateText(selectedCertificate)}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {selectedCertificate.description && (
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                          <FileText size={12} className="text-cyan-400" />
                          Description
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {selectedCertificate.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Left Column Bottom Close Button */}
                  <div className="pt-3 mt-3 border-t border-white/10 flex-shrink-0">
                    <button
                      type="button"
                      onClick={closeViewModal}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-white/10 cursor-pointer"
                    >
                      Close Details
                    </button>
                  </div>
                </div>

                {/* ─── RIGHT PANEL (75% Width - Certificate Document Viewer) ─────── */}
                <div className="flex-1 min-w-0 h-full flex flex-col justify-between">
                  {/* Top Document Bar */}
                  <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCheck size={16} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {selectedCertificate.fileName || selectedCertificate.title || "Certificate Document"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selectedCertificate.fileUrl && (
                        <a
                          href={selectedCertificate.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition"
                        >
                          <ExternalLink size={13} />
                          <span>Open Fullscreen</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={closeViewModal}
                        className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 flex items-center justify-center transition cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Full Document Display Area (75% Screen Space) */}
                  <div className="flex-1 min-h-0 w-full rounded-2xl border border-white/10 bg-slate-950/90 overflow-hidden flex items-center justify-center relative">
                    {selectedCertificate.fileUrl ? (
                      selectedCertificate.fileType?.includes("image") ? (
                        <img
                          src={selectedCertificate.fileUrl}
                          alt={selectedCertificate.fileName || "Certificate"}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <iframe
                          title="certificate-preview"
                          src={selectedCertificate.fileUrl}
                          className="w-full h-full border-0 bg-slate-900"
                        />
                      )
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                        <FileText size={32} className="text-slate-600" />
                        <p>No document file uploaded for this certificate credential.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>,
          document.body
        )}
    </motion.div>
  );
};

export default CertificatesSection;