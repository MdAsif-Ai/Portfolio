import { useState, useEffect, useRef, useCallback } from 'react';
import './Photos.css';

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface GalleryItem {
  filename: string;
  name: string;
  type: 'image' | 'video';
  src: string;
  size: number;
  modified: string;
}

interface GalleryFolder {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: GalleryItem[];
}

type View = 'folders' | 'grid' | 'lightbox';

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── Lightbox ────────────────────────────────────────────────────────────────*/
function Lightbox({ items, index, onClose, onPrev, onNext, onSelect }: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const item = items[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeThumbRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  // Keep active thumbnail centered in filmstrip without scrolling outer document
  useEffect(() => {
    if (activeThumbRef.current && stripRef.current) {
      const thumb = activeThumbRef.current;
      const strip = stripRef.current;
      const thumbLeft = thumb.offsetLeft;
      const thumbWidth = thumb.offsetWidth;
      const stripWidth = strip.offsetWidth;
      strip.scrollTo({
        left: thumbLeft - stripWidth / 2 + thumbWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [index]);

  if (!item) return null;

  return (
    <div className="gallery-lightbox" onClick={onClose}>
      <div className="gallery-lb-toolbar">
        <button className="gallery-lb-close" onClick={onClose}>✕</button>
        <span className="gallery-lb-title">{item.name}</span>
        <span className="gallery-lb-meta">{index + 1} / {items.length} · {formatSize(item.size)}</span>
      </div>

      <div className="gallery-lb-content" onClick={e => e.stopPropagation()}>
        {/* Prev */}
        <button
          className={`gallery-lb-nav gallery-lb-nav--prev ${index === 0 ? 'hidden' : ''}`}
          onClick={e => { e.stopPropagation(); onPrev(); }}
        >‹</button>

        {item.type === 'image' ? (
          <img
            key={item.src}
            src={item.src}
            alt={item.name}
            className="gallery-lb-img"
            draggable={false}
          />
        ) : (
          <video
            key={item.src}
            ref={videoRef}
            src={item.src}
            className="gallery-lb-video"
            controls
            autoPlay
          />
        )}

        {/* Next */}
        <button
          className={`gallery-lb-nav gallery-lb-nav--next ${index === items.length - 1 ? 'hidden' : ''}`}
          onClick={e => { e.stopPropagation(); onNext(); }}
        >›</button>
      </div>

      <div className="gallery-lb-info" onClick={e => e.stopPropagation()}>
        <span className="gallery-lb-badge">{item.type === 'image' ? '📷' : '🎬'} {item.type}</span>
        <span>Modified: {formatDate(item.modified)}</span>
        <span>Size: {formatSize(item.size)}</span>
      </div>

      {/* Filmstrip */}
      {items.length > 1 && (
        <div className="gallery-lb-strip" ref={stripRef} onClick={e => e.stopPropagation()}>
          {items.map((it, i) => (
            <div
              key={it.filename}
              ref={i === index ? activeThumbRef : null}
              className={`gallery-strip-thumb ${i === index ? 'active' : ''}`}
              onClick={e => {
                e.stopPropagation();
                onSelect(i);
              }}
            >
              {it.type === 'image' ? (
                <img src={it.src} alt={it.name} draggable={false} />
              ) : (
                <div className="gallery-strip-video-thumb">🎬</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Grid ────────────────────────────────────────────────────────────────────*/
function GridView({
  folder, onBack, onOpen,
}: {
  folder: GalleryFolder;
  onBack: () => void;
  onOpen: (index: number) => void;
}) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  if (folder.items.length === 0) {
    return (
      <div className="gallery-main">
        <div className="gallery-toolbar">
          <button className="gallery-back-btn" onClick={onBack}>‹ Albums</button>
          <h2 className="gallery-toolbar-title">{folder.icon} {folder.label}</h2>
          <span />
        </div>
        <div className="gallery-empty">
          <div className="gallery-empty-icon">{folder.icon}</div>
          <h3>No {folder.label} yet</h3>
          <p>Drop files into <code>public/gallery/{folder.id}/</code> and restart the dev server.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-main">
      <div className="gallery-toolbar">
        <button className="gallery-back-btn" onClick={onBack}>‹ Albums</button>
        <h2 className="gallery-toolbar-title">{folder.icon} {folder.label}</h2>
        <span className="gallery-toolbar-count">{folder.items.length} {folder.items.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="gallery-grid">
        {folder.items.map((item, i) => (
          <div
            key={item.filename}
            className="gallery-cell"
            onClick={() => onOpen(i)}
            style={{ '--accent': folder.color } as React.CSSProperties}
          >
            {item.type === 'image' ? (
              <>
                {!loaded[item.filename] && <div className="gallery-cell-skeleton" />}
                <img
                  src={item.src}
                  alt={item.name}
                  className="gallery-cell-img"
                  loading="lazy"
                  onLoad={() => setLoaded(l => ({ ...l, [item.filename]: true }))}
                  style={{ opacity: loaded[item.filename] ? 1 : 0 }}
                />
              </>
            ) : (
              <div className="gallery-cell-video-thumb">
                <video src={item.src} muted playsInline className="gallery-cell-img" />
                <div className="gallery-video-play">▶</div>
              </div>
            )}
            <div className="gallery-cell-overlay">
              <span className="gallery-cell-name">{item.name}</span>
              {item.type === 'video' && <span className="gallery-cell-badge">🎬</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Folder Cards ─────────────────────────────────────────────────────────────*/
function FolderView({ folders, onOpen }: { folders: GalleryFolder[]; onOpen: (id: string) => void }) {
  const total = folders.reduce((s, f) => s + f.items.length, 0);

  return (
    <div className="gallery-main">
      <div className="gallery-toolbar">
        <h2 className="gallery-toolbar-title" style={{ paddingLeft: 0 }}>My Library</h2>
        <span className="gallery-toolbar-count">{total} total items</span>
      </div>

      <div className="gallery-albums">
        {folders.map(folder => (
          <div
            key={folder.id}
            className="gallery-album-card"
            onClick={() => onOpen(folder.id)}
            style={{ '--accent': folder.color } as React.CSSProperties}
          >
            <div className="gallery-album-thumb">
              {folder.items.length > 0 ? (
                <div className="gallery-album-preview">
                  {folder.items.slice(0, 4).map((item, i) => (
                    <div key={item.filename} className="gallery-album-preview-cell" style={{ '--i': i } as React.CSSProperties}>
                      {item.type === 'image' ? (
                        <img src={item.src} alt={item.name} />
                      ) : (
                        <div className="gallery-album-video-cell">🎬</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gallery-album-empty-thumb">
                  <span className="gallery-album-thumb-icon">{folder.icon}</span>
                </div>
              )}
              <div className="gallery-album-thumb-overlay" />
            </div>
            <div className="gallery-album-info">
              <span className="gallery-album-label">{folder.label}</span>
              <span className="gallery-album-count">{folder.items.length} {folder.items.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* All photos flat view hint */}
      <div className="gallery-section-header">
        <span>Recent — All Folders</span>
      </div>
      <div className="gallery-grid gallery-grid--small">
        {folders.flatMap(f => f.items).slice(0, 12).map((item) => (
          <div key={item.filename} className="gallery-cell gallery-cell--small">
            {item.type === 'image' ? (
              <img src={item.src} alt={item.name} className="gallery-cell-img" loading="lazy" />
            ) : (
              <div className="gallery-cell-video-thumb">
                <div className="gallery-video-play" style={{ fontSize: 18 }}>▶</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Root Component ───────────────────────────────────────────────────────────*/
export function Photos() {
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const [activeFolder, setActiveFolder] = useState<GalleryFolder | null>(null);
  const [lightboxIdx, setLightboxIdx]   = useState<number | null>(null);
  const [sidebarFolder, setSidebarFolder] = useState<string>('__all__');

  // Fetch manifest
  useEffect(() => {
    fetch('/gallery/manifest.json', { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: GalleryFolder[]) => { setFolders(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const openFolder = useCallback((id: string) => {
    const f = folders.find(f => f.id === id) ?? null;
    setActiveFolder(f);
    setSidebarFolder(id);
    setLightboxIdx(null);
  }, [folders]);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevItem = useCallback(() => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const nextItem = useCallback(() => {
    setLightboxIdx(i => i !== null && activeFolder && i < activeFolder.items.length - 1 ? i + 1 : i);
  }, [activeFolder]);

  // Sidebar all-folders mode
  const displayedFolder = sidebarFolder === '__all__' ? null : activeFolder;

  if (loading) return (
    <div className="gallery-app">
      <div className="gallery-loading">
        <div className="gallery-spinner" />
        <p>Loading gallery…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="gallery-app">
      <div className="gallery-error">
        <span>⚠️</span>
        <p>Could not load gallery. Make sure <code>public/gallery/manifest.json</code> exists.</p>
        <small>{error}</small>
      </div>
    </div>
  );

  return (
    <div className="gallery-app">
      {/* Sidebar */}
      <aside className="gallery-sidebar">
        <p className="gallery-sidebar-header">Library</p>

        <button
          className={`gallery-nav-btn ${sidebarFolder === '__all__' ? 'active' : ''}`}
          onClick={() => { setSidebarFolder('__all__'); setActiveFolder(null); setLightboxIdx(null); }}
        >
          <span className="gallery-nav-icon">🖼️</span>
          <span>All Photos</span>
          <span className="gallery-nav-count">{folders.reduce((s, f) => s + f.items.length, 0)}</span>
        </button>

        <p className="gallery-sidebar-header" style={{ marginTop: 12 }}>Albums</p>

        {folders.map(f => (
          <button
            key={f.id}
            className={`gallery-nav-btn ${sidebarFolder === f.id ? 'active' : ''}`}
            onClick={() => openFolder(f.id)}
          >
            <span className="gallery-nav-icon">{f.icon}</span>
            <span>{f.label}</span>
            <span className="gallery-nav-count">{f.items.length}</span>
          </button>
        ))}
      </aside>

      {/* Main content */}
      {lightboxIdx !== null && activeFolder ? (
        <Lightbox
          items={activeFolder.items}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
          onSelect={idx => setLightboxIdx(idx)}
        />
      ) : activeFolder ? (
        <GridView
          folder={activeFolder}
          onBack={() => { setActiveFolder(null); setSidebarFolder('__all__'); }}
          onOpen={idx => setLightboxIdx(idx)}
        />
      ) : (
        <FolderView folders={folders} onOpen={openFolder} />
      )}
    </div>
  );
}
