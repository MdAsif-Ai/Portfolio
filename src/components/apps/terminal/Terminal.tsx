import { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '../../../store/windowStore';
import './Terminal.css';

interface HistoryEntry {
  type: 'command' | 'output' | 'error';
  text: string;
}

const COMMANDS: Record<string, () => string> = {
  help: () => `Available commands:
  about      — Who am I
  skills     — Technical skills
  projects   — Recent projects
  experience — Work history
  contact    — Get in touch
  clear      — Clear terminal
  date       — Current date & time
  whoami     — Current user
  ls         — List files
  cat cv     — Print résumé summary`,

  about: () => `M H Mohammed Asif — AI/ML Engineer & Full Stack Developer
  ──────────────────────────────────────────────────────
  Location  : Bengaluru, India
  Focus     : LLMs, Agentic AI, RAG, Full Stack, MLOps
  Courses   : 13 Udemy courses (Jonas, Jose Portilla, Ed Donner, etc.)
  GitHub    : github.com/MdAsif-Ai  (19 repositories)
  Email     : md.asifmd46@gmail.com`,

  skills: () => `Technical Skills
  ══════════════════════════════════════════════

  🧠 AI / ML
  ● Python                   ████████████████████ 96%
  ● PyTorch                  █████████████████░░░ 88%
  ● TensorFlow / Keras       ████████████████░░░░ 84%
  ● Scikit-Learn             █████████████████░░░ 86%
  ● NumPy / Pandas           █████████████████░░░ 88%
  ● LangChain / LangGraph    ██████████████████░░ 90%
  ● RAG Systems              ██████████████████░░ 92%
  ● HuggingFace Transformers █████████████████░░░ 87%
  ● LoRA / QLoRA / PEFT      ████████████████░░░░ 84%
  ● WandB                    ████████████████░░░░ 80%
  ● Modal (Serverless GPU)   ███████████████░░░░░ 78%
  ● OpenAI / Claude / Gemini ██████████████████░░ 90%
  ● CrewAI / AutoGen         █████████████████░░░ 85%
  ● MCP Protocol             ████████████████░░░░ 82%
  ● n8n Automation           ███████████████░░░░░ 78%
  ● Computer Vision / YOLO   ████████████████░░░░ 80%
  ● NLP / Sentiment Analysis ████████████████░░░░ 82%
  ● ChromaDB / Pinecone      █████████████████░░░ 85%

  🌐 Frontend
  ● JavaScript (ES6+)        █████████████████░░░ 88%
  ● React.js                 █████████████████░░░ 85%
  ● Next.js                  ████████████████░░░░ 82%
  ● Redux / Zustand          ████████████████░░░░ 80%
  ● TypeScript               ████████████████░░░░ 82%
  ● HTML5 / CSS3 / SCSS      ████████████████░░░░ 82%
  ● Tailwind CSS             ████████████████░░░░ 80%
  ● Framer Motion            ███████████████░░░░░ 78%
  ● Vite                     ███████████████░░░░░ 80%

  🖥️ Backend
  ● FastAPI (Python)         ██████████████████░░ 90%
  ● Node.js / Express.js     █████████████████░░░ 85%
  ● Django / DRF             ████████████████░░░░ 80%
  ● REST API Design          █████████████████░░░ 88%
  ● JWT / OAuth2 Auth        █████████████████░░░ 85%
  ● WebSockets / Async       ████████████████░░░░ 82%
  ● Flutter / Dart           ███████████████░░░░░ 78%

  🗄️ Databases
  ● PostgreSQL               █████████████████░░░ 84%
  ● MySQL                    ████████████████░░░░ 82%
  ● MongoDB                  ████████████████░░░░ 80%
  ● Firebase                 ████████████████░░░░ 80%
  ● Supabase                 ███████████████░░░░░ 78%
  ● Redis                    ████████████████░░░░ 80%
  ● SQL (Joins, CTEs, Win.)  █████████████████░░░ 85%

  ⚙️ DevOps & Tools
  ● Git / GitHub             ██████████████████░░ 90%
  ● Linux                    ████████████████░░░░ 80%
  ● Docker / Kubernetes      ████████████████░░░░ 80%
  ● AWS (EC2/S3/Lambda)      ████████████████░░░░ 80%
  ● Notion / Make.com        ███████████████░░░░░ 78%
  ● C / C++                  ██████████████░░░░░░ 72%`,

  projects: () => `Recent Projects
  ───────────────
  [2024] Autonomous LLM Agent Framework
         Multi-agent orchestration with tool use & memory
  
  [2024] Enterprise RAG Pipeline
         10M+ docs, P95 latency <100ms
  
  [2023] Real-time Vision Classifier
         60fps defect detection on Jetson edge hardware
  
  [2023] Multilingual Sentiment API
         12 Indian languages, 5M+ requests/day`,

  experience: () => `Work Experience
  ───────────────
  2024–Now  Senior AI Engineer @ AI Startup (Stealth)
  2022–2024 Machine Learning Engineer @ Infosys Limited
  2021–2022 AI/ML Consultant @ Freelance`,

  contact: () => `Contact
  ───────
  Email    : md.asifmd46@gmail.com
  GitHub   : github.com/MdAsif-Ai
  LinkedIn : linkedin.com/in/mohammed-asif-5a1411338/`,

  date: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' }),

  whoami: () => 'mdasif',

  ls: () => `about.md    projects/    skills.md    cv.pdf
experience/ certificat  es/ github.url   contact.md`,

  'cat cv': () => `M H Mohammed Asif — AI/ML Engineer & Full Stack Developer
  ════════════════════════════════════════════════════
  Languages  : Python, JavaScript, TypeScript, SQL, Dart, R, C, C++
  AI/ML      : PyTorch, TensorFlow, Scikit-Learn, HuggingFace, RAG
  LLM/Agents : LangChain, LangGraph, CrewAI, OpenAI, Claude, Gemini
  Frontend   : React, Next.js, Redux, Tailwind, Vite, HTML/CSS
  Backend    : FastAPI, Node.js, Express, Django, REST APIs, JWT
  Mobile     : Flutter, Dart (iOS + Android)
  Databases  : PostgreSQL, MySQL, MongoDB, Firebase, Supabase, Redis
  DevOps     : Git, GitHub, Docker, Kubernetes, AWS, Linux
  Tools      : WandB, Modal, Notion, Make.com, n8n, MCP`,

  neofetch: () => `
       .-------.        asif@portfolio
     .'         '.      --------------
   .'             '.    OS: macOS Tahoe (Portfolio Edition)
  .                 .   Host: Browser
  .      .---.      .   Kernel: React + Vite + Typescript
  .    .'     '.    .   Uptime: Just booted
  .   .         .   .   Packages: 4 (npm)
  .   .         .   .   Shell: zsh (simulated)
  .    '.     .'    .   Resolution: 4K Retina
  .      '---'      .   DE: Aqua
   '.             .'    WM: WindowManager.ts
     '.         .'      Theme: Dark Mode
       '-------'        CPU: Apple M3 Max (simulated)
  `,

  sudo: () => `Asif is not in the sudoers file. This incident will be reported.`,
  
  pwd: () => `/Users/mdasif/Desktop/Portfolio`,
  
  echo: () => `Usage: echo [string] ... (simulated)`,
  
  ping: () => `ping: cannot resolve mdasif.dev: Unknown host`,
  
  uptime: () => `up 1 min, 1 user, load averages: 2.34 2.11 1.98`,
  
  joke: () => `Why do programmers prefer dark mode?
Because light attracts bugs.`,

  history: () => `1  help
2  about
3  skills
4  projects
5  neofetch`,

  top: () => `Processes: 98 total, 2 running, 2 stuck, 94 sleeping
CPU usage: 12.5% user, 8.4% sys, 79.1% idle
PhysMem: 16G used, 16G wired, 0G unused`,
};

export function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'Welcome to Mohammed Asif\'s Terminal\nType "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const { closeWindow } = useWindowStore();

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setHistory(h => [...h, { type: 'command', text: `$ ${cmd}` }]);

    if (!trimmed) return;
    if (trimmed === 'clear') { setHistory([]); return; }
    if (trimmed === 'exit' || trimmed === 'quit') {
      closeWindow('terminal');
      return;
    }

    setCmdHistory(h => [cmd, ...h]);
    setHistIdx(-1);

    const fn = COMMANDS[trimmed];
    if (fn) {
      setHistory(h => [...h, { type: 'output', text: fn() }]);
    } else {
      setHistory(h => [...h, { type: 'error', text: `zsh: command not found: ${trimmed}` }]);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] ?? '');
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] ?? '');
      e.preventDefault();
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-scroll">
        {history.map((entry, i) => (
          <pre key={i} className={`terminal-line terminal-${entry.type}`}>{entry.text}</pre>
        ))}
        <div className="terminal-input-row">
          <span className="terminal-prompt">asif@portfolio ~/Desktop/Portfolio %</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
