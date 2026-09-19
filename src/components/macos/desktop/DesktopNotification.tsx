import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DesktopNotification.css';

export function DesktopNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification shortly after desktop loads (1.5 seconds)
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Auto-hide after a generous amount of time (15 seconds)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 16500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="desktop-notification-container">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="desktop-notification"
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 400, mass: 0.8 }}
            onClick={() => setIsVisible(false)}
          >
            <img src="/img/icons/finder.png" alt="Guide" className="desktop-notification-icon" draggable={false} />
            <div className="desktop-notification-content">
              <div className="desktop-notification-header">
                <span className="desktop-notification-title">Workspace Initialized</span>
                <span className="desktop-notification-time">now</span>
              </div>
              <div className="desktop-notification-message">
                Welcome! You've successfully logged into my digital mind. Navigate through the Finder, surf Safari, and launch every app to discover the hidden depths of my skills and projects. Enjoy the experience!
              </div>
            </div>
            <button 
              className="desktop-notification-close" 
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              aria-label="Close notification"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
