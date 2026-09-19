import { useState, useEffect } from 'react';
import staticGithubData from './github_repos.json';
import staticLeetcodeData from './leetcode_profile.json';

/* ── Types ─────────────────────────────────────────────────────────────────── */
export interface PinnedRepo {
  name: string;
  desc: string;
  url: string;
  stars: number;
  forks: number;
  lang: string;
  color: string;
  updatedAt: string;
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function getLangColor(lang: string): string {
  switch (lang) {
    case 'Python':           return '#3572A5';
    case 'TypeScript':       return '#3178c6';
    case 'JavaScript':       return '#f1e05a';
    case 'HTML':             return '#e34c26';
    case 'CSS':              return '#563d7c';
    case 'Jupyter Notebook': return '#DA5B0B';
    case 'Shell':            return '#89e051';
    case 'Go':               return '#00ADD8';
    case 'Rust':             return '#dea584';
    default:                 return '#8b949e';
  }
}

function mapRepo(repo: any) {
  return {
    name:      repo.name,
    stars:     repo.stargazers_count ?? repo.stars ?? 0,
    forks:     repo.forks_count      ?? repo.forks ?? 0,
    lang:      repo.language         ?? repo.lang  ?? 'Unknown',
    desc:      repo.description      ?? repo.desc  ?? '',
    url:       repo.html_url         ?? repo.url   ?? `https://github.com/MdAsif-Ai/${repo.name}`,
    color:     getLangColor(repo.language ?? repo.lang),
    updatedAt: repo.updated_at       ?? repo.updatedAt ?? '',
  };
}

/* ── Static seed data ────────────────────────────────────────────────────────*/
export const initialGithubRepos = (staticGithubData as any[]).map(mapRepo);

export const initialLeetcodeStats = {
  totalSolved:   (staticLeetcodeData as any).data.matchedUser.submitStats.acSubmissionNum.find((x: any) => x.difficulty === 'All')?.count    || 0,
  easySolved:    (staticLeetcodeData as any).data.matchedUser.submitStats.acSubmissionNum.find((x: any) => x.difficulty === 'Easy')?.count   || 0,
  mediumSolved:  (staticLeetcodeData as any).data.matchedUser.submitStats.acSubmissionNum.find((x: any) => x.difficulty === 'Medium')?.count || 0,
  hardSolved:    (staticLeetcodeData as any).data.matchedUser.submitStats.acSubmissionNum.find((x: any) => x.difficulty === 'Hard')?.count   || 0,
  ranking:       (staticLeetcodeData as any).data.matchedUser.profile.ranking,
  reputation:    (staticLeetcodeData as any).data.matchedUser.profile.reputation,
  totalQuestions:(staticLeetcodeData as any).data.allQuestionsCount.find((x: any) => x.difficulty === 'All')?.count || 0,
};

/* ── Module-level cache (survives re-renders) ────────────────────────────── */
let cachedGithub:  typeof initialGithubRepos = initialGithubRepos;
let cachedLeetcode = initialLeetcodeStats;
let cachedHfModels: any[]     = [];
let cachedHfSpaces: any[]     = [];
let cachedPinned:  PinnedRepo[] | null = null;   // null = not yet loaded
let isFetching = false;

/* ── useLiveData hook ────────────────────────────────────────────────────── */
export function useLiveData() {
  const [githubRepos,  setGithubRepos]  = useState(cachedGithub);
  const [leetcodeStats,setLeetcodeStats]= useState(cachedLeetcode);
  const [hfModels,     setHfModels]     = useState(cachedHfModels);
  const [hfSpaces,     setHfSpaces]     = useState(cachedHfSpaces);
  const [pinnedRepos,  setPinnedRepos]  = useState<PinnedRepo[] | null>(cachedPinned);

  useEffect(() => {
    if (isFetching) return;
    isFetching = true;

    async function fetchFreshData() {
      try {
        /* ── 1. Pinned repos ─────────────────────────────────────────────
         * Strategy (in order):
         *   a) public/data/pinned-repos.json  (written by fetch-pinned-repos.mjs at build time)
         *   b) gh-pinned-repos.egoist.dev     (live third-party proxy, no auth needed)
         *   c) top-6 from REST API by stars   (guaranteed fallback)
         */
        await (async () => {
          // a) Build-time JSON
          try {
            const res = await fetch('/data/pinned-repos.json', { cache: 'no-cache' });
            if (res.ok) {
              const data: PinnedRepo[] = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                cachedPinned = data;
                setPinnedRepos(data);
                return;
              }
            }
          } catch { /* continue to next strategy */ }

          // b) Live third-party proxy
          try {
            const res = await fetch('https://gh-pinned-repos.egoist.dev/?username=MdAsif-Ai');
            if (res.ok) {
              const raw = await res.json();
              if (Array.isArray(raw) && raw.length > 0) {
                const data: PinnedRepo[] = raw.map((r: any) => ({
                  name:      r.repo,
                  desc:      r.description || '',
                  url:       `https://github.com/${r.owner}/${r.repo}`,
                  stars:     r.stars  || 0,
                  forks:     r.forks  || 0,
                  lang:      r.language || 'Unknown',
                  color:     r.languageColor || getLangColor(r.language),
                  updatedAt: '',
                }));
                cachedPinned = data;
                setPinnedRepos(data);
                return;
              }
            }
          } catch { /* continue to fallback */ }

          // c) Fallback: top 6 repos by stars
          const sortedByStars = [...cachedGithub].sort((a, b) => b.stars - a.stars).slice(0, 6);
          cachedPinned = sortedByStars.map(r => ({ ...r, forks: 0 }));
          setPinnedRepos(cachedPinned);
        })();

        /* ── 2. All repos (REST API) ───────────────────────────────────── */
        const ghRes = await fetch('https://api.github.com/users/MdAsif-Ai/repos?per_page=30&sort=updated');
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          cachedGithub = ghData.map(mapRepo);
          setGithubRepos(cachedGithub);
        }

        /* ── 3. LeetCode ───────────────────────────────────────────────── */
        const [lcProfRes, lcSolvRes] = await Promise.all([
          fetch('https://alfa-leetcode-api.onrender.com/Hn6LzKxsM6'),
          fetch('https://alfa-leetcode-api.onrender.com/Hn6LzKxsM6/solved'),
        ]);
        if (lcProfRes.ok && lcSolvRes.ok) {
          const prof = await lcProfRes.json();
          const solv = await lcSolvRes.json();
          cachedLeetcode = {
            totalSolved:   solv.solvedProblem || 0,
            easySolved:    solv.easySolved    || 0,
            mediumSolved:  solv.mediumSolved  || 0,
            hardSolved:    solv.hardSolved    || 0,
            ranking:       prof.ranking       || 0,
            reputation:    prof.reputation    || 0,
            totalQuestions: 3985,
          };
          setLeetcodeStats(cachedLeetcode);
        }

        /* ── 4. Hugging Face ───────────────────────────────────────────── */
        const [hfModelsRes, hfSpacesRes] = await Promise.all([
          fetch('https://huggingface.co/api/models?author=Md-Asif'),
          fetch('https://huggingface.co/api/spaces?author=Md-Asif'),
        ]);
        if (hfModelsRes.ok) { cachedHfModels = await hfModelsRes.json(); setHfModels(cachedHfModels); }
        if (hfSpacesRes.ok) { cachedHfSpaces = await hfSpacesRes.json(); setHfSpaces(cachedHfSpaces); }

      } catch (err) {
        console.error('Failed to fetch live data', err);
      }
    }

    fetchFreshData();
  }, []);

  return { githubRepos, leetcodeStats, hfModels, hfSpaces, pinnedRepos };
}
