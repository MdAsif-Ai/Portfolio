import { useState, useEffect } from 'react';
import { person } from '../../../data/person';
import { projects } from '../../../data/projects';
import { skills } from '../../../data/skills';
import { certificates } from '../../../data/certificates';
import { experience } from '../../../data/experience';
import { useLiveData } from '../../../data/liveData';
import './Finder.css';

type FinderView = 'about' | 'projects' | 'skills' | 'experience' | 'certificates' | 'github' | 'leetcode';
type Theme = 'dark' | 'light';

const SIDEBAR: { id: FinderView; label: string; icon: string }[] = [
  { id: 'about', label: 'About Me', icon: '👤' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'certificates', label: 'Certificates', icon: '🏆' },
  { id: 'github', label: 'GitHub Repos', icon: '🐙' },
  { id: 'leetcode', label: 'LeetCode Stats', icon: '🧑‍💻' },
];

const FolderIcon = () => (
  <svg viewBox="0 0 100 100" className="folder-icon" xmlns="http://www.w3.org/2000/svg">
    <path fill="#3a9dec" d="M10,25 C10,21.7 12.7,19 16,19 L35,19 C37,19 39,20 40,21.5 L46,28 L84,28 C87.3,28 90,30.7 90,34 L90,80 C90,83.3 87.3,86 84,86 L16,86 C12.7,86 10,83.3 10,80 L10,25 Z"/>
    <path fill="#5bc0f8" d="M10,34 C10,30.7 12.7,28 16,28 L84,28 C87.3,28 90,30.7 90,34 L90,80 C90,83.3 87.3,86 84,86 L16,86 C12.7,86 10,83.3 10,80 L10,34 Z"/>
  </svg>
);

interface FinderProps {
  isMobile?: boolean;
}

export function Finder({ isMobile = false }: FinderProps) {
  const [view, setView] = useState<FinderView>('about');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { githubRepos, leetcodeStats } = useLiveData();

  const handleNavClick = (id: FinderView) => {
    setView(id);
    setSelectedItem(null); // Reset selection when changing sidebar view
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className={`finder ${isMobile ? 'finder--mobile' : ''}`}>
      {/* Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <aside className="finder-sidebar">
          <p className="finder-sidebar-section" style={{ marginTop: '16px' }}>FAVORITES</p>
          {SIDEBAR.map(item => (
            <button
              key={item.id}
              className={`finder-sidebar-item ${view === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="finder-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="finder-sidebar-divider" />
          <p className="finder-sidebar-section">LINKS</p>
          <a className="finder-sidebar-item" href={person.github} target="_blank" rel="noopener noreferrer">
            <span className="finder-sidebar-icon">🐙</span><span>GitHub</span>
          </a>
          <a className="finder-sidebar-item" href={person.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="finder-sidebar-icon">💼</span><span>LinkedIn</span>
          </a>
          <a className="finder-sidebar-item" href={`mailto:${person.email}`}>
            <span className="finder-sidebar-icon">✉️</span><span>Email</span>
          </a>
        </aside>
      )}

      {/* Main content */}
      <main className="finder-main">
        {/* Header visible in all views */}
        <div className="finder-main-header">
          {isMobile && (
            <button className="finder-mobile-back" onClick={() => setSidebarOpen(true)} style={{ flex: 1, padding: 0, border: 'none', color: 'var(--f-accent)' }}>
              ☰ &nbsp;Menu
            </button>
          )}
        </div>
        
        {view === 'about' && <AboutView />}
        
        {view === 'projects' && (
          <ProjectsView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        )}
        
        {view === 'skills' && <SkillsView />}
        
        {view === 'experience' && (
          <ExperienceView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        )}
        
        {view === 'certificates' && (
          <CertificatesView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        )}
        
        {view === 'github' && (
          <GithubView githubRepos={githubRepos} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        )}
        
        {view === 'leetcode' && <LeetcodeView leetcodeStats={leetcodeStats} />}
      </main>
    </div>
  );
}

import { AvatarUploader } from '../../common/AvatarUploader';

function AboutView() {
  return (
    <div className="finder-view about-view fade-in">
      <div className="about-hero">
        <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={240} readonly={true} />
        <div>
          <h1 className="about-name">{person.name}</h1>
          <p className="about-title">{person.title}</p>
          <p className="about-location">📍 {person.location}</p>
        </div>
      </div>
      <p className="about-bio">{person.bio}</p>
      <div className="about-links">
        <a href={person.github} target="_blank" rel="noopener noreferrer" className="about-link">GitHub</a>
        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="about-link">LinkedIn</a>
        <a href={`mailto:${person.email}`} className="about-link">Email</a>
      </div>
    </div>
  );
}

function ProjectsView({ selectedItem, setSelectedItem }: { selectedItem: string | null, setSelectedItem: (id: string | null) => void }) {
  if (selectedItem) {
    const p = projects.find(proj => proj.id === selectedItem);
    if (!p) return null;
    return (
      <div className="finder-view detail-full-window">
        <div className="detail-header">
          <button className="finder-back-btn" onClick={() => setSelectedItem(null)}>
            ‹ Back to Projects
          </button>
          <div className="detail-header-content">
            <div style={{ background: p.color, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              📁
            </div>
            <div>
              <h1 className="detail-title">{p.title}</h1>
              <span className="detail-subtitle">{p.year} • {p.featured ? '⭐ Featured Project' : 'Project'}</span>
            </div>
          </div>
        </div>
        <div className="detail-body">
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Overview</h2>
          <p className="detail-desc" style={{ fontSize: '15px', marginBottom: '24px' }}>{p.description}</p>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Long Description</h2>
          <p className="detail-desc" style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--f-text-sec)', marginBottom: '24px' }}>{p.longDescription}</p>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Technologies Used</h2>
          <div className="detail-tech" style={{ marginBottom: '24px' }}>
            {p.tech.map(t => <span key={t} className="tech-badge" style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--f-accent)', color: 'white' }}>{t}</span>)}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Links</h2>
          <div className="detail-links">
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="about-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px' }}>
                🐙 GitHub Repository
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="about-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px' }}>
                🌐 View Live Project
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finder-view projects-view">
      <h2 className="view-title">Projects</h2>
      <div className="folders-grid">
        {projects.map(p => (
          <div key={p.id} className="folder-item" onClick={() => setSelectedItem(p.id)}>
            <FolderIcon />
            <span className="folder-label">{p.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsView() {
  const categories = [...new Set(skills.map(s => s.category))];

  const renderSkillIcon = (name: string) => {
    // simple-icons CDN — colored variants: cdn.simpleicons.org/<slug>/<color>
    const sic = 'https://cdn.simpleicons.org';
    // devicons CDN
    const di  = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
    // skillicons.dev
    const si  = 'https://skillicons.dev/icons?i';
    // techstack generator
    const ts  = 'https://techstack-generator.vercel.app';
    // HuggingFace
    const hf  = 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg';

    const base: React.CSSProperties = {
      width: '60px', height: '60px', objectFit: 'contain', borderRadius: '10px',
      filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))',
    };
    const pad = (bg: string): React.CSSProperties => ({ ...base, background: bg, padding: '8px', borderRadius: '14px' });
    const rnd: React.CSSProperties = { ...base, borderRadius: '14px' };

    switch (name) {
      // ── AI/ML Core ───────────────────────────────────────────────────────
      case 'Python':
        return <img src={`${sic}/python/3776AB`} alt={name} style={base} draggable={false} />;
      case 'PyTorch':
        return <img src={`${sic}/pytorch/EE4C2C`} alt={name} style={base} draggable={false} />;
      case 'TensorFlow':
        return <img src={`${sic}/tensorflow/FF6F00`} alt={name} style={base} draggable={false} />;
      case 'Keras':
        return <img src={`${sic}/keras/D00000`} alt={name} style={base} draggable={false} />;
      case 'Scikit-Learn':
        return <img src={`${sic}/scikitlearn/F7931E`} alt={name} style={base} draggable={false} />;
      case 'NumPy':
        return <img src={`${sic}/numpy/013243`} alt={name} style={pad('#E8F4F8')} draggable={false} />;
      case 'Pandas':
        return <img src={`${sic}/pandas/150458`} alt={name} style={pad('#F0EEF7')} draggable={false} />;
      case 'OpenCV':
        return <img src={`${sic}/opencv/5C3EE8`} alt={name} style={base} draggable={false} />;
      case 'XGBoost':
        return <img src={`${di}/python/python-original.svg`} alt={name} style={pad('#3776AB20')} draggable={false} />;

      // ── LLM & Agents ─────────────────────────────────────────────────────
      case 'LangChain':
        return <img src="https://avatars.githubusercontent.com/u/126733545?s=200&v=4" alt={name} style={rnd} draggable={false} />;
      case 'LangGraph':
        return <img src="https://raw.githubusercontent.com/langchain-ai/langgraph/main/docs/static/img/langgraph_logo.png" alt={name} style={rnd} onError={(e)=>{(e.target as HTMLImageElement).src='https://avatars.githubusercontent.com/u/126733545?s=200&v=4'}} draggable={false} />;
      case 'RAG':
        return <img src={`${sic}/elasticsearch/005571`} alt={name} style={base} draggable={false} />;
      case 'HuggingFace':
        return <img src={hf} alt={name} style={pad('#FFD21E')} draggable={false} />;
      case 'Transformers':
        return <img src={hf} alt={name} style={pad('#FF9A00')} draggable={false} />;
      case 'LoRA':
        return <img src={hf} alt={name} style={pad('#FF6B35')} draggable={false} />;
      case 'QLoRA':
        return <img src={hf} alt={name} style={pad('#E05000')} draggable={false} />;
      case 'PEFT':
        return <img src={hf} alt={name} style={pad('#C23B00')} draggable={false} />;
      case 'OpenAI API':
        return <img src={`${sic}/openai/412991`} alt={name} style={pad('#F5F5FF')} draggable={false} />;
      case 'CrewAI':
        return <img src="https://avatars.githubusercontent.com/u/152696222?s=200&v=4" alt={name} style={rnd} draggable={false} />;
      case 'AutoGen':
        return <img src="https://avatars.githubusercontent.com/u/140325000?s=200&v=4" alt={name} style={rnd} draggable={false} />;
      case 'WandB':
        return <img src={`${sic}/weightsandbiases/FFBE00`} alt={name} style={base} draggable={false} />;
      case 'Modal':
        return <img src="https://avatars.githubusercontent.com/u/85974104?s=200&v=4" alt={name} style={rnd} draggable={false} />;
      case 'Ollama':
        return <img src={`${sic}/ollama/ffffff`} alt={name} style={pad('#1C1C1E')} draggable={false} />;
      case 'n8n':
        return <img src={`${sic}/n8n/EA4B71`} alt={name} style={base} draggable={false} />;

      // ── Data Science ──────────────────────────────────────────────────────
      case 'Matplotlib':
        return <img src={`${di}/matplotlib/matplotlib-original.svg`} alt={name} style={base} draggable={false} />;
      case 'Seaborn':
        return <img src={`${sic}/python/3776AB`} alt={name} style={pad('#EEF5FF')} draggable={false} />;
      case 'Plotly':
        return <img src={`${sic}/plotly/3F4F75`} alt={name} style={base} draggable={false} />;
      case 'Jupyter':
        return <img src={`${sic}/jupyter/F37626`} alt={name} style={base} draggable={false} />;

      // ── Frontend ──────────────────────────────────────────────────────────
      case 'JavaScript':
        return <img src={`${sic}/javascript/F7DF1E`} alt={name} style={pad('#FFFDE0')} draggable={false} />;
      case 'TypeScript':
        return <img src={`${sic}/typescript/3178C6`} alt={name} style={base} draggable={false} />;
      case 'React':
        return <img src={`${sic}/react/61DAFB`} alt={name} style={pad('#001B20')} draggable={false} />;
      case 'Next.js':
        return <img src={`${sic}/nextdotjs/ffffff`} alt={name} style={pad('#111')} draggable={false} />;
      case 'Redux':
        return <img src={`${sic}/redux/764ABC`} alt={name} style={base} draggable={false} />;
      case 'Tailwind CSS':
        return <img src={`${sic}/tailwindcss/06B6D4`} alt={name} style={base} draggable={false} />;
      case 'Vite':
        return <img src={`${sic}/vite/646CFF`} alt={name} style={base} draggable={false} />;
      case 'HTML5 / CSS3':
        return <img src={`${sic}/html5/E34F26`} alt={name} style={base} draggable={false} />;

      // ── Backend ───────────────────────────────────────────────────────────
      case 'FastAPI':
        return <img src={`${sic}/fastapi/009688`} alt={name} style={base} draggable={false} />;
      case 'Node.js':
        return <img src={`${sic}/nodedotjs/339933`} alt={name} style={base} draggable={false} />;
      case 'Express.js':
        return <img src={`${sic}/express/ffffff`} alt={name} style={pad('#111')} draggable={false} />;
      case 'Django':
        return <img src={`${sic}/django/092E20`} alt={name} style={pad('#E8F5E9')} draggable={false} />;
      case 'REST APIs':
        return <img src={`${sic}/fastapi/009688`} alt={name} style={{...base, filter:'hue-rotate(120deg)'}} draggable={false} />;
      case 'JWT / OAuth2':
        return <img src={`${sic}/jsonwebtokens/000000`} alt={name} style={pad('#F5F5F5')} draggable={false} />;
      case 'WebSockets':
        return <img src={`${sic}/socketdotio/010101`} alt={name} style={pad('#F5F5F5')} draggable={false} />;
      case 'Pydantic':
        return <img src={`${sic}/pydantic/E92063`} alt={name} style={base} draggable={false} />;
      case 'SQLAlchemy':
        return <img src={`${sic}/sqlalchemy/D71F00`} alt={name} style={base} draggable={false} />;

      // ── Databases ─────────────────────────────────────────────────────────
      case 'PostgreSQL':
        return <img src={`${sic}/postgresql/4169E1`} alt={name} style={base} draggable={false} />;
      case 'MySQL':
        return <img src={`${sic}/mysql/4479A1`} alt={name} style={pad('#EBF3FC')} draggable={false} />;
      case 'MongoDB':
        return <img src={`${sic}/mongodb/47A248`} alt={name} style={base} draggable={false} />;
      case 'Firebase':
        return <img src={`${sic}/firebase/FFCA28`} alt={name} style={pad('#FFF8E1')} draggable={false} />;
      case 'Supabase':
        return <img src={`${sic}/supabase/3ECF8E`} alt={name} style={base} draggable={false} />;
      case 'Redis':
        return <img src={`${sic}/redis/DC382D`} alt={name} style={base} draggable={false} />;
      case 'Pinecone':
        return <img src="https://avatars.githubusercontent.com/u/54333248?s=200&v=4" alt={name} style={rnd} draggable={false} />;
      case 'ChromaDB':
        return <img src="https://avatars.githubusercontent.com/u/132260534?s=200&v=4" alt={name} style={rnd} draggable={false} />;

      // ── Mobile ────────────────────────────────────────────────────────────
      case 'Flutter':
        return <img src={`${sic}/flutter/02569B`} alt={name} style={base} draggable={false} />;
      case 'Dart':
        return <img src={`${sic}/dart/0175C2`} alt={name} style={base} draggable={false} />;

      // ── DevOps & Tools ────────────────────────────────────────────────────
      case 'Git':
        return <img src={`${sic}/git/F05032`} alt={name} style={base} draggable={false} />;
      case 'GitHub':
        return <img src={`${sic}/github/ffffff`} alt={name} style={pad('#1C1C1E')} draggable={false} />;
      case 'Linux':
        return <img src={`${sic}/linux/FCC624`} alt={name} style={pad('#1C1C1E')} draggable={false} />;
      case 'Docker':
        return <img src={`${sic}/docker/2496ED`} alt={name} style={base} draggable={false} />;
      case 'Kubernetes':
        return <img src={`${sic}/kubernetes/326CE5`} alt={name} style={base} draggable={false} />;
      case 'AWS':
        return <img src={`${sic}/amazonwebservices/232F3E`} alt={name} style={pad('#FF9900')} draggable={false} />;
      case 'Notion':
        return <img src={`${sic}/notion/000000`} alt={name} style={pad('#F5F5F5')} draggable={false} />;
      case 'Make.com':
        return <img src={`${sic}/make/6D00CC`} alt={name} style={base} draggable={false} />;
      case 'C':
        return <img src={`${sic}/c/A8B9CC`} alt={name} style={pad('#001B2E')} draggable={false} />;

      default:
        return <img src={`${sic}/python/3776AB`} alt={name} style={base} draggable={false} />;
    }
  };

  const catEmoji: Record<string, string> = {
    'AI/ML': '🤖', 'LLM & Agents': '🧠', 'Data Science': '📊',
    'Frontend': '🌐', 'Backend': '⚙️', 'Databases': '🗄️',
    'Mobile': '📱', 'DevOps & Tools': '🛠️',
  };

  return (
    <div className="finder-view skills-view" style={{ padding: '28px 32px', overflowY: 'auto' }}>
      <h2 className="view-title" style={{ marginBottom: '8px', fontSize: '22px', fontWeight: 700 }}>Skills &amp; Tech Stack</h2>
      <p style={{ color: 'var(--f-text-sec)', marginBottom: '36px', fontSize: '13px' }}>
        From 13 Udemy courses · 19 GitHub repos · {skills.length} technologies
      </p>
      {categories.map(cat => (
        <div key={cat} className="skills-category" style={{ marginBottom: '44px' }}>
          <h3 className="skills-cat-title" style={{
            borderBottom: '1px solid var(--f-border)',
            paddingBottom: '10px', marginBottom: '28px',
            color: 'var(--f-text)', fontSize: '14px',
            fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span>{catEmoji[cat] ?? '📦'}</span> {cat}
          </h3>
          <div className="skills-icon-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '28px' }}>
            {skills.filter(sk => sk.category === cat).map(sk => (
              <div
                key={sk.name}
                className="skill-icon-item"
                title={`${sk.name} — ${sk.level}%`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '10px', width: '88px',
                  transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px) scale(1.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)'; }}
              >
                {renderSkillIcon(sk.name)}
                <span style={{ fontSize: '11.5px', textAlign: 'center', color: 'var(--f-text)', fontWeight: 600, lineHeight: '1.3', width: '100%' }}>
                  {sk.name}
                </span>
                {/* Thin proficiency bar */}
                <div style={{ width: '60px', height: '3px', background: 'var(--f-border)', borderRadius: '2px' }}>
                  <div style={{ width: `${sk.level}%`, height: '100%', background: 'linear-gradient(90deg, #34C759, #30D158)', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


function ExperienceView({ selectedItem, setSelectedItem }: { selectedItem: string | null, setSelectedItem: (id: string | null) => void }) {
  if (selectedItem) {
    const e = experience.find(exp => exp.id === selectedItem);
    if (!e) return null;
    return (
      <div className="finder-view detail-full-window">
        <div className="detail-header">
          <button className="finder-back-btn" onClick={() => setSelectedItem(null)}>
            ‹ Back to Experience
          </button>
          <div className="detail-header-content">
            <div style={{ background: e.color, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              💼
            </div>
            <div>
              <h1 className="detail-title">{e.company}</h1>
              <span className="detail-subtitle">{e.role}</span>
            </div>
          </div>
        </div>
        <div className="detail-body">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', padding: '16px', background: 'var(--f-hover)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📅</span>
              <span style={{ fontSize: '14px', color: 'var(--f-text-sec)' }}>{e.period}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <span style={{ fontSize: '14px', color: 'var(--f-text-sec)' }}>{e.location}</span>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Overview</h2>
          <p className="detail-desc" style={{ fontSize: '15px', marginBottom: '24px' }}>{e.description}</p>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Key Responsibilities & Achievements</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            {e.bullets.map((bullet, i) => (
              <li key={i} style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--f-text-sec)', lineHeight: '1.6' }}>
                {bullet}
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Technologies</h2>
          <div className="detail-tech">
            {e.tech.map(t => (
              <span key={t} className="tech-badge" style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--f-accent)', color: 'white' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finder-view experience-view">
      <h2 className="view-title">Experience</h2>
      <div className="folders-grid">
        {experience.map(e => (
          <div key={e.id} className="folder-item" onClick={() => setSelectedItem(e.id)}>
            <FolderIcon />
            <span className="folder-label">{e.company}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesView({ selectedItem, setSelectedItem }: { selectedItem: string | null, setSelectedItem: (id: string | null) => void }) {
  if (selectedItem) {
    const c = certificates.find(cert => cert.id === selectedItem);
    if (!c) return null;
    return (
      <div className="finder-view detail-full-window">
        <div className="detail-header">
          <button className="finder-back-btn" onClick={() => setSelectedItem(null)}>
            ‹ Back to Certificates
          </button>
          <div className="detail-header-content">
            <div style={{ background: c.color, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              🏆
            </div>
            <div>
              <h1 className="detail-title">{c.title}</h1>
              <span className="detail-subtitle">{c.issuer} • {c.date}</span>
            </div>
          </div>
        </div>
        <div className="detail-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
          {/* Certificate Visual */}
          {c.file ? (
            <div style={{ maxWidth: '800px', width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', background: '#fff' }}>
              {c.file.endsWith('.pdf') ? (
                <iframe src={c.file} style={{ width: '100%', height: '600px', border: 'none' }} title={c.title} />
              ) : (
                <img src={c.file} alt={c.title} style={{ width: '100%', display: 'block' }} />
              )}
            </div>
          ) : (
            <div style={{ maxWidth: '600px', width: '100%', aspectRatio: '1.4', background: '#fff', border: '8px solid #f0f0f0', borderRadius: '4px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, border: `2px solid ${c.color}`, opacity: 0.3 }} />
              <h2 style={{ fontSize: '28px', color: '#1a1a1a', margin: '0 0 16px', fontFamily: 'serif' }}>Certificate of Completion</h2>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>This certifies that</p>
              <h3 style={{ fontSize: '24px', color: '#1a1a1a', borderBottom: '1px solid #ccc', paddingBottom: '8px', width: '80%', margin: '0 0 24px' }}>{person.name}</h3>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>has successfully completed</p>
              <h4 style={{ fontSize: '20px', color: c.color, margin: '0 0 32px', textAlign: 'center' }}>{c.title}</h4>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Issued by: {c.issuer}</p>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Date: {c.date}</p>
              {c.credentialId && <p style={{ color: '#888', fontSize: '12px', marginTop: '16px' }}>Credential ID: {c.credentialId}</p>}
            </div>
          )}

          {/* Certificate Details */}
          <div style={{ width: '100%', maxWidth: '600px', marginTop: '32px', padding: '20px', background: 'var(--f-hover)', borderRadius: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--f-text-sec)', display: 'block' }}>Issued By</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--f-text)' }}>{c.issuer}</span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--f-text-sec)', display: 'block' }}>Issue Date</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--f-text)' }}>{c.date}</span>
              </div>
              {c.credentialId && (
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--f-text-sec)', display: 'block' }}>Credential ID</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--f-text)' }}>{c.credentialId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-links" style={{ marginTop: '24px' }}>
            {c.url && (
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="about-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px' }}>
                🔗 Verify Credential
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finder-view certificates-view">
      <h2 className="view-title">Certificates</h2>
      <div className="folders-grid">
        {certificates.map(c => (
          <div key={c.id} className="folder-item" onClick={() => setSelectedItem(c.id)}>
            <FolderIcon />
            <span className="folder-label">{c.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GithubView({ githubRepos, selectedItem, setSelectedItem }: { githubRepos: any[], selectedItem: string | null, setSelectedItem: (id: string | null) => void }) {
  if (selectedItem) {
    const repo = githubRepos.find(r => r.name === selectedItem);
    if (!repo) return null;
    return (
      <div className="finder-view detail-full-window">
        <div className="detail-header">
          <button className="finder-back-btn" onClick={() => setSelectedItem(null)}>
            ‹ Back to GitHub Repos
          </button>
          <div className="detail-header-content">
            <div style={{ background: repo.color, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              🐙
            </div>
            <div>
              <h1 className="detail-title">{repo.name}</h1>
              <span className="detail-subtitle">⭐ {repo.stars} stars</span>
            </div>
          </div>
        </div>
        <div className="detail-body">
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Description</h2>
          <p className="detail-desc" style={{ fontSize: '15px', marginBottom: '24px' }}>{repo.desc}</p>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', padding: '16px', background: 'var(--f-hover)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>💻</span>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--f-text-sec)', display: 'block' }}>Primary Language</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--f-text)' }}>{repo.lang}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⭐</span>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--f-text-sec)', display: 'block' }}>Stars</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--f-text)' }}>{repo.stars}</span>
              </div>
            </div>
            {repo.updatedAt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📅</span>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--f-text-sec)', display: 'block' }}>Last Updated</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--f-text)' }}>{new Date(repo.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: 'var(--f-text)' }}>Links</h2>
          <div className="detail-links">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="about-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px' }}>
              🐙 View Repository on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finder-view github-view">
      <h2 className="view-title">GitHub Repositories</h2>
      <div className="folders-grid">
        {githubRepos.map(repo => (
          <div key={repo.name} className="folder-item" onClick={() => setSelectedItem(repo.name)}>
            <FolderIcon />
            <span className="folder-label">{repo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Exact Safari-style LeetCode View ported to Finder ────────────────────
function LeetcodeView({ leetcodeStats }: { leetcodeStats: any }) {
  const { totalSolved, easySolved, mediumSolved, hardSolved, ranking, reputation, totalQuestions } = leetcodeStats;
  const total = totalQuestions || 3985;
  const strokeDasharray = 283;
  const solvedPercent = totalSolved / total;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * solvedPercent);

  return (
    <div className="finder-view" style={{ background: '#000', padding: '0', minHeight: '100%', overflow: 'auto' }}>
      <div className="lc-container">
        {/* Sidebar */}
        <div className="lc-sidebar">
          <div className="lc-profile-header">
            <div className="lc-avatar" style={{ background: 'transparent' }}>
              <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={50} readonly={true} />
            </div>
            <div>
              <h1 className="lc-name">Hn6LzKxsM6 <span className="lc-pro-badge"></span></h1>
              <p className="lc-handle">Hn6LzKxsM6</p>
              <p className="lc-rank">Rank <strong>{ranking?.toLocaleString()}</strong></p>
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
    </div>
  );
}
