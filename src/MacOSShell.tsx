import React, { useState, useCallback, useEffect } from 'react';
import { RouteState } from './utils/router';
import { motion } from 'framer-motion';
import { useWindowStore, WindowId } from './store/windowStore';
import { useBootStore } from './store/bootStore';
import { BootScreen } from './components/macos/boot/BootScreen';
import { HelloScreen } from './components/macos/boot/HelloScreen';
import { LoginScreen } from './components/macos/login/LoginScreen';
import { MenuBar } from './components/macos/menubar/MenuBar';
import { Dock } from './components/macos/dock/Dock';
import { Window } from './components/macos/window/Window';
import { Finder } from './components/apps/finder/Finder';
import { Terminal } from './components/apps/terminal/Terminal';
import { Safari } from './components/apps/safari/Safari';
import { Mail } from './components/apps/mail/Mail';
import { Music } from './components/apps/music/Music';
import { Photos } from './components/apps/photos/Photos';
import { ActivityMonitor } from './components/apps/activitymonitor/ActivityMonitor';
import { Calendar } from './components/apps/calendar/Calendar';
import { Settings } from './components/apps/settings/Settings';
import DecryptedText from './components/DecryptedText';
import LetterGlitch from './components/LetterGlitch';
import TrueFocus from './components/TrueFocus/TrueFocus';
import { DesktopNotification } from './components/macos/desktop/DesktopNotification';
import './MacOSShell.css';

const APP_COMPONENTS: Record<WindowId, React.ComponentType> = {
  finder:          Finder,
  terminal:        Terminal,
  safari:          Safari,
  mail:            Mail,
  music:           Music,
  photos:          Photos,
  activitymonitor: ActivityMonitor,
  calendar:        Calendar,
  settings:        Settings,
};

const DESKTOP_ICONS: { id: WindowId; label: string; icon: string }[] = [
  { id: 'finder',  label: 'About Me',   icon: '/img/icons/finder.png'   },
  { id: 'safari',  label: 'Portfolio',  icon: '/img/icons/safari.png'   },
  { id: 'terminal',label: 'Terminal',   icon: '/img/icons/terminal.png' },
];

interface ContextMenu {
  x: number;
  y: number;
}

// Typing effect hook specifically for the center desktop text
function useTypingEffect(words: string[], typingSpeed = 100, deletingSpeed = 50, delay = 2000) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && text === fullText) {
        typeSpeed = delay;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        typeSpeed = 500;
      }
      return typeSpeed;
    };

    const timer = setTimeout(() => {
      handleType();
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, delay]);

  return text;
}

interface MacOSShellProps {
  route?: RouteState;
}

export function MacOSShell({ route }: MacOSShellProps = {}) {
  const { phase } = useBootStore();
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow } = useWindowStore();

  const [ctxMenu, setCtxMenu] = useState<ContextMenu | null>(null);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  // Custom typewriter text
  const typewriterText = useTypingEffect(['AI/ML Engineer & GenAI Developer', 'LLMs & Production RAG Systems', 'Multi-Agent Frameworks & MLOps'], 60, 30, 1000);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-open apps based on URL route
  useEffect(() => {
    if (!route) return;
    if (route.type === 'about' || route.type === 'projects' || route.type === 'project-detail' || route.type === 'skills' || route.type === 'experience' || route.type === 'certificates') {
      openWindow('finder');
    } else if (route.type === 'blog' || route.type === 'blog-detail') {
      openWindow('safari');
    } else if (route.type === 'gallery') {
      openWindow('photos');
    } else if (route.type === 'contact') {
      openWindow('mail');
    } else if (route.type === 'app') {
      const validAppIds: WindowId[] = ['finder', 'terminal', 'safari', 'mail', 'music', 'photos', 'activitymonitor', 'calendar', 'settings'];
      if (validAppIds.includes(route.params.appId as WindowId)) {
        openWindow(route.params.appId as WindowId);
      }
    }
  }, [route?.path]);

  const activeWindowTitle = windows
    .filter(w => !w.minimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.title;

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  if (phase === 'booting') return <BootScreen />;
  if (phase === 'hello')   return <HelloScreen />;
  if (phase === 'login')   return <LoginScreen />;

  return (
    <div className="macos-shell" onClick={closeCtxMenu} onContextMenu={handleDesktopContextMenu}>
      
      {/* LetterGlitch Background replacing wallpaper */}
      <div className="macos-wallpaper-container" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <LetterGlitch 
          centerVignette={true} 
          outerVignette={true} 
        />
      </div>

      {/* Desktop Notification */}
      <DesktopNotification />

      {/* Menu bar */}
      <MenuBar appName={activeWindowTitle ?? 'Finder'} />

      {/* Center Desktop Dashboard */}
      <div className="desktop-center-dashboard">
        {/* Animated Time and Date */}
        <motion.div 
          className="desktop-time-widget"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="desktop-time">{timeStr}</div>
          <div className="desktop-date">{dateStr}</div>
        </motion.div>

        {/* Hero Name with TrueFocus effect */}
        <div className="desktop-hero-name-wrapper" style={{ marginTop: '20px', fontFamily: '"Playfair Display", "Times New Roman", Times, serif' }}>
          <TrueFocus 
            sentence="MD ASIF MOHAMMED ASIF M H" 
            manualMode={false} 
            blurAmount={4} 
            borderColor="#34C759" 
            glowColor="rgba(52, 199, 89, 0.6)" 
            animationDuration={0.2} 
          />
        </div>

        {/* Typewriter Effect */}
        <div className="desktop-typewriter">
          <span>{typewriterText}</span><span className="typewriter-cursor" />
        </div>

        {/* Decrypted Welcome Text */}
        <div className="desktop-welcome-text" style={{ maxWidth: '800px', lineHeight: '1.6', marginTop: '20px', fontFamily: '"Playfair Display", "Times New Roman", Times, serif', fontSize: '1.1rem' }}>
          <DecryptedText
            text={'"What I cannot create, I do not understand." Feynman\'s principle has never been more true. I don\'t theorize about AI—I architect it into being.\nEvery system here is an act of translation: turning human reasoning into recursive agents, raw language into intelligence that decomposes and corrects itself, learning signals into adaptive systems that scale beyond what humans can manually design.\nI build the infrastructure of thought. The future doesn\'t need more researchers—it needs engineers who can encode reasoning itself. That\'s my craft.'}
            speed={20}
            maxIterations={8}
            animateOn="loop"
            revealDirection="start"
            sequential={true}
            useOriginalCharsOnly={false}
            className="decrypted-revealed"
            encryptedClassName="decrypted-encrypted"
          />
        </div>
      </div>

      {/* Desktop icons (top-right corner) */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map(icon => (
          <div
            key={icon.id}
            className="desktop-icon"
            onDoubleClick={() => openWindow(icon.id)}
          >
            <img src={icon.icon} alt={icon.label} className="desktop-icon-img" draggable={false} />
            <span className="desktop-icon-label">{icon.label}</span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map(w => {
        if (w.minimized) return null;
        const AppComponent = APP_COMPONENTS[w.id];
        return (
          <Window
            key={w.id}
            {...w}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onMaximize={() => maximizeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
          >
            <AppComponent />
          </Window>
        );
      })}

      {/* Dock */}
      <Dock />

      {/* Right-click context menu */}
      {ctxMenu && (
        <div
          className="desktop-ctx-menu"
          style={{ left: ctxMenu.x, top: ctxMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          {[
            { label: 'New Folder',          icon: '📁', onClick: closeCtxMenu },
            { label: 'Get Info',             icon: 'ℹ️', onClick: closeCtxMenu },
            null,
            { label: 'Change Wallpaper…',   icon: '🖼️', onClick: () => { openWindow('settings'); closeCtxMenu(); } },
            { label: 'Open Terminal Here',   icon: '🖥️', onClick: () => { openWindow('terminal'); closeCtxMenu(); } },
            null,
            { label: 'Sort By Name',         icon: '↕️', onClick: closeCtxMenu },
            { label: 'Show View Options',    icon: '⚙️', onClick: closeCtxMenu },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="desktop-ctx-sep" />
            ) : (
              <button key={i} className="desktop-ctx-item" onClick={item.onClick}>
                <span className="desktop-ctx-icon">{item.icon}</span>
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
