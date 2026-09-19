import { useIOSStore } from '../../../store/iosStore';
import './ControlCenter.css';

export function ControlCenter() {
  const { hideControlCenter } = useIOSStore();

  return (
    <>
      <div className="ios-cc-backdrop" onClick={hideControlCenter} />
      <div className="ios-cc-panel">
        {/* Top row */}
        <div className="ios-cc-grid">
          {/* Network tile */}
          <div className="ios-cc-tile ios-cc-tile--wide">
            <div className="ios-cc-network">
              <div className="ios-cc-network-item ios-cc-network-item--on">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 20H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v5"/>
                  <path d="M1 9L12 2l11 7" strokeWidth="1.5" stroke="white" fill="none"/>
                </svg>
                <span>Wi-Fi</span>
              </div>
              <div className="ios-cc-network-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 22c5.5-4 10-8 10-13a10 10 0 00-20 0c0 5 4.5 9 10 13z"/>
                </svg>
                <span>Bluetooth</span>
              </div>
              <div className="ios-cc-network-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5"/>
                </svg>
                <span>Cellular</span>
              </div>
              <div className="ios-cc-network-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                  <path d="M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z"/>
                  <path d="M3 12h18"/>
                </svg>
                <span>AirDrop</span>
              </div>
            </div>
          </div>

          {/* Brightness */}
          <div className="ios-cc-tile">
            <div className="ios-cc-slider-track">
              <div className="ios-cc-slider-fill" style={{ height: '75%' }} />
              <svg className="ios-cc-slider-icon" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="ios-cc-label">Brightness</span>
          </div>

          {/* Volume */}
          <div className="ios-cc-tile">
            <div className="ios-cc-slider-track">
              <div className="ios-cc-slider-fill" style={{ height: '55%' }} />
              <svg className="ios-cc-slider-icon" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="ios-cc-label">Volume</span>
          </div>
        </div>

        {/* Music mini player */}
        <div className="ios-cc-music">
          <div className="ios-cc-music-icon">🎵</div>
          <div className="ios-cc-music-info">
            <span className="ios-cc-music-title">Not Playing</span>
            <span className="ios-cc-music-artist">Mohammed Asif's Portfolio</span>
          </div>
          <div className="ios-cc-music-controls">
            <button className="ios-cc-music-btn" aria-label="Previous">⏮</button>
            <button className="ios-cc-music-btn" aria-label="Play">▶</button>
            <button className="ios-cc-music-btn" aria-label="Next">⏭</button>
          </div>
        </div>

        <button className="ios-cc-dismiss" onClick={hideControlCenter}>
          Done
        </button>
      </div>
    </>
  );
}
