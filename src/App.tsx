import { useEffect } from 'react';
import { usePlatform } from './hooks/usePlatform';
import { MacOSShell } from './MacOSShell';
import { IOSShell } from './IOSShell';
import { useThemeStore } from './store/themeStore';
import { useAppRoute } from './utils/router';
import { SEOHead } from './components/common/SEOHead';
import { CrawlableContent } from './components/common/CrawlableContent';

export default function App() {
  const platform = usePlatform();
  const { theme } = useThemeStore();
  const route = useAppRoute();

  // Sync theme with HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <SEOHead route={route} />
      <CrawlableContent route={route} />
      {platform === 'ios' ? <IOSShell route={route} /> : <MacOSShell route={route} />}
    </>
  );
}
