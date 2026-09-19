import { useState } from 'react';
import { person } from '../../../data/person';
import { projects } from '../../../data/projects';
import { experience } from '../../../data/experience';
import { skills } from '../../../data/skills';
import { certificates } from '../../../data/certificates';
import { useLiveData } from '../../../data/liveData';
import { AvatarUploader } from '../../common/AvatarUploader';
import './Safari.css';

type SitePage = 'home' | 'projects' | 'about' | 'github' | 'leetcode' | 'ai-news' | 'huggingface';

interface Tab {
  id: string;
  label: string;
  page: SitePage;
  url: string;
  favicon: string;
}

const INITIAL_TABS: Tab[] = [
  { id: 't1', label: 'Portfolio — Asif',     page: 'home',    url: 'mdasif.dev',           favicon: '🌐' },
  { id: 't2', label: 'GitHub · mdasif',      page: 'github',  url: 'github.com/MdAsif-Ai',    favicon: '🐙' },
  { id: 't3', label: 'LeetCode · mdasif',    page: 'leetcode',url: 'leetcode.com/Hn6LzKxsM6', favicon: '🧑‍💻' },
  { id: 't4', label: 'Hugging Face · Md-Asif', page: 'huggingface', url: 'huggingface.co/Md-Asif', favicon: '🤗' },
];

const AI_NEWS = [
  { title: 'OpenAI launches GPT-5 with reasoning improvements', source: 'TechCrunch',  time: '2h ago',  votes: 342, color: '#34C759' },
  { title: 'Google DeepMind releases Gemini Ultra 2.0',         source: 'The Verge',   time: '4h ago',  votes: 289, color: '#007AFF' },
  { title: 'Meta\'s Llama 4 outperforms proprietary models on open benchmarks', source: 'HuggingFace', time: '6h ago', votes: 521, color: '#5856D6' },
  { title: 'Anthropic raises $4B at $60B valuation',            source: 'Bloomberg',   time: '8h ago',  votes: 178, color: '#FF9500' },
  { title: 'LangGraph becomes default orchestration for agentic AI', source: 'Hacker News', time: '10h ago', votes: 445, color: '#FF6B35' },
  { title: 'Mistral releases Mixtral-8x22B — new SOTA on open benchmarks', source: 'arXiv', time: '12h ago', votes: 367, color: '#FF3B30' },
  { title: 'RAG vs Fine-tuning: A comprehensive benchmark study 2025', source: 'Papers w/ Code', time: '1d ago', votes: 892, color: '#30D158' },
  { title: 'AWS Bedrock now supports 47 foundation models', source: 'AWS Blog', time: '1d ago', votes: 156, color: '#FF9F0A' },
];

export function Safari() {
  const [tabs, setTabs]         = useState<Tab[]>(INITIAL_TABS);
  const [activeTabId, setActive] = useState('t1');
  const [urlInput, setUrlInput]  = useState(INITIAL_TABS[0].url);
  const [isLoading, setLoading]  = useState(false);
  const { githubRepos, leetcodeStats, hfModels, hfSpaces, pinnedRepos } = useLiveData();

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  const navigateTo = (url: string, page: SitePage, label: string, favicon: string) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
    setTabs(ts => ts.map(t => t.id === activeTabId ? { ...t, url, page, label, favicon } : t));
    setUrlInput(url);
  };

  const addTab = () => {
    const id = `t${Date.now()}`;
    const newTab: Tab = { id, label: 'New Tab', page: 'home', url: 'mdasif.dev', favicon: '🌐' };
    setTabs(ts => [...ts, newTab]);
    setActive(id);
    setUrlInput('mdasif.dev');
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) setActive(remaining[remaining.length - 1].id);
  };

  const handleUrl = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const val = urlInput.toLowerCase();
    if (val.includes('github')) {
      navigateTo('github.com/MdAsif-Ai', 'github', 'GitHub · mdasif', '🐙');
    } else if (val.includes('leetcode')) {
      navigateTo('leetcode.com/Hn6LzKxsM6', 'leetcode', 'LeetCode · mdasif', '🧑‍💻');
    } else if (val.includes('hugging')) {
      navigateTo('huggingface.co/Md-Asif', 'huggingface', 'Hugging Face · Md-Asif', '🤗');
    } else if (val.includes('news') || val.includes('hacker')) {
      navigateTo('news.ycombinator.com', 'ai-news', 'AI News — Today', '📰');
    } else if (val.includes('about')) {
      navigateTo('mdasif.dev/about', 'about', 'About — Asif', '👤');
    } else if (val.includes('project')) {
      navigateTo('mdasif.dev/projects', 'projects', 'Projects — Asif', '📁');
    } else {
      navigateTo(urlInput, 'home', 'Portfolio — Asif', '🌐');
    }
  };

  return (
    <div className="safari">
      {/* ── Tab bar ── */}
      <div className="safari-tabbar">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`safari-tab ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => { setActive(tab.id); setUrlInput(tab.url); }}
          >
            <span className="safari-tab-favicon">{tab.favicon}</span>
            <span className="safari-tab-label">{tab.label}</span>
            <button className="safari-tab-close" onClick={e => closeTab(tab.id, e)}>✕</button>
          </div>
        ))}
        <button className="safari-newtab-btn" onClick={addTab}>＋</button>
      </div>

      {/* ── Toolbar ── */}
      <div className="safari-toolbar">
        <button className="safari-nav-btn" onClick={() => navigateTo('mdasif.dev','home','Portfolio — Asif','🌐')}>‹</button>
        <button className="safari-nav-btn" disabled>›</button>
        <button className="safari-nav-btn" onClick={() => { setLoading(true); setTimeout(()=>setLoading(false),400); }}>↻</button>
        <div className="safari-urlbar">
          {isLoading && <span className="safari-loading-dot" />}
          <svg width="11" height="13" viewBox="0 0 24 28" fill="currentColor" opacity="0.45">
            <path d="M12 2C8.7 2 6 4.7 6 8v2H4v16h16V10h-2V8c0-3.3-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4v2H8V8c0-2.2 1.8-4 4-4zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          </svg>
          <input
            className="safari-url-input"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={handleUrl}
            onFocus={e => e.target.select()}
          />
        </div>
        <div className="safari-toolbar-actions">
          <button className="safari-action-btn" onClick={()=>navigateTo('mdasif.dev','home','Portfolio','🌐')}>🏠</button>
          <button className="safari-action-btn">⊕</button>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="safari-content">
        {isLoading && <div className="safari-progress"><div className="safari-progress-bar" /></div>}
        {activeTab.page === 'home'     && <PortfolioHome navigate={navigateTo} githubRepos={githubRepos} leetcodeStats={leetcodeStats} />}
        {activeTab.page === 'about'    && <AboutPage />}
        {activeTab.page === 'projects' && <ProjectsPage />}
        {activeTab.page === 'github'   && <GithubPage githubRepos={githubRepos} pinnedRepos={pinnedRepos} />}
        {activeTab.page === 'leetcode' && <LeetcodePage leetcodeStats={leetcodeStats} />}
        {activeTab.page === 'huggingface' && <HuggingFacePage hfModels={hfModels} hfSpaces={hfSpaces} />}
        {activeTab.page === 'ai-news'  && <AINewsPage />}
      </div>
    </div>
  );
}

/* ── Portfolio home page ─────────────────────────────────────────────────── */
function PortfolioHome({ navigate, githubRepos, leetcodeStats }: { navigate: (url: string, page: SitePage, label: string, favicon: string) => void, githubRepos: any[], leetcodeStats: any }) {
  return (
    <div className="safari-page safari-page--home">
      {/* Hero */}
      <div className="safari-hero">
        <div className="safari-hero-avatar" style={{ background: 'transparent', boxShadow: 'none' }}>
          <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={150} readonly={true} />
        </div>
        <h1 className="safari-hero-name">{person.name}</h1>
        <p className="safari-hero-title">{person.title}</p>
        <p className="safari-hero-location">📍 {person.location}</p>
        <div className="safari-hero-links">
          <a href={person.github} target="_blank" rel="noopener noreferrer" className="safari-cta-btn">GitHub ↗</a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="safari-cta-btn safari-cta-btn--outline">LinkedIn ↗</a>
          <a href={`mailto:${person.email}`} className="safari-cta-btn safari-cta-btn--outline">Email ✉</a>
        </div>
      </div>

      {/* Bio */}
      <p className="safari-bio">{person.bio}</p>

      {/* Quick nav */}
      <div className="safari-quicknav">
        <button className="safari-qnav-card" onClick={()=>navigate('mdasif.dev/projects','projects','Projects — Asif','📁')}>
          <span>📁</span><strong>Projects</strong><span className="safari-qnav-sub">{projects.length} featured builds</span>
        </button>
        <button className="safari-qnav-card" onClick={()=>navigate('leetcode.com/Hn6LzKxsM6','leetcode','LeetCode · mdasif','🧑‍💻')}>
          <span>🧑‍💻</span><strong>LeetCode</strong><span className="safari-qnav-sub">{leetcodeStats.totalSolved} solved</span>
        </button>
        <button className="safari-qnav-card" onClick={()=>navigate('huggingface.co/Md-Asif','huggingface','Hugging Face · Md-Asif','🤗')}>
          <span>🤗</span><strong>Hugging Face</strong><span className="safari-qnav-sub">Models & Spaces</span>
        </button>
        <button className="safari-qnav-card" onClick={()=>navigate('github.com/MdAsif-Ai','github','GitHub · mdasif','🐙')}>
          <span>🐙</span><strong>GitHub</strong><span className="safari-qnav-sub">{githubRepos.length} repos</span>
        </button>
        <button className="safari-qnav-card" onClick={()=>navigate('news.ycombinator.com','ai-news','AI News','📰')}>
          <span>📰</span><strong>AI News</strong><span className="safari-qnav-sub">Today's headlines</span>
        </button>
      </div>

      {/* Featured projects */}
      <div className="safari-section">
        <h2 className="safari-section-title">Featured Projects</h2>
        <div className="safari-project-grid">
          {projects.filter(p=>p.featured).slice(0,3).map(p => (
            <div key={p.id} className="safari-project-card" style={{'--c':p.color} as React.CSSProperties}>
              <div className="safari-proj-color" style={{background:p.color}}/>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="safari-proj-tech">
                {p.tech.slice(0,3).map(t=><span key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const cats = [...new Set(skills.map(s => s.category))];
  return (
    <div className="safari-page safari-page--about">
      <h1 className="safari-page-title">About</h1>
      <div className="safari-about-grid">
        <div>
          <h2 className="safari-about-sub">Experience</h2>
          {experience.map(e => (
            <div key={e.id} className="safari-exp-row">
              <div className="safari-exp-dot" style={{background:e.color}} />
              <div>
                <p className="safari-exp-role">{e.role}</p>
                <p className="safari-exp-co">{e.company} · {e.period}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="safari-about-sub">Skills</h2>
          {cats.map(cat => (
            <div key={cat} className="safari-skill-group">
              <p className="safari-skill-cat">{cat}</p>
              {skills.filter(s=>s.category===cat).map(s=>(
                <div key={s.name} className="safari-skill-row">
                  <span>{s.name}</span>
                  <div className="safari-skill-bar"><div style={{width:`${s.level}%`}}/></div>
                  <span>{s.level}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="safari-page">
      <h1 className="safari-page-title">Projects</h1>
      {projects.map(p => (
        <div key={p.id} className="safari-full-project" style={{'--c':p.color} as React.CSSProperties}>
          <div className="safari-full-proj-accent" style={{background:p.color}}/>
          <div>
            <div className="safari-full-proj-header">
              <h2>{p.title}</h2>
              <span className="safari-proj-year">{p.year}</span>
            </div>
            <p className="safari-full-proj-desc">{p.longDescription}</p>
            <div className="safari-proj-tech">
              {p.tech.map(t=><span key={t}>{t}</span>)}
            </div>
            <div className="safari-full-proj-links">
              {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
              {p.live   && <a href={p.live}   target="_blank" rel="noopener noreferrer">Live ↗</a>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GithubPage({ githubRepos, pinnedRepos }: { githubRepos: any[]; pinnedRepos: any[] | null }) {
  // null = still loading; [] = loaded but empty (use fallback)
  const isLoadingPinned = pinnedRepos === null;
  const displayPinned   = pinnedRepos ?? githubRepos.slice(0, 6);

  return (
    <div className="gh-container">
      {/* Sidebar */}
      <div className="gh-sidebar">
        <div className="gh-avatar">
          <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={260} readonly={true} />
          <div className="gh-status-badge">😊</div>
        </div>
        <h1 className="gh-name">{person.name}</h1>
        <p className="gh-handle">MdAsif-Ai</p>
        <a
          href="https://github.com/MdAsif-Ai"
          target="_blank"
          rel="noopener noreferrer"
          className="gh-edit-profile"
        >
          View on GitHub ↗
        </a>
        <div className="gh-followers">
          👥 <a href="https://github.com/MdAsif-Ai?tab=followers" target="_blank" rel="noopener noreferrer"><strong>{githubRepos.length}</strong> repos</a>
        </div>
        <div className="gh-contact">
          ✉ <a href={`mailto:${person.email}`}>{person.email}</a>
        </div>
        <div className="gh-orgs">
          <h3>Organizations</h3>
          <div className="gh-org-icon">ƒ</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="gh-main">
        <div className="gh-section-header">
          <h2>Pinned</h2>
          <a
            href="https://github.com/MdAsif-Ai"
            target="_blank"
            rel="noopener noreferrer"
            className="gh-customize-pins"
          >
            Customize your pins ↗
          </a>
        </div>

        <div className="gh-pinned-grid">
          {isLoadingPinned ? (
            /* Skeleton cards while loading */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="gh-repo-card gh-repo-card--skeleton">
                <div className="gh-skeleton-line gh-skeleton-line--title" />
                <div className="gh-skeleton-line gh-skeleton-line--desc" />
                <div className="gh-skeleton-line gh-skeleton-line--desc" style={{ width: '60%' }} />
                <div className="gh-skeleton-line gh-skeleton-line--meta" />
              </div>
            ))
          ) : (
            displayPinned.map((r) => (
              <div key={r.name} className="gh-repo-card gh-repo-card--rich">
                <div className="gh-repo-card-inner">
                  {/* Header row */}
                  <div className="gh-repo-header">
                    <svg className="gh-repo-icon" viewBox="0 0 16 16" width="14" height="14" fill="var(--text-secondary)">
                      <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                    </svg>
                    <a
                      href={r.url || `https://github.com/MdAsif-Ai/${r.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gh-repo-name"
                    >
                      {r.name}
                    </a>
                    <span className="gh-repo-badge">Public</span>
                  </div>

                  {/* Description */}
                  {r.desc && (
                    <p className="gh-repo-desc">{r.desc}</p>
                  )}

                  {/* Footer: language + stats */}
                  <div className="gh-repo-footer">
                    {r.lang && r.lang !== 'Unknown' && (
                      <span className="gh-repo-lang-item">
                        <span className="gh-repo-lang-dot" style={{ background: r.color }} />
                        {r.lang}
                      </span>
                    )}
                    {r.stars > 0 && (
                      <span className="gh-repo-stat">
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                          <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                        </svg>
                        {r.stars}
                      </span>
                    )}
                    {r.forks > 0 && (
                      <span className="gh-repo-stat">
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                          <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {r.forks}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="gh-section-header" style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 400 }}>107 contributions in the last year</h2>
          <a href="#" className="gh-customize-pins">Contribution settings ▼</a>
        </div>

        {/* Heatmap */}
        <div className="gh-contrib-container">
          <div className="gh-heatmap-wrapper">
            <div className="gh-heatmap-days">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="gh-heatmap-grid">
              {Array.from({ length: 52 }).map((_, col) => (
                <div key={col} className="gh-heatmap-col">
                  {Array.from({ length: 7 }).map((_, row) => {
                    const isGreen = Math.random() > 0.85;
                    const intensity = isGreen ? Math.floor(Math.random() * 4) + 1 : 0;
                    return <div key={row} className={`gh-heat-square level-${intensity}`} />;
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="gh-heatmap-footer">
            <a href="#">Learn how we count contributions</a>
            <div className="gh-heatmap-legend">
              Less
              <div className="gh-heat-square level-0" />
              <div className="gh-heat-square level-1" />
              <div className="gh-heat-square level-2" />
              <div className="gh-heat-square level-3" />
              <div className="gh-heat-square level-4" />
              More
            </div>
          </div>
        </div>

        <h3 className="gh-contrib-activity">Contribution activity</h3>
        <p className="gh-contrib-month">2026</p>

        <div className="gh-timeline-item">
          <div className="gh-timeline-icon">⑃</div>
          <div className="gh-timeline-content">
            <h4>Created {githubRepos.length} repositories</h4>
            <div className="gh-timeline-repo">
              {githubRepos.slice(0, 3).map(r => (
                <div key={r.name}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">MdAsif-Ai/{r.name}</a>
                  <div className="gh-timeline-bar"><div style={{ width: '100%', background: '#238636' }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeetcodePage({ leetcodeStats }: { leetcodeStats: any }) {
  const { totalSolved, easySolved, mediumSolved, hardSolved, ranking, reputation, totalQuestions } = leetcodeStats;
  const total = totalQuestions || 3985;
  const strokeDasharray = 283;
  const solvedPercent = totalSolved / total;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * solvedPercent);

  return (
    <div className="lc-container">
      {/* Sidebar */}
      <div className="lc-sidebar">
        <div className="lc-profile-header">
          <div className="lc-avatar" style={{ background: 'transparent' }}>
            <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={100} readonly={true} />
          </div>
          <div>
            <h1 className="lc-name">Hn6LzKxsM6 <span className="lc-pro-badge"></span></h1>
            <p className="lc-handle">Hn6LzKxsM6</p>
            <p className="lc-rank">Rank <strong>{ranking.toLocaleString()}</strong></p>
          </div>
        </div>
        <p className="lc-follow"><strong>0</strong> Following &nbsp;&nbsp;&nbsp; <strong>0</strong> Followers</p>
        <button className="lc-edit-btn">Edit Profile</button>

        <div className="lc-sidebar-section">
          <h3>Community Stats</h3>
          <div className="lc-stat-row"><span className="lc-icon">👁️</span> Views <strong>0</strong></div>
          <div className="lc-stat-row"><span className="lc-icon" style={{color:'#00b8a3'}}>✔️</span> Solution <strong>0</strong></div>
          <div className="lc-stat-row"><span className="lc-icon" style={{color:'#00b8a3'}}>💬</span> Discuss <strong>0</strong></div>
          <div className="lc-stat-row"><span className="lc-icon" style={{color:'#ffa116'}}>⭐</span> Reputation <strong>{reputation}</strong></div>
        </div>

        <div className="lc-sidebar-section">
          <h3>Languages</h3>
          <div className="lc-lang-row"><span className="lc-lang-badge">Python3</span> <strong>109</strong> <span className="lc-gray">problems solved</span></div>
          <div className="lc-lang-row"><span className="lc-lang-badge">C++</span> <strong>12</strong> <span className="lc-gray">problems solved</span></div>
          <div className="lc-lang-row"><span className="lc-lang-badge">PostgreSQL</span> <strong>1</strong> <span className="lc-gray">problem solved</span></div>
        </div>
        
        <div className="lc-sidebar-section">
          <h3>Skills</h3>
          <p className="lc-skill-level">• Advanced</p>
          <div className="lc-skill-badge">Dynamic Programming <span>x4</span></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lc-main">
        {/* Top Cards Row */}
        <div className="lc-top-cards">
          <div className="lc-card lc-rating-card">
            <div className="lc-rating-header">
              <div>
                <p className="lc-label">Contest Rating</p>
                <p className="lc-value">1,414</p>
              </div>
              <div>
                <p className="lc-label">Global Ranking <span className="lc-gray">/874,830</span></p>
                <p className="lc-value">686,576</p>
              </div>
              <div>
                <p className="lc-label">Attended</p>
                <p className="lc-value">1</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p className="lc-label">Top</p>
                <p className="lc-value">78.8%</p>
              </div>
            </div>
            
            <div className="lc-rating-chart-area">
              <div className="lc-rating-line-graph">
                <div className="lc-rating-line">
                  <div className="lc-rating-dot">
                    <div className="lc-rating-tooltip">1,414</div>
                  </div>
                </div>
              </div>
              <div className="lc-rating-bar-graph">
                {Array.from({length: 15}).map((_, i) => (
                  <div key={i} className={`lc-bar ${i === 4 ? 'lc-bar-active' : ''}`} style={{height: `${Math.max(10, Math.random() * 50)}px`}}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Cards Row */}
        <div className="lc-middle-cards">
          <div className="lc-card lc-progress-card">
            <div className="lc-circle-wrapper">
              <svg viewBox="0 0 100 100" className="lc-circle-svg">
                <circle cx="50" cy="50" r="45" className="lc-circle-bg" />
                <circle cx="50" cy="50" r="45" className="lc-circle-progress" style={{strokeDashoffset}} />
              </svg>
              <div className="lc-circle-text">
                <span className="lc-circle-value">{totalSolved}</span>
                <span className="lc-circle-label">/{total}</span>
                <span className="lc-circle-sub">✔️ Solved</span>
              </div>
            </div>
            <div className="lc-stats-breakdown">
              <div className="lc-diff-row">
                <span className="lc-diff-label lc-easy">Easy</span>
                <span className="lc-diff-value"><strong>{easySolved}</strong><span className="lc-gray">/953</span></span>
              </div>
              <div className="lc-diff-row">
                <span className="lc-diff-label lc-med">Med.</span>
                <span className="lc-diff-value"><strong>{mediumSolved}</strong><span className="lc-gray">/2081</span></span>
              </div>
              <div className="lc-diff-row">
                <span className="lc-diff-label lc-hard">Hard</span>
                <span className="lc-diff-value"><strong>{hardSolved}</strong><span className="lc-gray">/951</span></span>
              </div>
            </div>
          </div>
          
          <div className="lc-card lc-badges-card">
            <div className="lc-badges-header">
              <p className="lc-label">Badges</p>
              <p className="lc-value">2</p>
              <span className="lc-arrow">→</span>
            </div>
            <div className="lc-badges-list">
              <div className="lc-badge-item"></div>
              <div className="lc-badge-item lc-badge-blue"></div>
            </div>
            <p className="lc-recent-badge">Most Recent Badge<br/><strong>100 Days Badge 2026</strong></p>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="lc-card lc-heatmap-card">
          <div className="lc-heatmap-header">
            <p className="lc-value">829 <span className="lc-label">submissions in the past one year ⓘ</span></p>
            <div className="lc-heatmap-stats">
              <span className="lc-label">Total active days: 183</span>
              <span className="lc-label">Max streak: 69</span>
              <button className="lc-btn">Current ⌄</button>
            </div>
          </div>
          <div className="lc-heatmap-grid">
            {/* Generate mock heatmap for LeetCode aesthetic */}
            {Array.from({length: 52}).map((_, col) => (
              <div key={col} className="lc-heatmap-col">
                {Array.from({length: 7}).map((_, row) => {
                  const isGreen = Math.random() > 0.7;
                  const intensity = isGreen ? Math.floor(Math.random() * 4) + 1 : 0;
                  return <div key={row} className={`lc-heat-square level-${intensity}`}></div>
                })}
              </div>
            ))}
          </div>
          <div className="lc-heatmap-months">
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        {/* Recent AC */}
        <div className="lc-card lc-recent-card">
          <div className="lc-recent-tabs">
            <button className="lc-tab active"><span>✔️</span> Recent AC</button>
            <button className="lc-tab"><span>📄</span> List</button>
            <button className="lc-tab"><span>☑️</span> Solutions</button>
            <button className="lc-tab"><span>💬</span> Discuss</button>
            <a href="#" className="lc-view-all">View all submissions ›</a>
          </div>
          <div className="lc-recent-list">
            <div className="lc-recent-item">
              <span className="lc-recent-name">Combination Sum</span>
              <span className="lc-recent-time">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AINewsPage() {
  return (
    <div className="safari-page safari-page--news">
      <div className="safari-news-header">
        <h1>🔥 AI News</h1>
        <p className="safari-news-date">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
      </div>
      <div className="safari-news-list">
        {AI_NEWS.map((item,i) => (
          <div key={i} className="safari-news-item">
            <span className="safari-news-rank">{i+1}</span>
            <div>
              <p className="safari-news-title">{item.title}</p>
              <p className="safari-news-meta">
                <span className="safari-news-source" style={{color:item.color}}>{item.source}</span>
                <span>·</span>
                <span>{item.time}</span>
                <span>·</span>
                <span>▲ {item.votes}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HuggingFacePage({ hfModels, hfSpaces }: { hfModels: any[], hfSpaces: any[] }) {
  const getGradient = (i: number) => {
    const gradients = [
      'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
      'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)',
      'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    ];
    return gradients[i % gradients.length];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="hf-container">
      <div className="hf-sidebar">
        <div className="hf-avatar-container">
          <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={150} readonly={true} />
          <div className="hf-avatar-badge">🤗</div>
        </div>
        <h1 className="hf-name">{person.name}</h1>
        <p className="hf-handle">Md-Asif</p>
        
        <div className="hf-profile-actions">
          <button className="hf-btn"><span>+</span> New</button>
          <button className="hf-btn hf-btn-outline">Edit profile</button>
          <button className="hf-btn hf-btn-outline">Settings</button>
        </div>
        
        <div className="hf-sidebar-section">
          <h3>🔬 AI & ML interests</h3>
          <p className="hf-empty-text">None yet</p>
        </div>
        
        <div className="hf-sidebar-section">
          <h3>⚡ Recent Activity</h3>
          <div className="hf-activity-list">
            <div className="hf-activity-item">
              <span className="hf-activity-icon">📦</span>
              <div>
                <p>Published a model <span>about 18 hours ago</span></p>
                <a href="#">Md-Asif/python-debug-logic-2026-07-05_12.54...</a>
              </div>
            </div>
            <div className="hf-activity-item">
              <span className="hf-activity-icon">📦</span>
              <div>
                <p>Published a model <span>about 18 hours ago</span></p>
                <a href="#">Md-Asif/python-debug-logic-2026-07-05_12.53...</a>
              </div>
            </div>
            <div className="hf-activity-item">
              <span className="hf-activity-icon">📦</span>
              <div>
                <p>Published a model <span>about 19 hours ago</span></p>
                <a href="#">Md-Asif/python-debug-logic-2026-07-05_11.56...</a>
              </div>
            </div>
          </div>
          <button className="hf-view-all">View all activity</button>
        </div>
        
        <div className="hf-sidebar-section">
          <h3>🏢 Organizations</h3>
          <p className="hf-empty-text">None yet</p>
        </div>
      </div>
      
      <div className="hf-main">
        <div className="hf-section-header">
          <h2><span>::</span> Spaces <span className="hf-count">{hfSpaces.length}</span></h2>
          <button className="hf-sort-btn">↑↓ Sort: Recently updated</button>
        </div>
        
        <div className="hf-spaces-grid">
          {hfSpaces.map((space, i) => (
            <div key={space._id || space.id} className="hf-space-card" style={{ background: getGradient(i) }}>
              <div className="hf-space-tags">
                <span className="hf-tag"><span className="hf-tag-dot hf-dot-sleeping"></span> Sleeping</span>
                <span className="hf-tag">🤖 Agents</span>
              </div>
              <h3 className="hf-space-title">{space.id.split('/')[1].replace(/_/g, ' ')}</h3>
              <p className="hf-space-desc">AI space by {space.id.split('/')[0]}</p>
              
              <div className="hf-space-footer">
                <div className="hf-space-author">
                  <span className="hf-author-avatar"></span>
                  <span>{space.id.split('/')[0]}</span>
                </div>
                <span className="hf-space-date">{formatDate(space.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hf-section-header" style={{ marginTop: '40px' }}>
          <h2><span>📦</span> Models <span className="hf-count">{hfModels.length}</span></h2>
          <button className="hf-sort-btn">↑↓ Sort: Recently updated</button>
        </div>
        
        <div className="hf-models-list">
          {hfModels.map(model => (
            <div key={model._id || model.id} className="hf-model-row">
              <div className="hf-model-info">
                <span className="hf-model-icon"></span>
                <a href="#" className="hf-model-name">{model.id}</a>
                {model.private && <span className="hf-tag hf-tag-outline">private</span>}
              </div>
              <p className="hf-model-date">Updated {formatDate(model.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
