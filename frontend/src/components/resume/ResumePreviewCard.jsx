import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Eye,
  FileText,
  HardDrive,
  Mail,
  ScanSearch,
  Sparkles,
  Upload,
  User2,
} from "lucide-react";

const ACCEPTED_TYPES = {
  "text/plain": [".txt"],
  "text/markdown": [".md"],
  "application/json": [".json"],
};

const ResumePreviewCard = ({
  resumeMeta,
  previewText,
  onFileUpload,
  onPreview,
  statusMessage,
  error,
  loading = false,
  analysis = null,
  selectedRole,
}) => {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ACCEPTED_TYPES,
    multiple: false,
    disabled: loading,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (file) {
        onFileUpload(file);
      }
    },
  });

  const statusTone = error
    ? "border-rose-400/20 bg-rose-500/10 text-rose-100"
    : loading
      ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-100"
      : previewText
        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
        : "border-white/10 bg-white/[0.04] text-slate-200";

  const profileRows = [
    {
      label: "Candidate",
      value: analysis?.summary?.name || "Waiting for parsed resume",
      icon: User2,
    },
    {
      label: "Email",
      value: analysis?.summary?.email || "We'll detect it after upload",
      icon: Mail,
    },
    {
      label: "Target Role",
      value: selectedRole,
      icon: ScanSearch,
    },
  ];

  const quickFacts = [
    {
      label: "Uploaded",
      value: resumeMeta?.uploadDate || "—",
    },
    {
      label: "File Size",
      value: resumeMeta?.size || "—",
    },
    {
      label: "Format",
      value: resumeMeta?.fileName?.includes(".")
        ? resumeMeta.fileName.split(".").pop()?.toUpperCase()
        : "—",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.1),transparent_32%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-100">
              <Sparkles size={14} />
              Resume Workspace
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Upload once, inspect faster, iterate with confidence
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              This is your working area for parsing resume text, checking the extracted content, and keeping the analyzer focused on the role you actually want.
            </p>
          </div>

          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${statusTone}`}>
            {error ? "Needs attention" : loading ? "Analyzing" : previewText ? "Analysis ready" : "Awaiting upload"}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_320px]">
          <div
            {...getRootProps()}
            className={`relative overflow-hidden rounded-[30px] border border-dashed p-5 transition-all ${
              isDragActive
                ? "border-cyan-300 bg-cyan-500/10"
                : "border-white/12 bg-black/20 hover:border-cyan-400/30 hover:bg-white/[0.03]"
            } ${loading ? "pointer-events-none opacity-70" : ""}`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <FileText className="text-cyan-100" size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {resumeMeta?.fileName || "Drop your resume here"}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {previewText
                      ? "Drag a new file here any time to replace the current resume."
                      : "Supports plain text, markdown, and JSON resumes for quick parsing."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={open}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                <Upload size={16} />
                {previewText ? "Replace file" : "Browse files"}
              </button>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/80 p-5">
              {previewText ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                        Parsed Resume Text
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Quick excerpt from the uploaded document so you can confirm the parser picked up the right content.
                      </p>
                    </div>

                    <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100">
                      Live extract
                    </div>
                  </div>

                  <div className="max-h-[270px] overflow-auto rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                      {previewText.slice(0, 1800)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[270px] flex-col items-center justify-center px-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10">
                    <Upload className="text-cyan-100" size={26} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">
                    Drag and drop to start the review
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                    Once your file is uploaded, we’ll extract the text, map it to your target role, and surface the highest-impact ATS improvements first.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {[".txt", ".md", ".json"].map((format) => (
                      <span
                        key={format}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                Resume Profile
              </p>

              <div className="mt-4 space-y-3">
                {profileRows.map((row) => {
                  const Icon = row.icon;

                  return (
                    <div
                      key={row.label}
                      className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-black/20 p-3"
                    >
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                        <Icon size={16} className="text-slate-200" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                          {row.label}
                        </p>
                        <p className="mt-2 break-words text-sm text-white">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <HardDrive className="text-amber-100" size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                    File Details
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Keep an eye on the parsed source you are optimizing.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between rounded-[20px] border border-white/8 bg-black/20 px-4 py-3"
                  >
                    <span className="text-sm text-slate-400">{fact.label}</span>
                    <span className="text-sm font-medium text-white">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-[28px] border p-4 text-sm leading-6 ${statusTone}`}>
              {error || statusMessage}
            </div>

            <button
              type="button"
              onClick={onPreview}
              className="flex w-full items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              <Eye size={16} />
              {previewText ? "Open full document preview" : "Preview unlocks after upload"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumePreviewCard;
