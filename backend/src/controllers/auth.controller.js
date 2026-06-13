export {
  refreshAccessToken,
  loginUser,
  logoutUser,
  getMe,
  googleAuthSuccess,
} from "./auth/login.controller.js";

export {
  registerUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "./auth/register.controller.js";

export {
  studentDashboard,
  getStudentInterviews,
  getInterviewHistory,
  addInterviewHistory,
  getStudentCodingQuestions,
} from "./auth/student.controller.js";

export {
  startAIInterview,
  submitInterviewResponse,
  getInterviewSession,
  endInterviewSession,
} from "./auth/interviewSession.controller.js";
