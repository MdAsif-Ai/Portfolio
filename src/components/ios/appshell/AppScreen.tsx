import React from 'react';
import { useIOSStore } from '../../../store/iosStore';
import './AppScreen.css';

interface AppScreenProps {
  title: string;
  children: React.ReactNode;
}

export function AppScreen({ title, children }: AppScreenProps) {
  const closeApp = useIOSStore(s => s.closeApp);

  return (
    <div className="ios-appscreen">
      {/* Nav Bar */}
      <div className="ios-navbar">
        <button
          className="ios-navbar-back"
          onClick={closeApp}
          aria-label="Back to Home"
        >
          <svg width="10" height="16" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 L1 9 L9 17" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Home</span>
        </button>
        <span className="ios-navbar-title">{title}</span>
        <div className="ios-navbar-spacer" />
      </div>

      {/* Content */}
      <div className="ios-appscreen-content">
        {children}
      </div>
    </div>
  );
}
