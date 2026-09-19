import { useState, useRef, useEffect } from 'react';
import './Music.css';

interface Track {
  id: number;
  title: string;      // skill name
  artist: string;     // course or source
  album: string;      // category
  duration: number;   // proficiency as seconds (e.g. 96% = 576 sec = 9:36)
  color: string;
  emoji: string;
  level: number;      // 0-100
}

const TRACKS: Track[] = [
  // AI/ML — from Udemy courses + GitHub
  { id:1,  title:'Python',               artist:'Jose Portilla / Andrei Neagoie', album:'AI / ML',    duration:576, color:'#3776AB', emoji:'🐍', level:96 },
  { id:2,  title:'PyTorch',              artist:'ZTM / LLM Engineering',          album:'AI / ML',    duration:528, color:'#EE4C2C', emoji:'🔥', level:88 },
  { id:3,  title:'TensorFlow / Keras',   artist:'ML A-Z / ZTM Bootcamp',          album:'AI / ML',    duration:504, color:'#FF6F00', emoji:'🧠', level:84 },
  { id:4,  title:'Scikit-Learn',         artist:'ML A-Z / Data Science',          album:'AI / ML',    duration:516, color:'#F7931E', emoji:'📊', level:86 },
  { id:5,  title:'NumPy / Pandas',       artist:'Multiple Udemy Courses',         album:'AI / ML',    duration:528, color:'#013243', emoji:'📈', level:88 },
  { id:6,  title:'LangChain / LangGraph',artist:'LLM Engineering / Agentic AI',  album:'AI / ML',    duration:540, color:'#1C3C5A', emoji:'🦜', level:90 },
  { id:7,  title:'RAG Systems',          artist:'LLM Engineering / Agentic AI',  album:'AI / ML',    duration:552, color:'#7C3AED', emoji:'🔍', level:92 },
  { id:8,  title:'HuggingFace Transformers', artist:'LLM Engineering',           album:'AI / ML',    duration:522, color:'#FFD21E', emoji:'🤗', level:87 },
  { id:9,  title:'LoRA / QLoRA / PEFT',  artist:'LLM Engineering',               album:'AI / ML',    duration:504, color:'#FF6B35', emoji:'⚡', level:84 },
  { id:10, title:'OpenAI / Claude / Gemini', artist:'LLM Eng / Agentic AI',      album:'AI / ML',    duration:540, color:'#10A37F', emoji:'🤖', level:90 },
  { id:11, title:'CrewAI / AutoGen',     artist:'Agentic AI Engineering',         album:'AI / ML',    duration:510, color:'#E74C3C', emoji:'🤝', level:85 },
  { id:12, title:'WandB / Modal',        artist:'LLM Engineering',               album:'AI / ML',    duration:480, color:'#FFBE00', emoji:'📉', level:80 },
  { id:13, title:'n8n / MCP Protocol',   artist:'Agentic AI Engineering',        album:'AI / ML',    duration:465, color:'#EA4B71', emoji:'🔗', level:78 },
  { id:14, title:'Computer Vision / YOLO',artist:'ML A-Z / GitHub',             album:'AI / ML',    duration:480, color:'#00B4D8', emoji:'👁️', level:80 },
  { id:15, title:'NLP / Sentiment Analysis',artist:'ML A-Z / PYML',             album:'AI / ML',    duration:492, color:'#06D6A0', emoji:'💬', level:82 },
  // Frontend
  { id:16, title:'JavaScript (ES6+)',    artist:'Jonas Schmedtmann',             album:'Frontend',   duration:528, color:'#F7DF1E', emoji:'🟨', level:88 },
  { id:17, title:'React.js',             artist:'Jonas Schmedtmann',             album:'Frontend',   duration:510, color:'#61DAFB', emoji:'⚛️', level:85 },
  { id:18, title:'Next.js',              artist:'Jonas Schmedtmann / GitHub',    album:'Frontend',   duration:492, color:'#FFFFFF', emoji:'▲', level:82 },
  { id:19, title:'Redux / Zustand',      artist:'Jonas Schmedtmann',             album:'Frontend',   duration:480, color:'#764ABC', emoji:'🔄', level:80 },
  { id:20, title:'TypeScript',           artist:'GitHub Projects',               album:'Frontend',   duration:492, color:'#3178C6', emoji:'🔷', level:82 },
  { id:21, title:'Tailwind CSS',         artist:'React Course',                  album:'Frontend',   duration:480, color:'#38BDF8', emoji:'🎨', level:80 },
  // Backend
  { id:22, title:'FastAPI',              artist:'Eric Roby / Brandon Dedolph',   album:'Backend',    duration:540, color:'#009688', emoji:'⚡', level:90 },
  { id:23, title:'Node.js / Express',    artist:'Jonas Schmedtmann',             album:'Backend',    duration:510, color:'#68A063', emoji:'🟢', level:85 },
  { id:24, title:'Django / DRF',         artist:'Jose Portilla',                 album:'Backend',    duration:480, color:'#092E20', emoji:'🎸', level:80 },
  { id:25, title:'Flutter / Dart',       artist:'Maximilian Schwarzmüller',      album:'Mobile',     duration:468, color:'#54C5F8', emoji:'📱', level:78 },
  // Databases
  { id:26, title:'PostgreSQL',           artist:'Jose Portilla',                 album:'Databases',  duration:504, color:'#336791', emoji:'🐘', level:84 },
  { id:27, title:'MySQL',                artist:'Complete SQL Bootcamp',         album:'Databases',  duration:492, color:'#4479A1', emoji:'🗄️', level:82 },
  { id:28, title:'MongoDB',              artist:'Jonas Schmedtmann',             album:'Databases',  duration:480, color:'#47A248', emoji:'🍃', level:80 },
  { id:29, title:'Firebase / Supabase',  artist:'Flutter Course / GitHub',       album:'Databases',  duration:480, color:'#FFA000', emoji:'🔥', level:80 },
  { id:30, title:'Redis',                artist:'Node.js / LLM Courses',        album:'Databases',  duration:480, color:'#DC382D', emoji:'⚡', level:80 },
  // Tools
  { id:31, title:'Git / GitHub',         artist:'Colt Steele',                   album:'Tools',      duration:540, color:'#F05032', emoji:'🐙', level:90 },
  { id:32, title:'Linux',                artist:'Multiple Courses + GitHub',     album:'Tools',      duration:480, color:'#FCC624', emoji:'🐧', level:80 },
  { id:33, title:'Docker / Kubernetes',  artist:'ML A-Z / Agentic AI',          album:'Tools',      duration:480, color:'#2496ED', emoji:'🐳', level:80 },
  { id:34, title:'Notion / Make.com',    artist:'Personal Workflow',             album:'Tools',      duration:450, color:'#000000', emoji:'📋', level:78 },
];

const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

export function Music() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing,    setPlaying]    = useState(true);
  const [progress,   setProgress]   = useState(0);
  const [volume,     setVolume]     = useState(75);
  const [shuffle,    setShuffle]    = useState(false);
  const [repeat,     setRepeat]     = useState(false);
  const [sideNav,    setSideNav]    = useState('Songs');
  const [filterAlbum, setFilterAlbum] = useState('All');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vinylRef    = useRef<HTMLDivElement>(null);

  const albums = ['All', ...Array.from(new Set(TRACKS.map(t => t.album)))];
  const filteredTracks = filterAlbum === 'All' ? TRACKS : TRACKS.filter(t => t.album === filterAlbum);

  const track = TRACKS[currentIdx] || TRACKS[0];
  const elapsed = track.duration ? Math.round((progress / 100) * track.duration) : 0;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setCurrentIdx(i => (i + 1) % TRACKS.length);
            return 0;
          }
          return p + (100 / track.duration) * 0.2;
        });
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, track.duration]);

  useEffect(() => {
    if (vinylRef.current) {
      vinylRef.current.style.animationPlayState = playing ? 'running' : 'paused';
    }
  }, [playing]);

  const prev = () => { setCurrentIdx(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };
  const next = () => { setCurrentIdx(i => (i + 1) % TRACKS.length); setProgress(0); };
  const pickTrack = (i: number) => { setCurrentIdx(i); setProgress(0); setPlaying(true); };

  return (
    <div className="music-app">
      {/* Sidebar */}
      <aside className="music-sidebar">
        <p className="music-sidebar-header">Library</p>
        {['Songs','Artists','Albums','Playlists','Recently Added'].map(item => (
          <button
            key={item}
            className={`music-nav-item ${sideNav === item ? 'active' : ''}`}
            onClick={() => setSideNav(item)}
          >
            {item === 'Songs' ? '🎵' : item === 'Artists' ? '👤' : item === 'Albums' ? '💿' : item === 'Playlists' ? '📋' : '🕐'}&nbsp; {item}
          </button>
        ))}
        <div className="music-sidebar-divider" />
        <p className="music-sidebar-header">Categories</p>
        {albums.map(alb => (
          <button
            key={alb}
            className={`music-nav-item ${filterAlbum === alb ? 'active' : ''}`}
            onClick={() => setFilterAlbum(alb)}
          >
            {alb === 'AI / ML' ? '🧠' : alb === 'Frontend' ? '🌐' : alb === 'Backend' ? '⚙️' : alb === 'Databases' ? '🗄️' : alb === 'Mobile' ? '📱' : alb === 'Tools' ? '🛠️' : '🎵'}&nbsp; {alb}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="music-main">
        {/* Now Playing hero */}
        <div className="music-hero" style={{ '--track-color': track.color } as React.CSSProperties}>
          <div className="music-vinyl-wrap">
            <div className="music-vinyl" ref={vinylRef} style={{ '--vinyl-color': track.color } as React.CSSProperties}>
              <span className="music-vinyl-emoji">{track.emoji}</span>
            </div>
          </div>

          <div className="music-controls-panel">
            <div className="music-track-info">
              <h2 className="music-track-title">{track.title}</h2>
              <p className="music-track-artist">{track.artist} — {track.album}</p>
              {/* Proficiency bar */}
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'8px' }}>
                <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)' }}>Proficiency</span>
                <div style={{ flex:1, height:'4px', background:'rgba(255,255,255,0.1)', borderRadius:'2px' }}>
                  <div style={{ width:`${track.level}%`, height:'100%', background: track.color, borderRadius:'2px', transition:'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)', fontWeight:600 }}>{track.level}%</span>
              </div>
            </div>

            <div className="music-progress-wrap">
              <span className="music-time">{fmt(elapsed)}</span>
              <div
                className="music-progress-track"
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div className="music-progress-fill" style={{ width: `${progress}%`, background: track.color }} />
                <div className="music-progress-thumb" style={{ left: `${progress}%`, background: track.color }} />
              </div>
              <span className="music-time">{fmt(track.duration)}</span>
            </div>

            <div className="music-btns">
              <button className={`music-ctrl-btn music-ctrl-small${shuffle?' active':''}`} onClick={()=>setShuffle(s=>!s)} title="Shuffle">⇀⇁</button>
              <button className="music-ctrl-btn" onClick={prev} title="Previous">⏮</button>
              <button
                className="music-ctrl-btn music-ctrl-play"
                onClick={() => setPlaying(p => !p)}
                style={{ background: track.color }}
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? '⏸' : '▶'}
              </button>
              <button className="music-ctrl-btn" onClick={next} title="Next">⏭</button>
              <button className={`music-ctrl-btn music-ctrl-small${repeat?' active':''}`} onClick={()=>setRepeat(r=>!r)} title="Repeat">↻</button>
            </div>

            <div className="music-volume-row">
              <span>🔈</span>
              <input
                type="range" min="0" max="100" value={volume}
                className="music-volume-slider"
                onChange={e => setVolume(Number(e.target.value))}
              />
              <span>🔊</span>
            </div>
          </div>
        </div>

        {/* Track list */}
        <div className="music-tracklist">
          <div className="music-tracklist-header">
            <span>#</span><span>Skill</span><span>Source / Course</span><span>Category</span><span>Level</span>
          </div>
          {filteredTracks.map((t, i) => {
            const globalIdx = TRACKS.findIndex(tr => tr.id === t.id);
            return (
              <div
                key={t.id}
                className={`music-track-row ${globalIdx === currentIdx ? 'playing' : ''}`}
                onDoubleClick={() => pickTrack(globalIdx)}
                onClick={() => pickTrack(globalIdx)}
              >
                <span className="music-track-num">
                  {globalIdx === currentIdx && playing ? <span className="music-equalizer"><span/><span/><span/></span> : i + 1}
                </span>
                <div className="music-track-title-col">
                  <span style={{ marginRight:'6px' }}>{t.emoji}</span>
                  <span className="music-track-name">{t.title}</span>
                </div>
                <span className="music-track-artist-col">{t.artist}</span>
                <span className="music-track-album-col">{t.album}</span>
                <span className="music-track-dur" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)' }}>{t.level}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
