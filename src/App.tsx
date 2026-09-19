import { useEffect } from 'react';
import { usePlatform } from './hooks/usePlatform';
import { MacOSShell } from './MacOSShell';
import { IOSShell } from './IOSShell';
import { useDocumentTitleAnimation } from './hooks/useDocumentTitleAnimation';
import { useThemeStore } from './store/themeStore';

export default function App() {
  const platform = usePlatform();
  const { theme } = useThemeStore();

  // Sync theme with HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Typewriter effect in browser title
  useDocumentTitleAnimation(['Md Asif', 'M H Mohammed Asif', 'AI Engineer'], 100, 50, 1500, 500);

  return platform === 'ios' ? <IOSShell /> : <MacOSShell />;
}
