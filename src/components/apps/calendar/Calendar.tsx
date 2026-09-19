import { useState } from 'react';
import './Calendar.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

interface CalEvent {
  day: number;
  month: number;
  year: number;
  title: string;
  color: string;
  time?: string;
}

const EVENTS: CalEvent[] = [
  { day: 4,  month: 7, year: 2025, title: 'LLM Agent v2 Release', color: '#5856D6', time: '10:00 AM' },
  { day: 7,  month: 7, year: 2025, title: 'Technical Interview — FAANG', color: '#FF3B30', time: '2:00 PM' },
  { day: 10, month: 7, year: 2025, title: 'RAG Pipeline Review', color: '#34C759', time: '11:00 AM' },
  { day: 15, month: 7, year: 2025, title: 'AWS Cert Renewal', color: '#FF9500', time: 'All day' },
  { day: 18, month: 7, year: 2025, title: 'Team Sprint Planning', color: '#007AFF', time: '9:00 AM' },
  { day: 22, month: 7, year: 2025, title: 'ML Meetup Bengaluru', color: '#30D158', time: '6:00 PM' },
  { day: 25, month: 7, year: 2025, title: 'Portfolio Launch', color: '#FF2D55', time: '12:00 PM' },
  { day: 28, month: 7, year: 2025, title: 'Model Fine-tuning Session', color: '#5856D6', time: '3:00 PM' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export function Calendar() {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selected, setSelected] = useState<number | null>(now.getDate());
  const [view, setView]   = useState<'month'|'list'>('month');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const monthEvents = EVENTS.filter(e => e.month === month && e.year === year);
  const dayEvents   = selected ? monthEvents.filter(e => e.day === selected) : [];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to complete grid rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal-app">
      {/* Sidebar */}
      <aside className="cal-sidebar">
        <button className="cal-new-event-btn">+ New Event</button>

        <div className="cal-mini-info">
          <p className="cal-mini-date">{now.toLocaleDateString('en-US',{weekday:'long'})}</p>
          <p className="cal-mini-day">{now.getDate()}</p>
        </div>

        <div className="cal-upcoming">
          <p className="cal-upcoming-header">Upcoming</p>
          {EVENTS.filter(e => e.month >= month).slice(0,5).map((ev,i) => (
            <div key={i} className="cal-upcoming-item">
              <span className="cal-ev-dot" style={{background:ev.color}} />
              <div>
                <p className="cal-upcoming-title">{ev.title}</p>
                <p className="cal-upcoming-time">{MONTHS[ev.month-1].slice(0,3)} {ev.day} {ev.time && `· ${ev.time}`}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main grid */}
      <div className="cal-main">
        {/* Header */}
        <div className="cal-header">
          <div className="cal-header-left">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <h2 className="cal-month-title">{MONTHS[month-1]} {year}</h2>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <div className="cal-view-toggle">
            <button className={view==='month'?'active':''} onClick={()=>setView('month')}>Month</button>
            <button className={view==='list'?'active':''} onClick={()=>setView('list')}>List</button>
            <button onClick={()=>{setYear(now.getFullYear());setMonth(now.getMonth()+1);setSelected(now.getDate());}}>Today</button>
          </div>
        </div>

        {view === 'month' ? (
          <>
            {/* Day-of-week headers */}
            <div className="cal-grid-header">
              {DAYS.map(d => <span key={d}>{d}</span>)}
            </div>
            {/* Calendar grid */}
            <div className="cal-grid">
              {cells.map((day, i) => {
                const hasEvents = day ? monthEvents.some(e => e.day === day) : false;
                const isToday   = day === now.getDate() && month === now.getMonth()+1 && year === now.getFullYear();
                const isSel     = day === selected;
                return (
                  <div
                    key={i}
                    className={`cal-cell${day ? ' cal-cell--active' : ''}${isToday ? ' cal-cell--today' : ''}${isSel ? ' cal-cell--selected' : ''}`}
                    onClick={() => day && setSelected(day)}
                  >
                    {day && (
                      <>
                        <span className="cal-day-num">{day}</span>
                        {hasEvents && (
                          <div className="cal-dot-row">
                            {monthEvents.filter(e=>e.day===day).slice(0,3).map((ev,j) => (
                              <span key={j} className="cal-ev-mini-dot" style={{background:ev.color}} />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected day events */}
            {selected && dayEvents.length > 0 && (
              <div className="cal-day-events">
                <p className="cal-day-events-header">{MONTHS[month-1]} {selected}</p>
                {dayEvents.map((ev,i) => (
                  <div key={i} className="cal-day-event-row" style={{'--ev-color':ev.color} as React.CSSProperties}>
                    <div className="cal-day-ev-color" style={{background:ev.color}} />
                    <div>
                      <p className="cal-day-ev-title">{ev.title}</p>
                      {ev.time && <p className="cal-day-ev-time">{ev.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="cal-list-view">
            {monthEvents.length === 0 ? (
              <p className="cal-empty">No events this month</p>
            ) : monthEvents.sort((a,b)=>a.day-b.day).map((ev,i) => (
              <div key={i} className="cal-list-item">
                <div className="cal-list-date">
                  <span className="cal-list-day">{ev.day}</span>
                  <span className="cal-list-dow">{DAYS[new Date(ev.year,ev.month-1,ev.day).getDay()]}</span>
                </div>
                <div className="cal-list-ev-bar" style={{background:ev.color}} />
                <div>
                  <p className="cal-list-ev-title">{ev.title}</p>
                  {ev.time && <p className="cal-list-ev-time">{ev.time}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
