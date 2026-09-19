import { useLiveClock } from '../../../hooks/useLiveClock';
import { useIOSStore } from '../../../store/iosStore';
import './LockScreen.css';

export function LockScreen() {
  const { time24, date } = useLiveClock();
  const [hour, minute] = time24.split(':');
  const unlock = useIOSStore(s => s.unlock);

  const handleSwipeUp = () => unlock();

  return (
    <div className="ios-lockscreen" onClick={handleSwipeUp}>
      {/* Wallpaper */}
      <div className="ios-lockscreen-bg" />

      {/* Time */}
      <div className="ios-lockscreen-time-block">
        <div className="ios-lockscreen-time">
          {hour}:{minute}
        </div>
        <div className="ios-lockscreen-date">{date}</div>
      </div>

      {/* Swipe hint */}
      <div className="ios-swipe-hint">
        <div className="ios-swipe-chevron">
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
            <path d="M  2 14 L14 2 L26 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="ios-swipe-label">Swipe up or tap to unlock</span>
      </div>
    </div>
  );
}
