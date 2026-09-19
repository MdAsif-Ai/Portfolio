import React from 'react';
import LetterGlitch from './components/LetterGlitch';
import { person } from './data/person';
import './IOSShell.css';

const HOME_APPS = [
  { id: 'appstore', name: 'App Store', icon: '/img/icons/app-store.png' },
  { id: 'calendar', name: 'Calendar', icon: '/img/icons/calendar.png' },
  { id: 'photos', name: 'Photos', icon: '/img/icons/photos.png' },
  { id: 'maps', name: 'Maps', icon: '/img/icons/maps.png' },
  { id: 'clock', name: 'Clock', icon: '/img/icons/clock.png' },
  { id: 'settings', name: 'Settings', icon: '/img/icons/settings.png' },
  { id: 'messages', name: 'Messages', icon: '/img/icons/messages.png' },
  { id: 'facetime', name: 'FaceTime', icon: '/img/icons/facetime.png' },
];

export function IOSShell() {
  return (
    <div className="ios-shell">
      {/* Background exactly like PC version */}
      <div className="ios-background">
        <LetterGlitch centerVignette={true} outerVignette={true} />
      </div>

      <div className="ios-content">
        {/* Profile Widget */}
        <div className="ios-profile-widget">
          <img src={person.avatar} alt={person.name} className="ios-profile-img" />
          <div className="ios-profile-info">
            <h1>{person.name}</h1>
            <p>AI Engineer &amp; Developer</p>
          </div>
        </div>

        {/* Warning Card */}
        <div className="ios-warning-card">
          <div className="ios-warning-icon">🖥️</div>
          <h2>Desktop Experience Required</h2>
          <p>
            This website is a highly interactive macOS simulation designed specifically for PC and desktop devices. 
            Please open this site on a larger screen to explore the full portfolio.
          </p>
        </div>

        {/* Static App Grid */}
        <div className="ios-app-grid">
          {HOME_APPS.map(app => (
            <div key={app.id} className="ios-app-item">
              <div className="ios-app-icon-wrapper">
                <img src={app.icon} alt={app.name} className="ios-app-icon" />
              </div>
              <span className="ios-app-label">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Static Dock */}
      <div className="ios-dock-container">
        <div className="ios-dock">
          {/* Phone (Caller) */}
          <div className="ios-dock-icon" style={{ background: '#34C759', padding: '12px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style={{ width: '100%', height: '100%' }}>
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </div>
          {/* Gmail */}
          <div className="ios-dock-icon">
            <img src="https://cdn.simpleicons.org/gmail" alt="Gmail" style={{ background: '#fff', padding: '10px', objectFit: 'contain' }} />
          </div>
          {/* WhatsApp */}
          <div className="ios-dock-icon">
            <img src="https://cdn.simpleicons.org/whatsapp/white" alt="WhatsApp" style={{ background: '#25D366', padding: '10px', objectFit: 'contain' }} />
          </div>
          {/* Safari */}
          <div className="ios-dock-icon">
            <img src="/img/icons/safari.png" alt="Safari" />
          </div>
        </div>
      </div>
    </div>
  );
}
