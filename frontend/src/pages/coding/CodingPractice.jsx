import DashboardLayout from "../../layouts/DashboardLayout";
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

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setIsLoading(true);

        const response = await studentService.getCodingQuestionById(id);
        const loadedQuestion = response?.data ?? response;
        setQuestion(loadedQuestion);
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
      <DashboardLayout>
        <div className="text-white">Loading problem...</div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="h-full text-white">
        {/* Navbar */}
        <div className="mb-6">
          <CodingNavbar question={question} />
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Problem */}
          <div className="xl:col-span-4">
            <ProblemDescription question={question} />
          </div>

          {/* Editor */}
          <div className="xl:col-span-8">
            <CodeEditorPanel question={question} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
          {/* Test Cases */}
          <div className="xl:col-span-7">
            <TestCasePanel question={question} />
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
