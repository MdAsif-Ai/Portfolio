import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useWindowStore, WindowId } from '../../../store/windowStore';
import './Dock.css';

/* ─── Dock apps registry ────────────────────────────────────────────────── */
interface DockApp { id: WindowId; label: string; icon: string; }
interface DockExtra { id: string; label: string; icon: string; }

const DOCK_APPS: DockApp[] = [
  { id: 'finder',          label: 'Finder',           icon: '/logo/finder-2021-09-10.png'     },
  { id: 'safari',          label: 'Safari',           icon: '/img/icons/safari.png'     },
  { id: 'mail',            label: 'Mail',             icon: '/img/icons/mail.png'       },
  { id: 'music',           label: 'Music',            icon: '/img/icons/music.png'      },
  { id: 'photos',          label: 'Photos',           icon: '/img/icons/photos.png'     },
  { id: 'calendar',        label: 'Calendar',         icon: '/img/icons/calendar.png'   },
  { id: 'terminal',        label: 'Terminal',         icon: '/img/icons/terminal.png'   },
  { id: 'activitymonitor', label: 'Activity Monitor', icon: '/icons/activitymonitor.svg' },
  { id: 'settings',        label: 'System Settings',  icon: '/img/icons/settings.png'   },
];


/* ─── Physics constants ─────────────────────────────────────────────────── */
const BASE_SIZE  = 56;   // resting icon px
const PEAK_SIZE  = 92;   // max magnification px
const WAVE_REACH = 140;  // gaussian wave half-width px

/**
 * Gaussian falloff so each icon naturally bulges at the right scale.
 * Returns target px width/height for an icon `dist` pixels from cursor.
 */
function magnify(dist: number): number {
  if (dist >= WAVE_REACH) return BASE_SIZE;
  // Gaussian: e^(-d²/σ²) where σ controls spread
  const sigma = WAVE_REACH * 0.45;
  const g = Math.exp(-(dist * dist) / (2 * sigma * sigma));
  return BASE_SIZE + (PEAK_SIZE - BASE_SIZE) * g;
}

/* ─── Main component ────────────────────────────────────────────────────── */
export function Dock() {
  const { openWindow, windows, restoreWindow } = useWindowStore();

  const dockRef     = useRef<HTMLDivElement>(null);
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const tipRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const hoveredIdx  = useRef<number>(-1);

  /* Build total item list (apps only) */
  const TOTAL = DOCK_APPS.length;

  /* Initialise all icons at BASE_SIZE via gsap.set */
  useEffect(() => {
    itemRefs.current.forEach(el => {
      if (el) {
        gsap.set(el, { width: BASE_SIZE, height: BASE_SIZE, y: 0 });
      }
    });
  }, []);

  /* ── Mouse move: Gaussian magnification ────────────────────────────────── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const dockEl = dockRef.current;
    if (!dockEl) return;
    const dockRect = dockEl.getBoundingClientRect();
    const mouseX = e.clientX;

    itemRefs.current.forEach(el => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const dist = Math.abs(mouseX - cx);
      const target = magnify(dist);

      gsap.to(el, {
        width:    target,
        height:   target,
        duration: 0.18,
        ease:     'power2.out',
        overwrite: 'auto',
      });
    });
  }, []);

  /* ── Mouse leave: spring back to base ──────────────────────────────────── */
  const onMouseLeave = useCallback(() => {
    itemRefs.current.forEach(el => {
      if (!el) return;
      gsap.to(el, {
        width:    BASE_SIZE,
        height:   BASE_SIZE,
        duration: 0.55,
        ease:     'elastic.out(1.1, 0.55)',
        overwrite: 'auto',
      });
    });
    /* Hide all tooltips */
    tipRefs.current.forEach(el => {
      if (el) gsap.to(el, { opacity: 0, y: 6, duration: 0.12, overwrite: 'auto' });
    });
    hoveredIdx.current = -1;
  }, []);

  /* ── Tooltip show/hide ─────────────────────────────────────────────────── */
  const showTip = useCallback((i: number) => {
    if (hoveredIdx.current === i) return;
    if (hoveredIdx.current >= 0) {
      const prev = tipRefs.current[hoveredIdx.current];
      if (prev) gsap.to(prev, { opacity: 0, y: 6, duration: 0.1, overwrite: 'auto' });
    }
    hoveredIdx.current = i;
    const tip = tipRefs.current[i];
    if (tip) {
      gsap.fromTo(tip,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power3.out', overwrite: 'auto' }
      );
    }
  }, []);

  const hideTip = useCallback((i: number) => {
    const tip = tipRefs.current[i];
    if (tip) gsap.to(tip, { opacity: 0, y: 6, duration: 0.12, overwrite: 'auto' });
    if (hoveredIdx.current === i) hoveredIdx.current = -1;
  }, []);

  /* ── Click: bounce + open ────────────────────────────────────────────────*/
  const clickBounce = useCallback((el: HTMLDivElement | null, cb?: () => void) => {
    if (!el) return;
    gsap.timeline({ onComplete: cb })
      .to(el, { y: -20, duration: 0.14, ease: 'power2.out' })
      .to(el, { y: 0,   duration: 0.6,  ease: 'elastic.out(1.3, 0.4)' });
  }, []);

  const handleAppClick = useCallback((id: WindowId, idx: number) => {
    clickBounce(itemRefs.current[idx], () => {
      const existing = windows.find(w => w.id === id);
      existing?.minimized ? restoreWindow(id) : openWindow(id);
    });
  }, [windows, openWindow, restoreWindow, clickBounce]);

  const handleExtraClick = useCallback((idx: number) => {
    clickBounce(itemRefs.current[idx]);
  }, [clickBounce]);

  /* ── ref setter factory ─────────────────────────────────────────────────── */
  const itemRef = (i: number) => (el: HTMLDivElement | null) => { itemRefs.current[i] = el; };
  const tipRef  = (i: number) => (el: HTMLSpanElement | null)=> { tipRefs.current[i]  = el; };

  return (
    <div className="dock-wrapper">
      <div
        className="dock"
        ref={dockRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* ── App Icons ─────────────────────────────────────────────────── */}
        {DOCK_APPS.map((app, i) => {
          const isOpen = windows.some(w => w.id === app.id && !w.minimized);
          const isMin  = windows.some(w => w.id === app.id && w.minimized);
          return (
            <DockIcon
              key={app.id}
              label={app.label}
              icon={app.icon}
              isOpen={isOpen}
              isMinimized={isMin}
              itemRef={itemRef(i)}
              tipRef={tipRef(i)}
              onMouseEnter={() => showTip(i)}
              onMouseLeave={() => hideTip(i)}
              onClick={() => handleAppClick(app.id, i)}
            />
          );
        })}

      </div>
    </div>
  );
}

/* ─── DockIcon sub-component ────────────────────────────────────────────── */
interface DockIconProps {
  label: string;
  icon: string;
  isOpen?: boolean;
  isMinimized?: boolean;
  isFolder?: boolean;
  itemRef: (el: HTMLDivElement | null) => void;
  tipRef:  (el: HTMLSpanElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function DockIcon({
  label, icon, isOpen, isMinimized, isFolder,
  itemRef, tipRef, onMouseEnter, onMouseLeave, onClick,
}: DockIconProps) {
  return (
    <div
      className="dock-item"
      ref={itemRef}
      style={{ width: BASE_SIZE, height: BASE_SIZE }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Tooltip */}
      <span className="dock-tip" ref={tipRef}>{label}</span>

      {/* Icon */}
      <img
        src={icon}
        alt={label}
        className={`dock-icon${isFolder ? ' dock-icon--folder' : ''}`}
        draggable={false}
        onError={e => {
          /* Fallback to generic app icon on load error */
          (e.currentTarget as HTMLImageElement).style.opacity = '0.6';
        }}
      />

      {/* Running dot */}
      {isOpen && <span className="dock-dot" />}

      {/* Minimized indicator (dimmer dot) */}
      {isMinimized && <span className="dock-dot dock-dot--min" />}
    </div>
  );
}
