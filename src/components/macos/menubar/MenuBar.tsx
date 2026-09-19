import { useState, useRef, useEffect } from 'react';
import { useLiveClock } from '../../../hooks/useLiveClock';
import { useWindowStore } from '../../../store/windowStore';
import { useThemeStore } from '../../../store/themeStore';
import './MenuBar.css';

interface MenuBarProps {
  appName?: string;
}

const APP_MENUS: Record<string, string[]> = {
  Finder:          ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  Safari:          ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  Mail:            ['File', 'Edit', 'View', 'Mailbox', 'Message', 'Window', 'Help'],
  Music:           ['Music', 'File', 'Edit', 'Song', 'Controls', 'Account', 'Window', 'Help'],
  Terminal:        ['Shell', 'Edit', 'View', 'Window', 'Help'],
  'Activity Monitor': ['File', 'Edit', 'View', 'Window', 'Help'],
  Calendar:        ['File', 'Edit', 'View', 'Calendar', 'Window', 'Help'],
  'System Settings':['System Settings', 'Edit', 'View', 'Window', 'Help'],
  Photos:          ['Photos', 'File', 'Edit', 'Image', 'View', 'Window', 'Help'],
};

const APPLE_MENU = [
  { label: 'About This Mac',    icon: '' },
  { divider: true },
  { label: 'System Settings…', icon: '⚙️' },
  { label: 'App Store…',       icon: '🛍️' },
  { divider: true },
  { label: 'Recent Items',     icon: '🕐' },
  { divider: true },
  { label: 'Force Quit…',      icon: '⚡' },
  { divider: true },
  { label: 'Sleep',            icon: '💤' },
  { label: 'Restart…',        icon: '🔄' },
  { label: 'Shut Down…',      icon: '⏻' },
  { divider: true },
  { label: 'Lock Screen',      icon: '🔒' },
];

export function MenuBar({ appName = 'Finder' }: MenuBarProps) {
  const { time, date } = useLiveClock();
  const { openWindow } = useWindowStore();
  const { theme, toggleTheme } = useThemeStore();

  const [appleOpen, setAppleOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const appleRef  = useRef<HTMLDivElement>(null);
  const spotInput = useRef<HTMLInputElement>(null);

  const menus = APP_MENUS[appName] ?? APP_MENUS['Finder'];

  /* Close apple menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (appleRef.current && !appleRef.current.contains(e.target as Node)) {
        setAppleOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Focus spotlight input when opened */
  useEffect(() => {
    if (spotlightOpen) spotInput.current?.focus();
  }, [spotlightOpen]);

  /* Keyboard shortcut: Cmd+Space */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setSpotlightOpen(s => !s);
        setSpotlightQuery('');
      }
      if (e.key === 'Escape') { setSpotlightOpen(false); setAppleOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const SPOTLIGHT_APPS = [
    { label:'Finder',           id:'finder'          as const },
    { label:'Safari',           id:'safari'          as const },
    { label:'Terminal',         id:'terminal'        as const },
    { label:'Music',            id:'music'           as const },
    { label:'Mail',             id:'mail'            as const },
    { label:'Calendar',         id:'calendar'        as const },
    { label:'Photos',           id:'photos'          as const },
    { label:'Activity Monitor', id:'activitymonitor' as const },
    { label:'System Settings',  id:'settings'        as const },
  ];

  const filteredApps = spotlightQuery.length > 0
    ? SPOTLIGHT_APPS.filter(a => a.label.toLowerCase().includes(spotlightQuery.toLowerCase()))
    : [];

  return (
    <>
      <div className="menubar">
        {/* Left */}
        <div className="menubar-left">
          {/* Apple logo + dropdown */}
          <div className="menubar-apple-wrap" ref={appleRef}>
            <button
              className="menubar-apple" 
              aria-label="Apple menu"
              onClick={() => setAppleOpen(o => !o)}
            >
              <img
                src="/img/icons/apple-logo.svg"
                alt="Apple"
                style={{ 
                  width: '15px', 
                  height: '18px', 
                  objectFit: 'contain', 
                  display: 'block' 
                }}
                draggable={false}
              />
            </button>

            {appleOpen && (
              <div className="menubar-dropdown">
                {APPLE_MENU.map((item, i) =>
                  'divider' in item ? (
                    <div key={i} className="menubar-dropdown-sep" />
                  ) : (
                    <button
                      key={i}
                      className="menubar-dropdown-item"
                      onClick={() => {
                        setAppleOpen(false);
                        if (item.label === 'System Settings…') openWindow('settings');
                      }}
                    >
                      {item.icon && <span className="menubar-dropdown-icon">{item.icon}</span>}
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <span className="menubar-app-name">{appName}</span>
          {menus.map(m => (
            <button key={m} className="menubar-menu-item">{m}</button>
          ))}
        </div>

        {/* Right */}
        <div className="menubar-right">
          {/* Flashlight Theme Toggle */}
          <button 
            className="menubar-status-icon" 
            aria-label="Toggle Theme" 
            title={`Toggle Theme (Current: ${theme})`}
            onClick={toggleTheme}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flashlight">
                <path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z"/>
                <line x1="6" x2="18" y1="6" y2="6"/>
                <line x1="12" x2="12" y1="12" y2="12"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flashlight-off">
                <path d="M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4"/>
                <path d="M7 2h11v4c0 2-2 2-2 4v1"/>
                <line x1="11" x2="18" y1="6" y2="6"/>
                <line x1="2" x2="22" y1="2" y2="22"/>
              </svg>
            )}
          </button>

          {/* Control Center icons */}
          <button className="menubar-status-icon" aria-label="WiFi" title="Wi-Fi">
            <svg width="16" height="12" viewBox="0 0 20 15" fill="currentColor">
              <path d="M10 13l2-2a2.8 2.8 0 00-4 0l2 2z"/>
              <path d="M10 10l4-4a5.7 5.7 0 00-8 0l4 4z" fillOpacity="0.75"/>
              <path d="M10 7l6-6a8.5 8.5 0 00-12 0l6 6z" fillOpacity="0.45"/>
            </svg>
          </button>
          <button className="menubar-status-icon" aria-label="Battery" title="Battery: 87%">
            <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
              <rect x="0" y="1" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <rect x="18.5" y="3.5" width="2" height="4" rx="1" fillOpacity="0.5"/>
              <rect x="1.5" y="2.5" width="14" height="6" rx="1"/>
            </svg>
          </button>

          {/* Spotlight */}
          <button
            className="menubar-status-icon"
            aria-label="Spotlight"
            title="Spotlight Search (Ctrl+Space)"
            onClick={() => { setSpotlightOpen(s=>!s); setSpotlightQuery(''); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5"/>
              <line x1="15.5" y1="15.5" x2="21" y2="21"/>
            </svg>
          </button>

          {/* Clock */}
          <span className="menubar-clock" title={date}>{time}</span>
        </div>
      </div>

      {/* ── Spotlight overlay ──────────────────────────────────────────────── */}
      {spotlightOpen && (
        <div className="spotlight-overlay" onClick={() => setSpotlightOpen(false)}>
          <div className="spotlight-modal" onClick={e => e.stopPropagation()}>
            <div className="spotlight-search-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round">
                <circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/>
              </svg>
              <input
                ref={spotInput}
                className="spotlight-input"
                value={spotlightQuery}
                onChange={e => setSpotlightQuery(e.target.value)}
                placeholder="Spotlight Search"
              />
              {spotlightQuery && (
                <button className="spotlight-clear" onClick={() => setSpotlightQuery('')}>✕</button>
              )}
            </div>

            {filteredApps.length > 0 && (
              <div className="spotlight-results">
                <p className="spotlight-results-header">Applications</p>
                {filteredApps.map(app => (
                  <button
                    key={app.id}
                    className="spotlight-result-item"
                    onClick={() => { openWindow(app.id); setSpotlightOpen(false); setSpotlightQuery(''); }}
                  >
                    <span className="spotlight-result-icon">📱</span>
                    <span>{app.label}</span>
                  </button>
                ))}
              </div>
            )}

            {spotlightQuery && filteredApps.length === 0 && (
              <div className="spotlight-empty">
                <p>No results for "<strong>{spotlightQuery}</strong>"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
