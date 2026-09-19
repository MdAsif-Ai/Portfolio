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
const token = readToken();

if (!token) {
  console.warn('⚠️  GITHUB_TOKEN not found — skipping pinned repos fetch.');
  console.warn('   Add GITHUB_TOKEN=ghp_... to your .env file to enable this feature.');
  console.warn('   Get a token at: https://github.com/settings/tokens (read:user scope)');
  // Write empty array so the app falls back gracefully
  if (!fs.existsSync(OUTPUT)) fs.writeFileSync(OUTPUT, '[]');
  process.exit(0);
}

try {
  console.log('🔍 Fetching pinned repos from GitHub GraphQL API…');
  const pinned = await fetchPinned(token);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(pinned, null, 2));
  console.log(`✅ Pinned repos saved (${pinned.length} repos):`);
  pinned.forEach(r => console.log(`   📌 ${r.name} (${r.lang})`));
} catch (err) {
  console.error('❌ Failed to fetch pinned repos:', err.message);
  if (!fs.existsSync(OUTPUT)) fs.writeFileSync(OUTPUT, '[]');
}
