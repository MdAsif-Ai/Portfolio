import { create } from 'zustand';
import { navigateTo } from '../utils/router';

export type WindowId =
  | 'finder'
  | 'terminal'
  | 'safari'
  | 'mail'
  | 'music'
  | 'photos'
  | 'activitymonitor'
  | 'calendar'
  | 'settings';

export interface WindowState {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  animatingOut?: boolean;   // triggers genie-minimize animation
  animatingIn?: boolean;    // triggers genie-restore animation
}

interface WindowStore {
  windows: WindowState[];
  topZ: number;
  openWindow:    (id: WindowId) => void;
  closeWindow:   (id: WindowId) => void;
  focusWindow:   (id: WindowId) => void;
  moveWindow:    (id: WindowId, x: number, y: number) => void;
  resizeWindow:  (id: WindowId, width: number, height: number) => void;
  minimizeWindow:(id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  maximizeWindow:(id: WindowId) => void;
  isOpen:        (id: WindowId) => boolean;
}

/* Bigger default sizes so content is comfortable to read */
const DEFAULT_SIZES: Record<WindowId, { w: number; h: number }> = {
  finder:          { w: 1020, h: 680 },
  terminal:        { w: 960, h: 640 },
  safari:          { w: 1140, h: 760 },
  mail:            { w: 1000, h: 700 },
  music:           { w: 960, h: 640 },
  photos:          { w: 1060, h: 720 },
  activitymonitor: { w: 1120, h: 800 },
  calendar:        { w: 920, h: 680 },
  settings:        { w: 820, h: 600 },
};

const WINDOW_TITLES: Record<WindowId, string> = {
  finder:          'Finder',
  terminal:        'Terminal',
  safari:          'Safari',
  mail:            'Mail',
  music:           'Music',
  photos:          'Photos',
  activitymonitor: 'Activity Monitor',
  calendar:        'Calendar',
  settings:        'System Settings',
};

let cascade = 0;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZ: 100,

  openWindow: (id) => {
    // Sync browser address bar with app route
    navigateTo(`/apps/${id}`);

    const existing = get().windows.find(w => w.id === id);
    if (existing) {
      if (existing.minimized) {
        /* Trigger animating-in (genie restore) then show */
        set(s => ({
          topZ: s.topZ + 1,
          windows: s.windows.map(w =>
            w.id === id
              ? { ...w, minimized: false, animatingIn: true, zIndex: s.topZ + 1 }
              : w
          ),
        }));
        /* Clear animatingIn after animation */
        setTimeout(() => {
          set(s => ({
            windows: s.windows.map(w =>
              w.id === id ? { ...w, animatingIn: false } : w
            ),
          }));
        }, 500);
      } else {
        get().focusWindow(id);
      }
      return;
    }

    /* Clamp size so it fits in the viewport */
    const { w, h } = DEFAULT_SIZES[id];
    const vw = typeof window !== 'undefined' ? window.innerWidth  : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const safeW = Math.min(w, vw - 40);
    const safeH = Math.min(h, vh - 80);
    const offset = (cascade++ % 6) * 28;
    const x = Math.max(60, (vw - safeW) / 2 + offset);
    const y = Math.max(40, (vh - safeH) / 2 + offset - 50);

    set(s => ({
      topZ: s.topZ + 1,
      windows: [
        ...s.windows,
        {
          id,
          title: WINDOW_TITLES[id],
          x, y,
          width: safeW,
          height: safeH,
          zIndex: s.topZ + 1,
          minimized: false,
          maximized: false,
          animatingIn: true,
          animatingOut: false,
        },
      ],
    }));

    /* Clear animatingIn after opening animation */
    setTimeout(() => {
      set(s => ({
        windows: s.windows.map(w =>
          w.id === id ? { ...w, animatingIn: false } : w
        ),
      }));
    }, 400);
  },

  closeWindow: (id) => {
    /* Trigger closing animation, then remove */
    set(s => ({
      windows: s.windows.map(w =>
        w.id === id ? { ...w, animatingOut: true } : w
      ),
    }));
    setTimeout(() => {
      set(s => ({ windows: s.windows.filter(w => w.id !== id) }));
    }, 320);
  },

  focusWindow: (id) => {
    navigateTo(`/apps/${id}`);
    set(s => ({
      topZ: s.topZ + 1,
      windows: s.windows.map(w =>
        w.id === id ? { ...w, zIndex: s.topZ + 1 } : w
      ),
    }));
  },

  moveWindow: (id, x, y) => {
    set(s => ({
      windows: s.windows.map(w => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  resizeWindow: (id, width, height) => {
    set(s => ({
      windows: s.windows.map(w => (w.id === id ? { ...w, width, height } : w)),
    }));
  },

  minimizeWindow: (id) => {
    /* Trigger genie-out animation, then set minimized */
    set(s => ({
      windows: s.windows.map(w =>
        w.id === id ? { ...w, animatingOut: true } : w
      ),
    }));
    setTimeout(() => {
      set(s => ({
        windows: s.windows.map(w =>
          w.id === id ? { ...w, minimized: true, animatingOut: false } : w
        ),
      }));
    }, 420);
  },

  restoreWindow: (id) => {
    set(s => ({
      topZ: s.topZ + 1,
      windows: s.windows.map(w =>
        w.id === id
          ? { ...w, minimized: false, animatingIn: true, zIndex: s.topZ + 1 }
          : w
      ),
    }));
    setTimeout(() => {
      set(s => ({
        windows: s.windows.map(w =>
          w.id === id ? { ...w, animatingIn: false } : w
        ),
      }));
    }, 500);
  },

  maximizeWindow: (id) => {
    set(s => ({
      windows: s.windows.map(w =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    }));
  },

  isOpen: (id) => get().windows.some(w => w.id === id && !w.minimized),
}));
