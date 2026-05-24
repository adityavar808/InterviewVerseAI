// src/pages/coding/CodingPractice.jsx

import DashboardLayout from "../../layouts/DashboardLayout";

import CodingNavbar from "../../components/coding/CodingNavbar";
import ProblemDescription from "../../components/coding/ProblemDescription";
import CodeEditorPanel from "../../components/coding/CodeEditorPanel";
import TestCasePanel from "../../components/coding/TestCasePanel";
import AIReviewSidebar from "../../components/coding/AIReviewSidebar";

const CodingPractice = () => {
  return (
    <DashboardLayout>
      <div className="h-full text-white">
        
        {/* Navbar */}
        <div className="mb-6">
          <CodingNavbar />
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Problem */}
          <div className="xl:col-span-4">
            <ProblemDescription />
          </div>

          {/* Editor */}
          <div className="xl:col-span-8">
            <CodeEditorPanel />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
          
          {/* Test Cases */}
          <div className="xl:col-span-7">
            <TestCasePanel />
          </div>

          {/* AI Review */}
          <div className="xl:col-span-5">
            <AIReviewSidebar />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodingPractice;