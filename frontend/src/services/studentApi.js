import api from "./api";

const unwrapPayload = (response) =>
  response.data?.data ?? response.data;

export const studentService = {
  // Fetch student dashboard data
  getDashboard: async () => {
    const response = await api.get("/auth/dashboard");
    return unwrapPayload(response);
  },

  // Fetch student profile
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return unwrapPayload(response);
  },

  // Update student profile
  updateProfile: async (payload) => {
    const response = await api.put("/auth/me", payload);
    return response.data;
  },

  // Get available interview templates (legacy - kept for backward compatibility)
  getInterviewTemplates: async (params = {}) => {
    const response = await api.get("/auth/interviews", { params });
    return unwrapPayload(response);
  },

  // Get AI interview history
  getInterviewHistory: async (params = {}) => {
    const response = await api.get("/auth/interview-history", { params });
    return unwrapPayload(response);
  },

  // Start a new AI interview session
  startAIInterview: async (config) => {
    const response = await api.post("/auth/interview-session", config);
    return response.data;
  },

  // Submit interview response
  submitInterviewResponse: async (sessionId, response) => {
    const result = await api.post(`/auth/interview-session/${sessionId}/response`, response);
    return result.data;
  },

  // End interview session
  endInterviewSession: async (sessionId) => {
    const response = await api.post(`/auth/interview-session/${sessionId}/end`);
    return response.data;
  },

  getCodingQuestionById: async (id) => {
    const response = await api.get(`/student/coding-questions/${id}`);
    return unwrapPayload(response);
  },

  // Get available coding questions
  getCodingQuestions: async (params = {}) => {
    const response = await api.get("/auth/coding-questions", { params });
    return unwrapPayload(response);
  },
};

export default studentService;
