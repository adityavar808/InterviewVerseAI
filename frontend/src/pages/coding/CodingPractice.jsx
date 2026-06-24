import CodingNavbar from "../../components/coding/CodingNavbar";
import ProblemDescription from "../../components/coding/ProblemDescription";
import CodeEditorPanel from "../../components/coding/CodeEditorPanel";
import TestCasePanel from "../../components/coding/TestCasePanel";
import AIReviewSidebar from "../../components/coding/AIReviewSidebar";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import studentService from "../../services/studentApi";

const CodingPractice = () => {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "ai-review"
  const [testCases, setTestCases] = useState([]);
  const [aiReview, setAiReview] = useState(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setIsLoading(true);

        const response = await studentService.getCodingQuestionById(id);
        const loadedQuestion = response?.data ?? response;
        setQuestion(loadedQuestion);

        // Parse initial test case
        const t = loadedQuestion?.title?.toLowerCase() || "";
        if (t.includes("trap") || t.includes("rain") || t.includes("water")) {
          setTestCases([
            {
              input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
              expectedOutput: "6",
              actualOutput: "",
              status: "",
            },
          ]);
        } else {
          setTestCases([
            {
              input: "nums = [2,7,11,15], target = 9",
              expectedOutput: "[0,1]",
              actualOutput: "",
              status: "",
            },
          ]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-semibold tracking-wider">
            Loading problem compiler...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoading && !question) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center text-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute pointer-events-none" style={{ width: "600px", height: "600px", top: "-150px", left: "-100px", background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }} />
        
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-bold text-white leading-tight">Problem Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This coding problem does not exist, has been unpublished by the administrator, or is temporarily unavailable.
          </p>
          <a
            href="/coding"
            className="mt-4 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-all duration-200 active:scale-[0.98] shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            Back to Practice
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#020617] text-white relative overflow-hidden flex flex-col p-3 font-sans">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute pointer-events-none" style={{ width: "600px", height: "600px", top: "-150px", left: "-100px", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ width: "500px", height: "500px", bottom: "-100px", right: "-100px", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", zIndex: 0 }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* Navbar */}
        <CodingNavbar question={question} />

        {/* LeetCode/Codeforces Inspired Side-by-Side Workspace Layout */}
        <div className="flex-1 flex flex-col xl:flex-row gap-3 min-h-0 overflow-hidden mt-3">
          {/* Left Column: Problem details & AI analysis (Tabbed) */}
          <div className="xl:w-[35%] h-full flex flex-col min-h-0">
            {/* Tab switch header */}
            <div className="flex items-center gap-2 mb-3 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl flex-shrink-0">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === "description"
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Problem Description
              </button>
              <button
                onClick={() => setActiveTab("ai-review")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === "ai-review"
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                AI Review
              </button>
            </div>

            {/* Left Column scroll content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {activeTab === "description" ? (
                <ProblemDescription question={question} />
              ) : (
                <AIReviewSidebar aiReview={aiReview} />
              )}
            </div>
          </div>

          {/* Right Column: Code input & testing execution */}
          <div className="xl:w-[65%] h-full flex flex-col gap-3 min-h-0">
            {/* Editor (flex-1) */}
            <div className="flex-1 min-h-0">
              <CodeEditorPanel
                question={question}
                setTestCases={setTestCases}
                setAiReview={setAiReview}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Test Cases (fixed-height wrapper) */}
            <div className="h-[280px] flex-shrink-0 min-h-0">
              <TestCasePanel question={question} testCases={testCases} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
