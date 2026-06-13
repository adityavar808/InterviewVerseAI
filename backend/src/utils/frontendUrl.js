const getFrontendUrl = () =>
  (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  ).replace(/\/+$/, "");

export default getFrontendUrl;
