import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 1024; // px

export type Platform = 'macos' | 'ios';

export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>(
    () => (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT ? 'ios' : 'macos')
  );

  useEffect(() => {
    const onResize = () => {
      setPlatform(window.innerWidth < MOBILE_BREAKPOINT ? 'ios' : 'macos');
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return platform;
}
