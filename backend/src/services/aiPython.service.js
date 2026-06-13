const getAiServiceUrl = () => {
  return process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
};

const callAiService = async (path, payload) => {
  if (typeof fetch !== "function") {
    throw new Error(
      "Global fetch is unavailable. Run Node 18+ or install a compatible fetch polyfill."
    );
  }

  try {
    const response = await fetch(`${getAiServiceUrl()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.detail || data?.message || JSON.stringify(data);
      throw new Error(`AI service error: ${message}`);
    }

    return data;
  } catch (error) {
    throw new Error(`AI service request failed: ${error.message}`);
  }
};

export const generateInterviewQuestions = async (config) => {
  const response = await callAiService("/api/generate-questions", config);

  if (!response?.success || !Array.isArray(response.questions)) {
    throw new Error("Invalid response from AI question generation service.");
  }

  return response.questions;
};

export const evaluateAnswer = async (payload) => {
  const response = await callAiService("/api/evaluate-answer", payload);

  if (!response?.success || !response.evaluation) {
    throw new Error("Invalid response from AI evaluation service.");
  }

  return response.evaluation;
};
