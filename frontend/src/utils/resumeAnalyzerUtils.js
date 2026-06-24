import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Set PDF.js worker path using CDN matching the installed package version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const ROLE_KEYWORDS = {
  "MERN Developer": [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "JavaScript",
    "REST",
    "APIs",
    "HTML",
    "CSS",
    "Redux",
  ],
  "Frontend Developer": [
    "React",
    "Vue",
    "Angular",
    "JavaScript",
    "TypeScript",
    "CSS",
    "HTML",
    "Responsive",
    "Accessibility",
    "UI/UX",
  ],
  "Backend Developer": [
    "Node.js",
    "Express",
    "Java",
    "Python",
    "SQL",
    "APIs",
    "Microservices",
    "Docker",
    "Kubernetes",
    "Authentication",
  ],
  "Full Stack Developer": [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "REST",
    "JavaScript",
    "CSS",
    "HTML",
    "CI/CD",
    "Cloud",
  ],
  "Machine Learning Engineer": [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Data",
    "ML",
    "Model",
    "NLP",
    "Scikit-learn",
    "Statistics",
    "Algorithms",
  ],
  "Data Analyst": [
    "SQL",
    "Python",
    "Pandas",
    "Tableau",
    "Power BI",
    "Visualization",
    "Excel",
    "Data Cleaning",
    "Analytics",
    "Reporting",
  ],
  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "CI/CD",
    "AWS",
    "Azure",
    "Terraform",
    "Monitoring",
    "Automation",
    "Linux",
    "SRE",
  ],
};

const KNOWN_TECH_KEYWORDS = [
  "React",
  "Redux",
  "Vue",
  "Angular",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "CI/CD",
  "Python",
  "TensorFlow",
  "PyTorch",
  "Machine Learning",
  "Data Analysis",
  "NLP",
  "REST",
  "GraphQL",
  "API",
  "Microservices",
  "Git",
  "SaaS",
  "Cloud",
];

const normalizeText = (text) =>
  (text || "").replace(/\s+/g, " ").trim();

const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
};

const extractTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || "";
};

const extractTextFromFile = async (file) => {
  if (!file) {
    return "";
  }

  const name = file.name.toLowerCase();

  // PDF format
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    try {
      return await extractTextFromPDF(file);
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      throw new Error("Unable to parse PDF. Make sure the document is not password-protected.");
    }
  }

  // Word docx format
  if (
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      return await extractTextFromDocx(file);
    } catch (err) {
      console.error("DOCX Parsing Error:", err);
      throw new Error("Unable to parse DOCX. Make sure the document is not corrupted.");
    }
  }

  // Text, markdown, json formats
  const textTypes = ["text/plain", "application/json", "text/markdown"];
  if (
    textTypes.includes(file.type) ||
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".json")
  ) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || "");
      reader.onerror = reject;
      reader.readAsText(file, "UTF-8");
    });
  }

  return "";
};

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
  return match ? match[0] : "Not found";
};

const extractName = (text) => {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) {
    return "Your Name";
  }

  const firstLine = lines[0];
  if (firstLine.split(" ").length >= 2 && firstLine.length <= 40) {
    return firstLine;
  }

  const nameLine = lines.find((line) => /[A-Z][a-z]+\s+[A-Z][a-z]+/.test(line));
  return nameLine || "Your Name";
};

const extractSkills = (text) => {
  const lower = text.toLowerCase();
  const skills = new Set();

  KNOWN_TECH_KEYWORDS.forEach((keyword) => {
    const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (pattern.test(lower)) {
      skills.add(keyword);
    }
  });

  return Array.from(skills);
};

const extractProjectCount = (text) => {
  const matches = text.match(/project[s]?/gi) || [];
  return Math.min(matches.length, 8);
};

const extractSectionCount = (text) => {
  const lines = text.split(/\r?\n/);
  const sectionHeaders = ["experience", "projects", "education", "skills", "certifications", "summary", "achievements"];
  return sectionHeaders.reduce((count, header) => {
    return count + (lines.some((line) => line.toLowerCase().includes(header)) ? 1 : 0);
  }, 0);
};

const getRoleKeywords = (role) => ROLE_KEYWORDS[role] || [];

const getKeywordMatches = (resumeText, role) => {
  const normalized = resumeText.toLowerCase();
  const roleKeywords = getRoleKeywords(role);
  const found = roleKeywords.filter((keyword) => {
    const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return pattern.test(normalized);
  });
  return {
    matched: found,
    missing: roleKeywords.filter((keyword) => !found.includes(keyword)),
    total: roleKeywords.length,
  };
};

const buildRadarData = ({ skillsCount, projectCount, keywordMatchPercent, atsScore }) => {
  const technical = Math.min(100, skillsCount * 7 + projectCount * 4 + 20);
  const projects = Math.min(100, projectCount * 12 + keywordMatchPercent * 0.3 + 10);
  const ats = Math.round(atsScore);
  const communication = Math.min(100, 50 + keywordMatchPercent * 0.2);
  const experience = Math.min(100, Math.max(20, projectCount * 10 + skillsCount * 3));
  const skills = Math.min(100, skillsCount * 9 + 20);

  return [
    { subject: "Technical", score: technical },
    { subject: "Projects", score: projects },
    { subject: "ATS", score: ats },
    { subject: "Communication", score: communication },
    { subject: "Skills", score: skills },
    { subject: "Experience", score: experience },
  ];
};

const getBestWeakAreas = (radarData) => {
  const sorted = [...radarData].sort((a, b) => b.score - a.score);
  return {
    bestArea: sorted[0]?.subject || "Skills",
    weakArea: sorted[sorted.length - 1]?.subject || "Experience",
  };
};

const getRankingText = (score) => {
  if (score >= 90) return "Top 5%";
  if (score >= 80) return "Top 12%";
  if (score >= 70) return "Top 25%";
  return "Top 40%";
};

const getReadinessLabel = (score) => {
  if (score >= 90) return "Recruiter Ready";
  if (score >= 80) return "High Potential";
  if (score >= 70) return "Strong Foundation";
  if (score >= 60) return "Needs Refinement";
  return "Needs Rework";
};

const buildRoadmap = ({ missingKeywords, projectCount, skillsCount }) => {
  const recommendations = [];

  if (missingKeywords.length) {
    recommendations.push({
      title: "Add Role-Specific Keywords",
      description: `Include ${missingKeywords.slice(0, 4).join(", ")} in your resume's summary, skills, and project sections.`,
      status: "High Impact",
    });
  }

  if (projectCount < 3) {
    recommendations.push({
      title: "Expand Project Details",
      description: "Add measurable results, technologies used, and impact metrics for each project.",
      status: "Recommended",
    });
  }

  if (skillsCount < 6) {
    recommendations.push({
      title: "Strengthen Skills Section",
      description: "Include more technical skills and tools relevant to the chosen role.",
      status: "Important",
    });
  }

  if (missingKeywords.includes("Docker") || missingKeywords.includes("Kubernetes") || missingKeywords.includes("CI/CD")) {
    recommendations.push({
      title: "Add Deployment Experience",
      description: "Mention cloud platforms, containerization, and CI/CD workflows to boost ATS relevance.",
      status: "Boost ATS",
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Refine Resume Copy",
      description: "Polish sentence structure and quantify achievements to improve readability and scoring.",
      status: "Recommended",
    });
  }

  return recommendations.slice(0, 4);
};

const buildAnalysis = ({ resumeText, role, file }) => {
  const text = normalizeText(resumeText);
  const skills = extractSkills(text);
  const projectCount = extractProjectCount(text);
  const sectionCount = extractSectionCount(text);
  const { matched, missing, total } = getKeywordMatches(text, role);
  const keywordMatchPercent = total ? Math.round((matched.length / total) * 100) : 0;
  const atsScore = Math.min(
    98,
    Math.max(
      40,
      50 + keywordMatchPercent * 0.35 + skills.length * 3 + projectCount * 4 + sectionCount * 1.5 - missing.length * 2,
    ),
  );

  const radarData = buildRadarData({
    skillsCount: skills.length,
    projectCount,
    keywordMatchPercent,
    atsScore,
  });

  const { bestArea, weakArea } = getBestWeakAreas(radarData);

  return {
    stats: {
      atsScore: `${atsScore}/100`,
      skillsFound: skills.length,
      keywordMatch: `${keywordMatchPercent}%`,
      projects: projectCount,
    },
    radarData,
    matchedKeywords: matched,
    missingKeywords: missing,
    keywordCoverage: {
      matched: matched.length,
      total,
      percent: keywordMatchPercent,
    },
    roadmapSteps: buildRoadmap({ missingKeywords: missing, projectCount, skillsCount: skills.length }),
    activities: [
      {
        title: "Resume Uploaded",
        description: `Uploaded ${file?.name || "resume"} for analysis.`,
        time: "Just now",
        type: "upload",
      },
      {
        title: "ATS Analysis Completed",
        description: "AI-generated resume optimization insights.",
        time: "Just now",
        type: "analysis",
      },
      {
        title: "Skills Extracted",
        description: `${skills.length} technical skills identified.`,
        time: "Just now",
        type: "skills",
      },
      {
        title: "Optimization Score Updated",
        description: `ATS score is ${atsScore}/100.`,
        time: "Live",
        type: "score",
      },
    ],
    bestArea,
    weakArea,
    improvement: `${Math.max(5, missing.length * 3)}%`,
    ranking: getRankingText(atsScore),
    readinessLabel: getReadinessLabel(atsScore),
    scoreValue: atsScore,
    projectCount,
    skillsFound: skills,
    summary: {
      name: extractName(text),
      email: extractEmail(text),
      description: `Resume optimized for ${role} with ${skills.length} skills and ${projectCount} projects.`,
    },
  };
};

export {
  extractTextFromFile,
  buildAnalysis,
  getRoleKeywords,
  ROLE_KEYWORDS,
};
