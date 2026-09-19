// ─── Experience Data ─────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  bullets: string[];
  tech: string[];
  color: string;
}

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "AI Startup (Stealth)",
    role: "Senior AI Engineer",
    period: "2024 – Present",
    location: "Bengaluru, India (Remote)",
    description: "Building the core AI infrastructure for a stealth-mode B2B SaaS product.",
    bullets: [
      "Designed and deployed a production RAG pipeline handling 50k+ daily queries",
      "Reduced LLM hallucination rate by 40% via retrieval-augmented verification",
      "Built agentic workflow system integrating 12+ external APIs and tools",
      "Led a 4-person AI team, set architecture standards and review processes",
    ],
    tech: ["Python", "LangChain", "OpenAI", "Qdrant", "FastAPI", "AWS"],
    color: "#5856D6",
  },
  {
    id: "exp-2",
    company: "Infosys Limited",
    role: "Machine Learning Engineer",
    period: "2022 – 2024",
    location: "Bengaluru, India",
    description: "ML engineering for enterprise digital transformation projects.",
    bullets: [
      "Delivered computer vision defect-detection system cutting false positives by 60%",
      "Fine-tuned multilingual NLP models for sentiment analysis on Indian-language social data",
      "Automated data labeling pipeline reducing annotation time by 70%",
      "Mentored junior engineers and conducted ML workshops for 100+ colleagues",
    ],
    tech: ["Python", "PyTorch", "AWS SageMaker", "MLflow", "Docker", "Spark"],
    color: "#007AFF",
  },
  {
    id: "exp-3",
    company: "Freelance",
    role: "AI/ML Consultant",
    period: "2021 – 2022",
    location: "Remote",
    description: "Independent consulting for AI projects across e-commerce, healthcare, and fintech.",
    bullets: [
      "Built recommendation engine increasing client revenue by 25%",
      "Developed NLP-powered document extraction for a legal-tech startup",
      "Deployed real-time fraud detection model with 99.1% precision",
    ],
    tech: ["Python", "scikit-learn", "FastAPI", "PostgreSQL", "GCP"],
    color: "#FF9F0A",
  },
];
