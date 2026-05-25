const ADMIN_STORAGE_KEY =
  "adminSession";

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const getStoredAdminSession =
  () => {
    const rawValue =
      localStorage.getItem(
        ADMIN_STORAGE_KEY,
      );

    return rawValue
      ? parseJSON(rawValue)
      : null;
  };

export const saveStoredAdminSession = ({
  admin,
  accessToken,
}) => {
  localStorage.setItem(
    ADMIN_STORAGE_KEY,
    JSON.stringify({
      admin,
      accessToken,
    }),
  );

  localStorage.removeItem("admin");
};

export const clearStoredAdminSession =
  () => {
    localStorage.removeItem(
      ADMIN_STORAGE_KEY,
    );
    localStorage.removeItem("admin");
  };

export const getAdminAccessToken =
  () =>
    getStoredAdminSession()
      ?.accessToken || null;

export const getAdminProfile = () =>
  getStoredAdminSession()?.admin ||
  null;

export const formatCompactNumber = (
  value,
) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);

export const formatDateTime = (
  value,
) => {
  if (!value) {
    return "Never";
  }

  return new Date(value).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
};

export const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
};

export const formatRelativeTime = (
  value,
) => {
  if (!value) {
    return "Just now";
  }

  const seconds = Math.round(
    (new Date(value).getTime() -
      Date.now()) /
      1000,
  );

  const formatter =
    new Intl.RelativeTimeFormat(
      "en",
      {
        numeric: "auto",
      },
    );

  const ranges = [
    {
      unit: "year",
      seconds: 31536000,
    },
    {
      unit: "month",
      seconds: 2592000,
    },
    {
      unit: "week",
      seconds: 604800,
    },
    {
      unit: "day",
      seconds: 86400,
    },
    {
      unit: "hour",
      seconds: 3600,
    },
    {
      unit: "minute",
      seconds: 60,
    },
  ];

  for (const range of ranges) {
    if (
      Math.abs(seconds) >=
      range.seconds
    ) {
      return formatter.format(
        Math.round(
          seconds / range.seconds,
        ),
        range.unit,
      );
    }
  }

  return formatter.format(seconds, "second");
};

export const getInitials = (name) =>
  `${name || ""}`
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("") || "AD";

export const parseTagInput = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => `${item}`.trim())
      .filter(Boolean);
  }

  return `${value || ""}`
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const joinTagInput = (
  values = [],
) => values.join(", ");
