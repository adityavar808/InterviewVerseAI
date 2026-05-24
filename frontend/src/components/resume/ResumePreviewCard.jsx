// src/components/resume/ResumePreviewCard.jsx

import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Download,
  CalendarDays,
  HardDrive,
} from "lucide-react";

const ResumePreviewCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FileText className="text-cyan-400" size={32} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Aditya_Resume.pdf
            </h2>

            <p className="text-sm text-gray-400">
              MERN Developer Resume
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          Uploaded
        </div>
      </div>

      {/* Resume Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <CalendarDays className="text-purple-400" size={22} />
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Upload Date
            </p>

            <h3 className="text-white font-medium">
              21 May 2026
            </h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
            <HardDrive className="text-pink-400" size={22} />
          </div>

          <div>
            <p className="text-xs text-gray-400">
              File Size
            </p>

            <h3 className="text-white font-medium">
              2.4 MB
            </h3>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative bg-[#111827] border border-white/10 rounded-3xl h-[260px] overflow-hidden mb-6">
        
        {/* Fake Resume Preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          <div className="w-[75%] h-[85%] bg-white rounded-xl shadow-2xl p-4">
            
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>

              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>

              <div className="h-4 bg-gray-300 rounded w-1/3 mt-6"></div>

              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-4/6"></div>

              <div className="h-4 bg-gray-300 rounded w-1/4 mt-6"></div>

              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Overlay Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        <button className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 text-white py-3 rounded-2xl font-medium">
          <Eye size={18} />
          Preview Resume
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white py-3 rounded-2xl font-medium">
          <Download size={18} />
          Download
        </button>
      </div>
    </motion.div>
  );
};

export default ResumePreviewCard;