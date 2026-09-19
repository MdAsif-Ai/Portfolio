// ─── Skills Data ─────────────────────────────────────────────────────────────
// Sources: 13 Udemy courses + 19 GitHub repos + personal skills list

export interface Skill {
  name: string;
  level: number; // 0-100
  category: "AI/ML" | "LLM & Agents" | "Data Science" | "Frontend" | "Backend" | "Databases" | "Mobile" | "DevOps & Tools";
}

export const skills: Skill[] = [
  // ── AI / ML Core ─────────────────────────────────────────────────────────────
  { name: "Python",               level: 96, category: "AI/ML" },
  { name: "PyTorch",              level: 88, category: "AI/ML" },
  { name: "TensorFlow",           level: 84, category: "AI/ML" },
  { name: "Keras",                level: 84, category: "AI/ML" },
  { name: "Scikit-Learn",         level: 86, category: "AI/ML" },
  { name: "NumPy",                level: 88, category: "AI/ML" },
  { name: "Pandas",               level: 88, category: "AI/ML" },
  { name: "OpenCV",               level: 80, category: "AI/ML" },
  { name: "XGBoost",              level: 82, category: "AI/ML" },

  // ── LLM & Agents ─────────────────────────────────────────────────────────────
  { name: "LangChain",            level: 90, category: "LLM & Agents" },
  { name: "LangGraph",            level: 88, category: "LLM & Agents" },
  { name: "RAG",                  level: 92, category: "LLM & Agents" },
  { name: "HuggingFace",          level: 87, category: "LLM & Agents" },
  { name: "Transformers",         level: 86, category: "LLM & Agents" },
  { name: "LoRA",                 level: 84, category: "LLM & Agents" },
  { name: "QLoRA",                level: 82, category: "LLM & Agents" },
  { name: "PEFT",                 level: 83, category: "LLM & Agents" },
  { name: "OpenAI API",           level: 90, category: "LLM & Agents" },
  { name: "CrewAI",               level: 85, category: "LLM & Agents" },
  { name: "AutoGen",              level: 82, category: "LLM & Agents" },
  { name: "WandB",                level: 80, category: "LLM & Agents" },
  { name: "Modal",                level: 78, category: "LLM & Agents" },
  { name: "Ollama",               level: 80, category: "LLM & Agents" },
  { name: "n8n",                  level: 78, category: "LLM & Agents" },

  // ── Data Science ──────────────────────────────────────────────────────────────
  { name: "Matplotlib",           level: 84, category: "Data Science" },
  { name: "Seaborn",              level: 82, category: "Data Science" },
  { name: "Plotly",               level: 80, category: "Data Science" },
  { name: "Jupyter",              level: 90, category: "Data Science" },

  // ── Frontend ──────────────────────────────────────────────────────────────────
  { name: "JavaScript",           level: 88, category: "Frontend" },
  { name: "TypeScript",           level: 82, category: "Frontend" },
  { name: "React",                level: 85, category: "Frontend" },
  { name: "Next.js",              level: 82, category: "Frontend" },
  { name: "Redux",                level: 80, category: "Frontend" },
  { name: "Tailwind CSS",         level: 80, category: "Frontend" },
  { name: "Vite",                 level: 80, category: "Frontend" },
  { name: "HTML5 / CSS3",         level: 82, category: "Frontend" },

  // ── Backend ───────────────────────────────────────────────────────────────────
  { name: "FastAPI",              level: 90, category: "Backend" },
  { name: "Node.js",              level: 85, category: "Backend" },
  { name: "Express.js",           level: 84, category: "Backend" },
  { name: "Django",               level: 80, category: "Backend" },
  { name: "REST APIs",            level: 88, category: "Backend" },
  { name: "JWT / OAuth2",         level: 84, category: "Backend" },
  { name: "WebSockets",           level: 80, category: "Backend" },
  { name: "Pydantic",             level: 85, category: "Backend" },
  { name: "SQLAlchemy",           level: 80, category: "Backend" },

  // ── Databases ─────────────────────────────────────────────────────────────────
  { name: "PostgreSQL",           level: 84, category: "Databases" },
  { name: "MySQL",                level: 82, category: "Databases" },
  { name: "MongoDB",              level: 80, category: "Databases" },
  { name: "Firebase",             level: 80, category: "Databases" },
  { name: "Supabase",             level: 78, category: "Databases" },
  { name: "Redis",                level: 80, category: "Databases" },
  { name: "Pinecone",             level: 82, category: "Databases" },
  { name: "ChromaDB",             level: 80, category: "Databases" },

  // ── Mobile ────────────────────────────────────────────────────────────────────
  { name: "Flutter",              level: 78, category: "Mobile" },
  { name: "Dart",                 level: 76, category: "Mobile" },

  // ── DevOps & Tools ───────────────────────────────────────────────────────────
  { name: "Git",                  level: 90, category: "DevOps & Tools" },
  { name: "GitHub",               level: 90, category: "DevOps & Tools" },
  { name: "Linux",                level: 80, category: "DevOps & Tools" },
  { name: "Docker",               level: 80, category: "DevOps & Tools" },
  { name: "Kubernetes",           level: 78, category: "DevOps & Tools" },
  { name: "AWS",                  level: 80, category: "DevOps & Tools" },
  { name: "Notion",               level: 78, category: "DevOps & Tools" },
  { name: "Make.com",             level: 75, category: "DevOps & Tools" },
  { name: "C",                    level: 72, category: "DevOps & Tools" },
];
