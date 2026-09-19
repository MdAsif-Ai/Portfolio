import { create } from 'zustand';

export type IOSAppId =
  | 'finder'
  | 'terminal'
  | 'safari'
  | 'mail'
  | 'music'
  | 'photos'
  | 'activitymonitor'
  | 'calendar'
  | 'settings';

export type IOSScreen = 'lock' | 'home';

export interface NavEntry {
  view: string;
  title: string;
  params?: Record<string, unknown>;
}

interface IOSStore {
  screen: IOSScreen;
  openApp: IOSAppId | null;
  navStack: NavEntry[];
  openApps: IOSAppId[];
  controlCenterVisible: boolean;
  appSwitcherVisible: boolean;

  unlock: () => void;
  lock: () => void;
  launchApp: (id: IOSAppId) => void;
  closeApp: () => void;
  pushNav: (entry: NavEntry) => void;
  popNav: () => void;
  resetNav: () => void;
  showControlCenter: () => void;
  hideControlCenter: () => void;
  showAppSwitcher: () => void;
  hideAppSwitcher: () => void;
  dismissApp: (id: IOSAppId) => void;
}

export const useIOSStore = create<IOSStore>((set, get) => ({
  screen: 'lock',
  openApp: null,
  navStack: [],
  openApps: [],
  controlCenterVisible: false,
  appSwitcherVisible: false,

  unlock: () => set({ screen: 'home' }),
  lock: () => set({ screen: 'lock', openApp: null, navStack: [] }),

  launchApp: (id) => {
    const { openApps } = get();
    set({
      openApp: id,
      navStack: [{ view: 'main', title: id }],
      controlCenterVisible: false,
      appSwitcherVisible: false,
      openApps: openApps.includes(id) ? openApps : [...openApps, id],
    });
  },

  closeApp: () => set({ openApp: null, navStack: [] }),

  pushNav: (entry) => set(s => ({ navStack: [...s.navStack, entry] })),

  popNav: () =>
    set(s => ({
      navStack: s.navStack.length > 1 ? s.navStack.slice(0, -1) : s.navStack,
      openApp: s.navStack.length <= 1 ? null : s.openApp,
    })),

  resetNav: () => set(s => ({ navStack: s.navStack.slice(0, 1) })),

  showControlCenter: () => set({ controlCenterVisible: true, appSwitcherVisible: false }),
  hideControlCenter: () => set({ controlCenterVisible: false }),

  showAppSwitcher: () => set({ appSwitcherVisible: true, controlCenterVisible: false }),
  hideAppSwitcher: () => set({ appSwitcherVisible: false }),

  dismissApp: (id) =>
    set(s => ({
      openApps: s.openApps.filter(a => a !== id),
      openApp: s.openApp === id ? null : s.openApp,
      navStack: s.openApp === id ? [] : s.navStack,
    })),
}));
