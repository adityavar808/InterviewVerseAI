// src/components/profile/CertificatesSection.jsx

import { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Award, ExternalLink, Sparkles, BadgeCheck, Plus, X } from "lucide-react";
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
    className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-6"
  >
    {/* Glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
           style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(52,211,153,0.25), transparent)" }} />
    </div>

    <div className="relative">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
            <Award className="text-cyan-400" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white leading-tight">Certifications</h2>
            <p className="text-xs text-slate-400 mt-0.5">Professional learning & achievements</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-medium">
            <Sparkles size={11} />
            Verified Learning
          </span>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Plus size={14} />
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
                className={`relative overflow-hidden rounded-2xl border ${theme.border} p-5`}
                style={{ background: theme.glow }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                     style={{ background: `linear-gradient(90deg, ${theme.accentHex}80, transparent)` }} />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.bg}`}>
                      <BadgeCheck className={theme.color} size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight">{item.title || "Certification"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.issuer || "Credential"}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0 ml-2">{getCertificateDateText(item)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCertificate(item)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/20 hover:border-cyan-400/20 hover:text-cyan-300 transition-all duration-200 text-xs text-slate-300"
                >
                  <ExternalLink size={13} />
                  View Certificate
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
      <div className="mt-5 rounded-2xl border border-white/10 px-5 py-4"
           style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(52,211,153,0.08))" }}>
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-white mb-1">AI Learning Summary</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your certifications demonstrate strong commitment to continuous learning in frontend,
              AI systems, full-stack engineering, and problem solving — positively impacting placement readiness.
            </p>
          </div>
        </div>
      </div>
    </div>

    {isAddOpen &&
      typeof document !== "undefined" &&
      createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-3xl px-4 py-8"
          onClick={closeAddModal}
        >
          <div
            className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Add Certificate</h3>
                <p className="text-sm text-slate-400">Enter your certificate details and upload a PDF or image.</p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-slate-300">
                  Certificate Title*
                  <input
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                    placeholder="e.g. Frontend Developer Certification"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Issuer
                  <input
                    name="issuer"
                    value={formValues.issuer}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                    placeholder="e.g. Coursera"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-slate-300">
                  Issue Date
                  <input
                    type="date"
                    name="issueDateStart"
                    value={formValues.issueDateStart}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Expiry / End Date
                  <input
                    type="date"
                    name="issueDateEnd"
                    value={formValues.issueDateEnd}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-300">
                Certificate ID (optional)
                <input
                  name="certificateId"
                  value={formValues.certificateId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  placeholder="e.g. ABCD-1234"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                Description
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                  placeholder="Add a short description of the certificate, course, or skills earned."
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                Upload PDF or Image
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                />
              </label>

              {formValues.fileName && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Uploaded file: <span className="font-medium text-white">{formValues.fileName}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="inline-flex justify-center rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Add Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    {selectedCertificate &&
      typeof document !== "undefined" &&
      createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-3xl px-4 py-8"
          onClick={closeViewModal}
        >
          <div
            className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedCertificate.title}</h3>
                <p className="text-sm text-slate-400">{selectedCertificate.issuer}</p>
              </div>
              <button
                type="button"
                onClick={closeViewModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-slate-300">
            {selectedCertificate.certificateId && (
              <p>
                <span className="font-medium text-white">Certificate ID:</span> {selectedCertificate.certificateId}
              </p>
            )}
            {selectedCertificate.issueDateStart && (
              <p>
                <span className="font-medium text-white">Issued:</span> {selectedCertificate.issueDateStart}
                {selectedCertificate.issueDateEnd ? ` — ${selectedCertificate.issueDateEnd}` : ""}
              </p>
            )}
            {selectedCertificate.description && (
              <div>
                <p className="font-medium text-white mb-2">Description</p>
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">{selectedCertificate.description}</p>
              </div>
            )}
            {selectedCertificate.fileUrl ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                {selectedCertificate.fileType.includes("image") ? (
                  <img
                    src={selectedCertificate.fileUrl}
                    alt={selectedCertificate.fileName}
                    className="h-64 w-full rounded-2xl object-contain"
                  />
                ) : selectedCertificate.fileType === "application/pdf" ? (
                  <iframe
                    title="certificate-preview"
                    src={selectedCertificate.fileUrl}
                    className="h-80 w-full rounded-2xl border border-white/10"
                  />
                ) : (
                  <a
                    href={selectedCertificate.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 underline"
                  >
                    Open uploaded file
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No file uploaded for this certificate.</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={closeViewModal}
              className="inline-flex justify-center rounded-2xl border border-white/10 bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
  </motion.div>
  );
};

export default CertificatesSection;