import { X } from "lucide-react";

const ModalShell = ({
  open,
  title,
  description,
  onClose,
  children,
  widthClass = "max-w-3xl",
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 py-10 backdrop-blur-sm">
      <div
        className={`w-full ${widthClass} overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-[0_30px_120px_rgba(2,132,199,0.18)]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              {title}
            </h3>
            {description ? (
              <p className="mt-2 text-sm text-slate-400">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalShell;
