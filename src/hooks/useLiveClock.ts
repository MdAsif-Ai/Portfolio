import { useState, useEffect } from 'react';

export interface ClockState {
  time: string;       // e.g. "3:22 PM"
  time24: string;     // e.g. "15:22"
  date: string;       // e.g. "Thursday, July 3"
  dateShort: string;  // e.g. "Thu Jul 3"
  seconds: number;
}

function format(d: Date): ClockState {
  const h12 = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const h24 = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dateShort = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return { time: h12, time24: h24, date, dateShort, seconds: d.getSeconds() };
}

export function useLiveClock(): ClockState {
  const [state, setState] = useState<ClockState>(() => format(new Date()));

  useEffect(() => {
    const tick = () => setState(format(new Date()));
    const now = Date.now();
    const msToNextSecond = 1000 - (now % 1000);
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return state;
}
