import { create } from 'zustand';

export type BootPhase = 'booting' | 'hello' | 'login' | 'desktop';

interface BootStore {
  phase: BootPhase;
  progress: number;
  setPhase: (phase: BootPhase) => void;
  setProgress: (progress: number) => void;
  login: () => void;
}

export const useBootStore = create<BootStore>((set) => ({
  phase: 'booting',
  progress: 0,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  login: () => set({ phase: 'desktop' }),
}));
