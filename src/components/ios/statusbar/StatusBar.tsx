import { useLiveClock } from '../../../hooks/useLiveClock';
import { useIOSStore } from '../../../store/iosStore';
import './StatusBar.css';

interface StatusBarProps {
  transparent?: boolean;
}

export function StatusBar({ transparent = false }: StatusBarProps) {
  const { time } = useLiveClock();
  const showControlCenter = useIOSStore(s => s.showControlCenter);

  return (
    <div className={`ios-statusbar ${transparent ? 'ios-statusbar--transparent' : ''}`}>
      <span className="ios-statusbar-time">{time}</span>
      <div className="ios-statusbar-right" onClick={showControlCenter}>
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="7" width="3" height="5" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 10.5 a1.3 1.3 0 1 1 0 .01z" />
          <path d="M8 8 Q5.5 5.5 3 8" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round"/>
          <path d="M8 5.5 Q3.5 1 0 5" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M8 3 Q13.5 -2 16 5" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M8 5.5 Q12.5 1 16 5" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M8 8 Q10.5 5.5 13 8" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="white" strokeWidth="1"/>
          <rect x="20.5" y="3.5" width="3" height="5" rx="1.5" fill="white" opacity="0.4"/>
          <rect x="2" y="2" width="15" height="8" rx="1.5" fill="white"/>
        </svg>
      </div>
    </div>
  );
}
