import { useEffect, useRef, useState } from 'react';
import './ActivityMonitor.css';

interface Process { name: string; cpu: number; mem: number; pid: number; status: string; }

const INITIAL_PROCS: Process[] = [
  // AI/ML Core
  { name: 'Python 🐍',                        cpu: 96.0, mem: 8192, pid: 1001, status: 'running' },
  { name: 'PyTorch 🔥',                       cpu: 88.0, mem: 6144, pid: 1002, status: 'running' },
  { name: 'TensorFlow / Keras',               cpu: 84.0, mem: 5120, pid: 1003, status: 'running' },
  { name: 'Scikit-Learn',                     cpu: 86.0, mem: 3072, pid: 1004, status: 'running' },
  { name: 'NumPy / Pandas 📊',                cpu: 88.0, mem: 4096, pid: 1005, status: 'running' },
  // LLM & Agents
  { name: 'LangChain / LangGraph 🦜',         cpu: 90.0, mem: 5120, pid: 1006, status: 'running' },
  { name: 'RAG Systems 🔍',                   cpu: 92.0, mem: 6144, pid: 1007, status: 'running' },
  { name: 'HuggingFace Transformers 🤗',      cpu: 87.0, mem: 4096, pid: 1008, status: 'running' },
  { name: 'LoRA / QLoRA / PEFT',              cpu: 84.0, mem: 3072, pid: 1009, status: 'running' },
  { name: 'OpenAI / Claude / Gemini API',     cpu: 90.0, mem: 2048, pid: 1010, status: 'running' },
  { name: 'CrewAI / AutoGen / n8n',           cpu: 85.0, mem: 3072, pid: 1011, status: 'running' },
  { name: 'WandB / Modal',                    cpu: 80.0, mem: 2048, pid: 1012, status: 'running' },
  // Frontend
  { name: 'React / Next.js ⚛️',               cpu: 85.0, mem: 2048, pid: 1013, status: 'running' },
  { name: 'JavaScript / TypeScript',          cpu: 88.0, mem: 1536, pid: 1014, status: 'running' },
  { name: 'Redux / Zustand',                  cpu: 80.0, mem: 1024, pid: 1015, status: 'running' },
  // Backend
  { name: 'FastAPI (Python) ⚡',               cpu: 90.0, mem: 2048, pid: 1016, status: 'running' },
  { name: 'Node.js / Express.js',             cpu: 85.0, mem: 1536, pid: 1017, status: 'running' },
  { name: 'Django / DRF 🐍',                  cpu: 80.0, mem: 1280, pid: 1018, status: 'sleeping'},
  { name: 'Flutter / Dart 📱',                cpu: 78.0, mem: 1024, pid: 1019, status: 'sleeping'},
  // Databases
  { name: 'PostgreSQL / MySQL 🐘',            cpu: 84.0, mem: 1536, pid: 1020, status: 'running' },
  { name: 'MongoDB / Redis',                  cpu: 80.0, mem: 1024, pid: 1021, status: 'running' },
  { name: 'Firebase / Supabase 🔥',           cpu: 80.0, mem: 1024, pid: 1022, status: 'sleeping'},
  { name: 'Vector DBs (Pinecone/Qdrant)',      cpu: 85.0, mem: 2048, pid: 1023, status: 'running' },
  // DevOps & Tools
  { name: 'Git / GitHub / Linux 🐧',          cpu: 90.0, mem: 512,  pid: 1024, status: 'running' },
  { name: 'Docker / Kubernetes / AWS ☁️',      cpu: 80.0, mem: 2048, pid: 1025, status: 'running' },
];

// Generate sparkline points (mini CPU graph)
function genSparkline(points: number[]) {
  const h = 32, w = 80;
  const max = Math.max(...points, 1);
  return points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / max) * h;
    return `${x},${y}`;
  }).join(' ');
}

type Tab = 'CPU' | 'Memory' | 'Network' | 'Disk';

export function ActivityMonitor() {
  const [procs, setProcs]   = useState<Process[]>(INITIAL_PROCS);
  const [tab,   setTab]     = useState<Tab>('CPU');
  const [cpuHistory, setCpuHistory]   = useState<number[]>(Array(30).fill(20));
  const [memHistory, setMemHistory]   = useState<number[]>(Array(30).fill(40));
  const [netHistory, setNetHistory]   = useState<number[]>(Array(30).fill(10));
  const [sortBy, setSortBy] = useState<'cpu'|'mem'>('cpu');

  useEffect(() => {
    const interval = setInterval(() => {
      setProcs(p => p.map(proc => ({
        ...proc,
        cpu: Math.max(0.1, Math.min(99, proc.cpu + (Math.random() - 0.48) * 6)),
        mem: Math.max(32,  Math.min(4096, proc.mem + (Math.random() - 0.5) * 20)),
      })).sort((a, b) => sortBy === 'cpu' ? b.cpu - a.cpu : b.mem - a.mem));

      setCpuHistory(h => {
        const val = 15 + Math.random() * 45;
        return [...h.slice(1), val];
      });
      setMemHistory(h => {
        const val = 35 + Math.random() * 30;
        return [...h.slice(1), val];
      });
      setNetHistory(h => {
        const val = Math.random() * 80;
        return [...h.slice(1), val];
      });
    }, 800);
    return () => clearInterval(interval);
  }, [sortBy]);

  const avgCPU = procs.reduce((s,p)=>s+p.cpu,0)/procs.length;
  const totalMem = procs.reduce((s,p)=>s+p.mem,0);
  const latestNet = netHistory[netHistory.length-1];

  return (
    <div className="am-app">
      {/* Tab bar */}
      <div className="am-tabs">
        {(['CPU','Memory','Network','Disk'] as Tab[]).map(t => (
          <button key={t} className={`am-tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="am-summary-row">
        <div className="am-card am-card--cpu">
          <span className="am-card-val" style={{color: '#34C759'}}>
            {avgCPU.toFixed(1)}%
          </span>
          <svg className="am-sparkline" viewBox="0 0 80 32" preserveAspectRatio="none">
            <polyline points={genSparkline(cpuHistory)} fill="none" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="am-card am-card--mem">
          <span className="am-card-label">Memory</span>
          <span className="am-card-val">{(totalMem/1024).toFixed(1)} GB</span>
          <svg className="am-sparkline" viewBox="0 0 80 32" preserveAspectRatio="none">
            <polyline points={genSparkline(memHistory)} fill="none" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="am-card am-card--net">
          <span className="am-card-label">Network In</span>
          <span className="am-card-val">{latestNet.toFixed(1)} MB/s</span>
          <svg className="am-sparkline" viewBox="0 0 80 32" preserveAspectRatio="none">
            <polyline points={genSparkline(netHistory)} fill="none" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="am-card">
          <span className="am-card-label">Processes</span>
          <span className="am-card-val">{procs.length}</span>
          <span className="am-card-sub">{procs.filter(p=>p.status==='running').length} running</span>
        </div>
      </div>

      {/* Big graph */}
      <div className="am-graph-wrap">
        <div className="am-graph-header">
          <span className="am-graph-title">
            {tab === 'CPU' ? `CPU — ${avgCPU.toFixed(1)}%` : tab === 'Memory' ? 'Memory Usage' : tab === 'Network' ? 'Network Activity' : 'Disk I/O'}
          </span>
          <span className="am-graph-range">Last 60s</span>
        </div>
        <svg className="am-graph" viewBox="0 0 400 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cpu-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34C759" stopOpacity=".35"/>
              <stop offset="100%" stopColor="#34C759" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0,25,50,75,100].map(pct => (
            <line key={pct} x1="0" y1={80-(pct/100*80)} x2="400" y2={80-(pct/100*80)} stroke="rgba(255,255,255,.06)" strokeWidth="1"/>
          ))}
          {/* Area */}
          <polygon
            points={[
              ...(tab==='CPU'?cpuHistory:tab==='Memory'?memHistory:netHistory).map((v,i)=>`${(i/29)*400},${80-(v/100*80)}`),
              `400,80`, `0,80`
            ].join(' ')}
            fill="url(#cpu-grad)"
          />
          {/* Line */}
          <polyline
            points={(tab==='CPU'?cpuHistory:tab==='Memory'?memHistory:netHistory).map((v,i)=>`${(i/29)*400},${80-(v/100*80)}`).join(' ')}
            fill="none"
            stroke="#34C759"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Process table */}
      <div className="am-table-wrap">
        <table className="am-table">
          <thead>
            <tr>
              <th>Skill / Technology</th>
              <th>PID</th>
              <th className="am-th-sort" onClick={()=>setSortBy('cpu')}>
                CPU% {sortBy==='cpu'&&'▾'}
              </th>
              <th className="am-th-sort" onClick={()=>setSortBy('mem')}>
                Memory {sortBy==='mem'&&'▾'}
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {procs.map(p => (
              <tr key={p.pid}>
                <td className="am-proc-name">{p.name}</td>
                <td className="am-muted">{p.pid}</td>
                <td>
                  <div className="am-cpu-cell">
                    <span style={{color: '#34C759', fontVariantNumeric:'tabular-nums'}}>
                      {p.cpu.toFixed(1)}
                    </span>
                    <div className="am-mini-bar">
                      <div style={{width:`${Math.min(100,p.cpu)}%`, background: '#34C759'}}/>
                    </div>
                  </div>
                </td>
                <td className="am-muted">{p.mem >= 1024 ? `${(p.mem/1024).toFixed(1)} GB` : `${Math.round(p.mem)} MB`}</td>
                <td>
                  <span className={`am-status ${p.status}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
