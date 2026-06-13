const DEFAULT_FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://interview-verse-ai-ruby.vercel.app"
    : "http://localhost:5173";

const getFrontendUrl = () =>
  (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    DEFAULT_FRONTEND_URL
  ).replace(/\/+$/, "");

export default getFrontendUrl;
