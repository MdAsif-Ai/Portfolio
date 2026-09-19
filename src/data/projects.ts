// ─── Projects Data ────────────────────────────────────────────────────────────
// Edit this file to update projects on both macOS and iOS shells.

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github?: string;
  live?: string;
  year: number;
  featured: boolean;
  color: string;
}

export const projects: Project[] = [
  {
    id: "llm-agent",
    title: "Autonomous LLM Agent Framework",
    description: "Production-grade multi-agent orchestration system with tool use, memory, and self-reflection.",
    longDescription: "A modular framework for building autonomous LLM agents that can use tools, maintain long-term memory via vector databases, self-reflect on outputs, and coordinate with sub-agents to solve complex tasks. Built on LangChain + OpenAI function calling with a custom orchestration layer.",
    tech: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI", "Redis"],
    github: "https://github.com/MdAsif-Ai/llm-agent-framework",
    year: 2024,
    featured: true,
    color: "#5856D6",
  },
  {
    id: "rag-pipeline",
    title: "Enterprise RAG Pipeline",
    description: "Retrieval-Augmented Generation system processing 10M+ documents with sub-100ms query latency.",
    longDescription: "End-to-end RAG system for enterprise document intelligence. Features hybrid search (dense + sparse), reranking, query decomposition, citation grounding, and a streaming response API. Processes 10M+ documents with P95 query latency under 100ms.",
    tech: ["Python", "Qdrant", "HuggingFace", "FastAPI", "Docker", "Kubernetes"],
    github: "https://github.com/MdAsif-Ai/enterprise-rag",
    year: 2024,
    featured: true,
    color: "#FF6B35",
  },
  {
    id: "vision-classifier",
    title: "Real-time Vision Classifier",
    description: "Computer vision pipeline classifying manufacturing defects at 60fps on edge hardware.",
    longDescription: "Real-time defect detection system deployed on NVIDIA Jetson edge devices. Uses a custom YOLO-based architecture fine-tuned on proprietary manufacturing data, optimized with TensorRT for 60fps throughput. Achieved 97.3% mAP on the test set.",
    tech: ["PyTorch", "YOLO", "TensorRT", "CUDA", "OpenCV", "Python"],
    github: "https://github.com/MdAsif-Ai/vision-classifier",
    year: 2023,
    featured: true,
    color: "#34C759",
  },
  {
    id: "sentiment-api",
    title: "Multilingual Sentiment API",
    description: "Fine-tuned multilingual BERT serving sentiment analysis for 12 Indian languages at scale.",
    longDescription: "A production sentiment analysis API supporting 12 Indian languages using a fine-tuned IndicBERT model. Handles code-mixed text (Hinglish, Tanglish, etc.), deployed on AWS with auto-scaling, serving 5M+ requests per day with 99.9% uptime.",
    tech: ["Python", "Transformers", "FastAPI", "AWS", "Docker", "PostgreSQL"],
    github: "https://github.com/MdAsif-Ai/sentiment-api",
    live: "https://sentiment-api.mdasif.dev",
    year: 2023,
    featured: false,
    color: "#FF9F0A",
  },
  {
    id: "macos-portfolio",
    title: "macOS/iOS Portfolio",
    description: "This very portfolio — a dual-platform OS simulation built with React and Framer Motion.",
    longDescription: "A full browser-based macOS + iOS simulation serving as a portfolio site. Features a complete macOS desktop experience (boot → login → draggable windows) on ≥1024px and a genuine iOS experience (lock screen → home → full-screen apps) on mobile. One shared data layer powers both platforms.",
    tech: ["React", "TypeScript", "Vite", "Zustand", "Framer Motion", "Vanilla CSS"],
    github: "https://github.com/MdAsif-Ai/macos-portfolio",
    live: "https://mdasif.dev",
    year: 2025,
    featured: true,
    color: "#007AFF",
  },
];
