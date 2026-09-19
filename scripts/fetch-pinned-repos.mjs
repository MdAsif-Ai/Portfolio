#!/usr/bin/env node
/**
 * fetch-pinned-repos.mjs
 * Fetches your pinned GitHub repositories via GraphQL API and writes to
 * public/data/pinned-repos.json so the portfolio always reflects your pins.
 *
 * Requires GITHUB_TOKEN in .env (a classic token with "read:user" scope).
 * Get one at: https://github.com/settings/tokens
 *
 * The token is ONLY used at build-time — it is NEVER embedded in the browser bundle.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT    = path.resolve(__dirname, '../public/data/pinned-repos.json');
const ENV_FILE  = path.resolve(__dirname, '../.env');

// ── Default fallback pinned repos if GITHUB_TOKEN is missing or fetch fails ──
const DEFAULT_PINNED = [
  {
    name: "Ai-Mock-Interview-Platform",
    desc: "Full-stack AI Mock Interview platform with real-time audio/text feedback, speech recognition, scoring, and performance analytics.",
    url: "https://github.com/MdAsif-Ai/Ai-Mock-Interview-Platform",
    stars: 0,
    forks: 0,
    lang: "TypeScript",
    color: "#3178c6"
  },
  {
    name: "Ai-Resume-Analyser",
    desc: "AI-powered resume analysis & scoring engine built with LLMs to provide actionable feedback, ATS keyword matching, and skill gap recommendations.",
    url: "https://github.com/MdAsif-Ai/Ai-Resume-Analyser",
    stars: 0,
    forks: 0,
    lang: "JavaScript",
    color: "#f1e05a"
  },
  {
    name: "EfficientNet-Based-Multi-Class-Polyp-Disease-Classification",
    desc: "Deep learning pipeline using EfficientNet CNN architecture for accurate multi-class GI polyp disease detection & classification.",
    url: "https://github.com/MdAsif-Ai/EfficientNet-Based-Multi-Class-Polyp-Disease-Classification",
    stars: 0,
    forks: 0,
    lang: "Jupyter Notebook",
    color: "#DA5B0B"
  },
  {
    name: "Multi-agent-Deal-System",
    desc: "Autonomous multi-agent negotiation system powered by CrewAI / LangChain for automated deal discovery and valuation.",
    url: "https://github.com/MdAsif-Ai/Multi-agent-Deal-System",
    stars: 0,
    forks: 0,
    lang: "Python",
    color: "#3572A5"
  },
  {
    name: "Backend-from-scratch",
    desc: "Production-ready backend API architecture built from scratch with Python, FastAPI, JWT authentication, and SQL ORM.",
    url: "https://github.com/MdAsif-Ai/Backend-from-scratch",
    stars: 0,
    forks: 0,
    lang: "Python",
    color: "#3572A5"
  },
  {
    name: "VTP",
    desc: "Vehicle Tracking & Telematics Platform — real-time monitoring interface with interactive dashboard and alert triggers.",
    url: "https://github.com/MdAsif-Ai/VTP",
    stars: 0,
    forks: 0,
    lang: "TypeScript",
    color: "#3178c6"
  }
];

function ensureOutputDirExists() {
  const dir = path.dirname(OUTPUT);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFallback() {
  ensureOutputDirExists();
  if (!fs.existsSync(OUTPUT)) {
    fs.writeFileSync(OUTPUT, JSON.stringify(DEFAULT_PINNED, null, 2));
  }
}

// ── Read GITHUB_TOKEN from env or .env file ─────────────────────────────────
function readToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, 'utf-8').split('\n');
    for (const line of lines) {
      const m = line.match(/^GITHUB_TOKEN\s*=\s*["']?(.+?)["']?\s*$/);
      if (m) return m[1];
    }
  }
  return null;
}

// ── Lang colour map ──────────────────────────────────────────────────────────
const LANG_COLORS = {
  Python:           '#3572A5',
  TypeScript:       '#3178c6',
  JavaScript:       '#f1e05a',
  HTML:             '#e34c26',
  CSS:              '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  Shell:            '#89e051',
  Go:               '#00ADD8',
  Rust:             '#dea584',
};

// ── GraphQL query ────────────────────────────────────────────────────────────
const QUERY = `{
  user(login: "MdAsif-Ai") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
          updatedAt
          isPrivate
        }
      }
    }
  }
}`;

async function fetchPinned(token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');

  return json.data.user.pinnedItems.nodes.map((r) => ({
    name:     r.name,
    desc:     r.description || '',
    url:      r.url,
    stars:    r.stargazerCount,
    forks:    r.forkCount,
    lang:     r.primaryLanguage?.name || 'Unknown',
    color:    r.primaryLanguage?.color || LANG_COLORS[r.primaryLanguage?.name] || '#8b949e',
    updatedAt: r.updatedAt,
  }));
}

// ── Main ─────────────────────────────────────────────────────────────────────
ensureOutputDirExists();
const token = readToken();

if (!token) {
  console.warn('⚠️  GITHUB_TOKEN not found — skipping API fetch, using default pinned repos.');
  writeFallback();
  process.exit(0);
}

try {
  console.log('🔍 Fetching pinned repos from GitHub GraphQL API…');
  const pinned = await fetchPinned(token);
  ensureOutputDirExists();
  fs.writeFileSync(OUTPUT, JSON.stringify(pinned, null, 2));
  console.log(`✅ Pinned repos saved (${pinned.length} repos):`);
  pinned.forEach(r => console.log(`   📌 ${r.name} (${r.lang})`));
} catch (err) {
  console.error('❌ Failed to fetch pinned repos:', err.message);
  writeFallback();
}
