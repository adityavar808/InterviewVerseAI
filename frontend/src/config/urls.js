const normalizeUrl = (value) =>
  `${value || ""}`.replace(/\/+$/, "");

const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  : "https://interviewverseai.onrender.com/api";

export const API_BASE_URL = normalizeUrl(
  DEFAULT_API_BASE_URL,
);

export const BACKEND_ORIGIN = normalizeUrl(
  API_BASE_URL.replace(
    /\/api(?:\/admin)?\/?$/,
    "",
  ),
);

export const ADMIN_API_BASE_URL = normalizeUrl(
  import.meta.env.VITE_ADMIN_API_URL ||
    `${BACKEND_ORIGIN}/api/admin`,
);
