import { useState, useEffect } from 'react';
import { useBootStore } from '../../../store/bootStore';
import { person } from '../../../data/person';
import { AvatarUploader } from '../../common/AvatarUploader';
import './LoginScreen.css';

export function LoginScreen() {
  const login = useBootStore(s => s.login);
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [time, setTime]   = useState(new Date());
  const [visible, setVisible] = useState(false);

  /* Clock */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Fade-in on mount */
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(id);
  }, []);

  const doLogin = () => login();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin();
  };

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className={`login-screen ${visible ? 'login-screen--visible' : ''}`}>
      {/* Blurred wallpaper */}
      <div className="login-wallpaper" />

      {/* Clock — top center */}
      <div className="login-clock">
        <p className="login-clock-time">{fmtTime(time)}</p>
        <p className="login-clock-date">{fmtDate(time)}</p>
      </div>

      {/* User card — center */}
      <div className="login-content">
        {/* Avatar */}
        <div onClick={doLogin} style={{ cursor: 'pointer', marginBottom: 12 }}>
          <AvatarUploader defaultSrc={person.avatar} alt={person.name} size={260} className="login-avatar" readonly={true} />
        </div>

        <p className="login-name">{person.name}</p>
        <p className="login-subtitle">{person.title}</p>

        <form className={`login-form ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
          <input
            className="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button className="login-arrow" type="submit" aria-label="Login">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </form>

        <p className="login-hint">Press ↵ or click → to continue</p>
      </div>

      {/* Bottom tray — power icons */}
      <div className="login-bottom">
        <button className="login-sys-btn" title="Restart" aria-label="Restart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        </button>
        <button className="login-sys-btn" title="Shut Down" aria-label="Shut Down">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
