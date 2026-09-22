import LanguageSelector, { SUPPORTED_LANGUAGES } from "./LanguageSelector";

const detectLanguage = (code) => {
  if (!code) return "javascript";
  const clean = code.trim().toLowerCase();
  if (clean.includes("select ") || clean.includes("from ") || clean.includes("where ") || clean.includes("join ")) {
    return "sql";
  }
  if (clean.includes("def ") && clean.includes(":")) {
    return "python";
  }
  if (clean.includes("#include <stdio.h>") || (clean.includes("int main") && !clean.includes("using namespace"))) {
    return "c";
  }
  if (clean.includes("vector<") || clean.includes("std::") || clean.includes("#include <iostream>") || clean.includes("using namespace std")) {
    return "cpp";
  }
  if (clean.includes("public class") || clean.includes("system.out") || (clean.includes("class solution") && clean.includes("public int"))) {
    return "java";
  }
  if (clean.includes("package main") || clean.includes("func ")) {
    return "go";
  }
  if (clean.includes("fn ") || clean.includes("pub fn") || clean.includes("vec!")) {
    return "rust";
  }
  if (clean.includes(": number") || clean.includes(": string") || clean.includes(": boolean") || clean.includes("interface ")) {
    return "typescript";
  }
  return "javascript";
};

const extractMethodNameAndParams = (code, questionTitle) => {
  if (!code) {
    const fallbackName = questionTitle?.replace(/[^a-zA-Z0-9]/g, "") || "solution";
    const methodName = fallbackName.charAt(0).toLowerCase() + fallbackName.slice(1);
    return { methodName, params: "nums, target" };
  }
  
  const cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*/g, "")
    .replace(/#.*/g, "");
    
  const firstParenIdx = cleanCode.indexOf("(");
  if (firstParenIdx === -1) {
    const fallbackName = questionTitle?.replace(/[^a-zA-Z0-9]/g, "") || "solution";
    const methodName = fallbackName.charAt(0).toLowerCase() + fallbackName.slice(1);
    return { methodName, params: "nums, target" };
  }
  
  const beforeParen = cleanCode.substring(0, firstParenIdx).trim();
  const words = beforeParen.split(/\s+/);
  let methodName = words[words.length - 1];
  
  if (!methodName || ["def", "function", "fn", "func", "select", "void", "int"].includes(methodName.toLowerCase())) {
    const fallbackName = questionTitle?.replace(/[^a-zA-Z0-9]/g, "") || "solution";
    methodName = fallbackName.charAt(0).toLowerCase() + fallbackName.slice(1);
  }
  
  methodName = methodName.replace(/[*&]/g, "");
  
  const afterParen = cleanCode.substring(firstParenIdx);
  const match = afterParen.match(/\(([^)]*)\)/);
  let params = "nums, target";
  if (match) {
    const paramsStr = match[1].trim();
    if (paramsStr) {
      const parsedParams = paramsStr.split(",").map(p => {
        const cleanParam = p.trim().split(":")[0].trim();
        const parts = cleanParam.split(/\s+/);
        let paramName = parts[parts.length - 1];
        paramName = paramName.replace(/[*&]/g, "");
        return paramName.replace(/[\[\]]/g, "");
      });
      params = parsedParams.filter(p => p && p !== "self").join(", ");
    } else {
      params = "";
    }
  }
  
  return { methodName, params };
};

const getBoilerplate = (lang, question) => {
  const detectedLang = detectLanguage(question?.starterCode);
  
  if (lang === detectedLang && question?.starterCode) {
    return question.starterCode;
  }
  
  const { methodName, params } = extractMethodNameAndParams(question?.starterCode, question?.title || question?.text);
  
  switch (lang) {
    case "javascript":
      return `function ${methodName}(${params}) {\n    // Write your JavaScript code here\n}`;
    case "typescript":
      return `function ${methodName}(${params}: any): any {\n    // Write your TypeScript code here\n}`;
    case "python":
      return `class Solution:\n    def ${methodName}(self, ${params}):\n        # Write your Python code here\n        pass`;
    case "cpp":
      return `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> ${methodName}(${params}) {\n        // Write your C++ code here\n        return {};\n    }\n};`;
    case "c":
      return `#include <stdio.h>\n#include <stdlib.h>\n\n// Write your C code here\nvoid ${methodName}() {\n    \n}`;
    case "java":
      return `class Solution {\n    public int[] ${methodName}(${params}) {\n        // Write your Java code here\n        return new int[]{};\n    }\n}`;
    case "sql":
      return `-- Write your SQL query here\nSELECT * FROM employees\nWHERE department = 'Engineering';`;
    case "go":
      return `package main\n\nimport "fmt"\n\nfunc ${methodName}(${params}) {\n    // Write your Go code here\n}`;
    case "rust":
      return `impl Solution {\n    pub fn ${methodName}(${params}) -> Vec<i32> {\n        // Write your Rust code here\n        vec![]\n    }\n}`;
    default:
      return `function ${methodName}(${params}) {\n    // Write your code here\n}`;
  }
};

const CodeEditorPanel = ({ question, setTestCases, setAiReview, setActiveTab }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeCache, setCodeCache] = useState({});
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("info"); // "info" | "success" | "error"

  const handleBeforeMount = (monaco) => {
    // Disable semantic validation warnings (e.g. redeclarations or missing imports)
    // while keeping helpful syntax checks in place.
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
  };

  useEffect(() => {
    const starter = question?.starterCode || defaultCode;
    const initialLang = detectLanguage(question?.starterCode);
    
    setSelectedLanguage(initialLang);
    setCode(starter);
    setCodeCache({
      [initialLang]: starter
    });
  }, [question]);

  const handleLanguageChange = (newLang) => {
    // 1. Cache the current code for the previous language
    setCodeCache(prev => ({
      ...prev,
      [selectedLanguage]: code
    }));
    
    // 2. Set the new language
    setSelectedLanguage(newLang);
    
    // 3. Retrieve new code from cache, or load/generate the boilerplate
    const nextCode = codeCache[newLang] || getBoilerplate(newLang, question);
    setCode(nextCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setFeedbackType("success");
      setFeedback("Starter code copied to clipboard!");
      setTimeout(() => setFeedback(""), 3000);
    } catch {
      setFeedbackType("error");
      setFeedback("Failed to copy code.");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  const handleReset = () => {
    const starter = getBoilerplate(selectedLanguage, question);
    setCode(starter);
    setFeedbackType("info");
    setFeedback(`Editor reset to starter ${selectedLanguage} code.`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleRun = async () => {
    if (running || submitting) return;
    setRunning(true);
    setFeedbackType("info");
    setFeedback("Compiling and running sample test cases...");

    try {
      const qId = question?._id || question?.id;
      if (!qId) {
        throw new Error("Unable to identify question ID");
      }

      const result = await studentService.runCode(qId, {
        code,
        language: selectedLanguage,
      });

      if (result.error) {
        setFeedbackType("error");
        setFeedback(`Compilation Error: ${result.error}`);
      } else if (result.success) {
        setFeedbackType("success");
        setFeedback("All sample test cases passed successfully!");
      } else {
        setFeedbackType("error");
        setFeedback("Some test cases failed. Review test execution details.");
      }

      if (result.testCases) {
        setTestCases(result.testCases);
      }
    } catch (err) {
      setFeedbackType("error");
      setFeedback(err.message || "Failed to run code. Try again.");
    } finally {
      setRunning(false);
      setTimeout(() => setFeedback(""), 5000);
    }
  };

  const handleSubmit = async () => {
    if (running || submitting) return;
    setSubmitting(true);
    setFeedbackType("info");
    setFeedback("Submitting solution to judge server...");

    try {
      const qId = question?._id || question?.id;
      if (!qId) {
        throw new Error("Unable to identify question ID");
      }

      const response = await studentService.submitCode(qId, {
        code,
        language: selectedLanguage,
      });

      setFeedbackType("success");
      setFeedback("Solution submitted successfully! Progress saved.");
      
      if (response?.evaluation) {
        setAiReview(response.evaluation);
        setActiveTab("ai-review");
      }
    } catch (err) {
      setFeedbackType("error");
      setFeedback(err.message || "Failed to submit code. Try again.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(""), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl h-full flex flex-col"
    >
      {/* Background glow and top gradient line */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-purple-500/[0.04] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.45), rgba(139,92,246,0.25), transparent)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Code2 className="text-cyan-400" size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white leading-none">
              Code Editor
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Write optimized solution here
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selection */}
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onChange={handleLanguageChange}
          />

          <button
            onClick={handleCopy}
            title="Copy Starter Code"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <Copy className="text-slate-300 hover:text-white" size={15} />
          </button>

          <button
            onClick={handleReset}
            title="Reset Editor Code"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="text-slate-300 hover:text-white" size={15} />
          </button>

          <button
            title="Maximize Code Workspace"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <Maximize2 className="text-slate-300 hover:text-white" size={15} />
          </button>
        </div>
      </div>

      {/* Monaco Editor Wrapper (Flexible, Height Resizable) */}
      <div className="relative z-10 flex-1 min-h-0 bg-slate-950/20">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          beforeMount={handleBeforeMount}
          options={{
            fontSize: 14,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            padding: {
              top: 15,
              bottom: 15,
            },
            wordWrap: "on",
            automaticLayout: true,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            roundedSelection: true,
            lineNumbersMinChars: 3,
            backgroundColor: "transparent",
          }}
        />
      </div>

      {/* Dynamic Feedback Panel */}
      {feedback && (
        <div className={`px-4 py-2 flex items-center gap-2 border-t text-[11px] font-medium transition-all ${
          feedbackType === "success" 
            ? "bg-green-500/10 border-green-500/20 text-green-400" 
            : feedbackType === "error" 
            ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
            : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
        }`}>
          {feedbackType === "success" ? (
            <CheckCircle size={13} className="animate-bounce" />
          ) : feedbackType === "error" ? (
            <XCircle size={13} className="animate-pulse" />
          ) : (
            <Sparkles size={13} className="animate-spin" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      {/* Sleek Status Bar */}
      <div className="relative z-10 px-3 py-2 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0 font-sans font-medium">
        <div className="flex items-center gap-2 max-w-[65%]">
          <Sparkles className="text-cyan-400 animate-pulse flex-shrink-0" size={12} />
          <span className="truncate">AI will analyze complexity, style & optimization after submission</span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.08] active:scale-[0.98] transition-all text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
          >
            <Play size={11} className="text-cyan-400" />
            {running ? "Running..." : "Run"}
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={running || submitting}
            className="flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)] active:scale-[0.98] transition-all text-xs cursor-pointer disabled:opacity-50"
          >
            <Send size={11} />
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditorPanel;