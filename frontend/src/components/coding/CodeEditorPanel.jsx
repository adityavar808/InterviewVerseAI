// src/components/coding/CodeEditorPanel.jsx

import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";

import {
  Code2,
  Sparkles,
  Copy,
  RotateCcw,
  Maximize2,
} from "lucide-react";

const defaultCode = `function twoSum(nums, target) {
    
    const map = new Map();

    for(let i = 0; i < nums.length; i++) {

        const complement = target - nums[i];

        if(map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }
};`;

const CodeEditorPanel = ({question}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="
        relative
        overflow-hidden
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        h-full
        flex
        flex-col
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between p-5 border-b border-white/10">
        
        <div className="flex items-center gap-4">
          
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Code2 className="text-cyan-400" size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Code Editor
            </h2>

            <p className="text-sm text-gray-400">
              Write optimized solution here
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          
          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              hover:border-cyan-500/30
              hover:bg-cyan-500/10
              transition-all
              duration-300
              flex
              items-center
              justify-center
            "
          >
            <Copy className="text-gray-300" size={18} />
          </button>

          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              hover:border-cyan-500/30
              hover:bg-cyan-500/10
              transition-all
              duration-300
              flex
              items-center
              justify-center
            "
          >
            <RotateCcw className="text-gray-300" size={18} />
          </button>

          <button
            className="
              w-11
              h-11
              rounded-2xl
              bg-white/5
              border
              border-white/10
              hover:border-cyan-500/30
              hover:bg-cyan-500/10
              transition-all
              duration-300
              flex
              items-center
              justify-center
            "
          >
            <Maximize2 className="text-gray-300" size={18} />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="relative flex-1 min-h-[600px]">
        
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={question.starterCode}
          theme="vs-dark"
          options={{
            fontSize: 15,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            padding: {
              top: 20,
            },
            wordWrap: "on",
            automaticLayout: true,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            roundedSelection: true,
            lineNumbersMinChars: 3,
          }}
        />
      </div>

      {/* Bottom AI Info */}
      <div className="relative p-5 border-t border-white/10">
        
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4">
          
          <div className="flex items-start gap-3">
            
            <Sparkles
              className="text-cyan-400 mt-1"
              size={18}
            />

            <p className="text-sm text-gray-300 leading-relaxed">
              AI will analyze your coding style,
              optimization logic, complexity analysis,
              and interview performance after submission.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditorPanel;