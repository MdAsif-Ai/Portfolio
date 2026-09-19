import { useState } from 'react';
import { person } from '../../../data/person';
import './Settings.css';

type SettingsSection = 'general' | 'appearance' | 'notifications' | 'privacy' | 'about';

const SIDEBAR_ITEMS: { id: SettingsSection; label: string; icon: string; color: string }[] = [
  { id: 'general',       label: 'General',       icon: '⚙️', color: '#8E8E93' },
  { id: 'appearance',    label: 'Appearance',    icon: '🎨', color: '#007AFF' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', color: '#FF3B30' },
  { id: 'privacy',       label: 'Privacy',       icon: '🔒', color: '#34C759' },
  { id: 'about',         label: 'About This Mac', icon: '🍎', color: '#1C1C1E' },
];

export function Settings() {
  const [section, setSection] = useState<SettingsSection>('about');
  const [darkMode, setDarkMode] = useState(true);
  const [accent,   setAccent]   = useState('#007AFF');
  const [notif,    setNotif]    = useState({ mail: true, calendar: true, updates: false });

  const ACCENTS = ['#007AFF','#FF3B30','#FF9500','#34C759','#5856D6','#FF2D55','#30D158'];

  return (
    <div className="settings-app">
      {/* Sidebar */}
      <aside className="settings-sidebar">
        <div className="settings-search">
          <span>🔍</span>
          <input placeholder="Search" className="settings-search-input" />
        </div>
        {SIDEBAR_ITEMS.map(item => (
          <button
            key={item.id}
            className={`settings-nav-item ${section === item.id ? 'active' : ''}`}
            onClick={() => setSection(item.id)}
          >
            <span className="settings-nav-icon" style={{background: item.color}}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="settings-main">
        {section === 'about' && (
          <div className="settings-section">
            <h2 className="settings-section-title">About This Mac</h2>
            <div className="settings-about-hero">
              <img src="/img/macOS-Tahoe-26-Feature-removebg-preview.png" alt="macOS Tahoe" className="settings-about-img" draggable={false} />
              <div>
                <h3 className="settings-about-name">macOS Tahoe</h3>
                <p className="settings-about-version">Version 26.0</p>
              </div>
            </div>
            <div className="settings-card">
              <div className="settings-row"><span>Owner</span><span>{person.name}</span></div>
              <div className="settings-row"><span>Title</span><span>{person.title}</span></div>
              <div className="settings-row"><span>Location</span><span>{person.location}</span></div>
              <div className="settings-row"><span>Email</span><a href={`mailto:${person.email}`} className="settings-link">{person.email}</a></div>
              <div className="settings-row"><span>GitHub</span><a href={person.github} target="_blank" rel="noopener noreferrer" className="settings-link">{person.github.replace('https://','')}</a></div>
            </div>
            <div className="settings-card">
              <div className="settings-row"><span>Chip</span><span>Apple Neural Engine Pro</span></div>
              <div className="settings-row"><span>Memory</span><span>64 GB</span></div>
              <div className="settings-row"><span>Storage</span><span>2 TB SSD</span></div>
              <div className="settings-row"><span>Serial Number</span><span>MDASIF2025AI</span></div>
            </div>
          </div>
        )}

        {section === 'general' && (
          <div className="settings-section">
            <h2 className="settings-section-title">General</h2>
            <div className="settings-card">
              <div className="settings-row settings-row--toggle">
                <div>
                  <p className="settings-row-label">Show Scroll Bars</p>
                  <p className="settings-row-desc">Automatically based on input device</p>
                </div>
                <ToggleSwitch on={true} />
              </div>
              <div className="settings-row settings-row--toggle">
                <div>
                  <p className="settings-row-label">Sidebar Icon Size</p>
                  <p className="settings-row-desc">Medium</p>
                </div>
                <select className="settings-select">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <div className="settings-row settings-row--toggle">
                <div>
                  <p className="settings-row-label">Close windows when quitting an app</p>
                </div>
                <ToggleSwitch on={false} />
              </div>
            </div>
          </div>
        )}

        {section === 'appearance' && (
          <div className="settings-section">
            <h2 className="settings-section-title">Appearance</h2>
            <div className="settings-card">
              <p className="settings-row-label" style={{marginBottom:12}}>Appearance</p>
              <div className="settings-appearance-options">
                <label className={`settings-appear-opt${!darkMode?' active':''}`}>
                  <div className="settings-appear-preview settings-appear-light" />
                  <span>Light</span>
                  <input type="radio" name="appearance" checked={!darkMode} onChange={()=>setDarkMode(false)} />
                </label>
                <label className={`settings-appear-opt${darkMode?' active':''}`}>
                  <div className="settings-appear-preview settings-appear-dark" />
                  <span>Dark</span>
                  <input type="radio" name="appearance" checked={darkMode} onChange={()=>setDarkMode(true)} />
                </label>
                <label className="settings-appear-opt">
                  <div className="settings-appear-preview settings-appear-auto" />
                  <span>Auto</span>
                  <input type="radio" name="appearance" />
                </label>
              </div>
            </div>
            <div className="settings-card">
              <p className="settings-row-label" style={{marginBottom:12}}>Accent Color</p>
              <div className="settings-accent-row">
                {ACCENTS.map(c => (
                  <button
                    key={c}
                    className={`settings-accent-dot${accent===c?' selected':''}`}
                    style={{background:c}}
                    onClick={()=>setAccent(c)}
                  />
                ))}
              </div>
            </div>
            <div className="settings-card">
              <div className="settings-row settings-row--toggle">
                <div>
                  <p className="settings-row-label">Reduce Transparency</p>
                  <p className="settings-row-desc">Improves contrast for accessibility</p>
                </div>
                <ToggleSwitch on={false} />
              </div>
              <div className="settings-row settings-row--toggle">
                <div>
                  <p className="settings-row-label">Increase Contrast</p>
                </div>
                <ToggleSwitch on={false} />
              </div>
            </div>
          </div>
        )}

        {section === 'notifications' && (
          <div className="settings-section">
            <h2 className="settings-section-title">Notifications</h2>
            <div className="settings-card">
              {[
                { key: 'mail', label: 'Mail', icon: '📧' },
                { key: 'calendar', label: 'Calendar', icon: '📅' },
                { key: 'updates', label: 'Software Updates', icon: '⬇️' },
              ].map(item => (
                <div key={item.key} className="settings-row settings-row--toggle">
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:20}}>{item.icon}</span>
                    <p className="settings-row-label" style={{margin:0}}>{item.label}</p>
                  </div>
                  <ToggleSwitch
                    on={notif[item.key as keyof typeof notif]}
                    onChange={v => setNotif(n => ({...n, [item.key]: v}))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'privacy' && (
          <div className="settings-section">
            <h2 className="settings-section-title">Privacy & Security</h2>
            <div className="settings-card">
              {[
                { label: 'Location Services', icon: '📍', on: true },
                { label: 'Camera',            icon: '📷', on: false },
                { label: 'Microphone',        icon: '🎙️', on: false },
                { label: 'Analytics',         icon: '📊', on: false },
              ].map(item => (
                <div key={item.label} className="settings-row settings-row--toggle">
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:18}}>{item.icon}</span>
                    <p className="settings-row-label" style={{margin:0}}>{item.label}</p>
                  </div>
                  <ToggleSwitch on={item.on} />
                </div>
              ))}
            </div>
            <div className="settings-card">
              <p className="settings-row-label">FileVault</p>
              <p className="settings-row-desc" style={{margin:'4px 0 10px',color:'var(--text-secondary)',fontSize:12}}>Your disk is encrypted.</p>
              <span className="settings-badge settings-badge--green">● Enabled</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange?: (v: boolean) => void }) {
  const [state, setState] = useState(on);
  const toggle = () => {
    const next = !state;
    setState(next);
    onChange?.(next);
  };
  return (
    <button
      className={`settings-toggle${state ? ' on' : ''}`}
      onClick={toggle}
      aria-label="Toggle"
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}
