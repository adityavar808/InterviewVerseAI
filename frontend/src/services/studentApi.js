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
    return unwrapPayload(response);
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

  addInterviewHistory: async (payload) => {
    const response = await api.post("/auth/interview-history", payload);
    return unwrapPayload(response);
  },

  // Start a new AI interview session
  startAIInterview: async (config) => {
    const response = await api.post("/auth/interview-session", config);
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Failed to start AI interview");
    }
    return unwrapPayload(response);
  },

  // Submit interview response
  submitInterviewResponse: async (sessionId, payload) => {
    const response = await api.post(`/auth/interview-session/${sessionId}/response`, payload);
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Failed to submit interview response");
    }
    return unwrapPayload(response);
  },

  // End interview session
  endInterviewSession: async (sessionId) => {
    const response = await api.post(`/auth/interview-session/${sessionId}/end`);
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Failed to complete the interview session");
    }
    return unwrapPayload(response);
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

  getInterviewSession: async (sessionId) => {
    const response = await api.get(`/auth/interview-session/${sessionId}`);
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Failed to load interview session");
    }
    return unwrapPayload(response);
  },
};

export default studentService;
