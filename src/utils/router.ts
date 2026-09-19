// ─── Lightweight HTML5 History Router ────────────────────────────────────────

import { useState, useEffect } from 'react';

export type RouteType = 'home' | 'about' | 'projects' | 'project-detail' | 'blog' | 'blog-detail' | 'contact';

export interface RouteState {
  path: string;
  type: RouteType;
  params: Record<string, string>;
}

export function parsePath(pathname: string): RouteState {
  const path = pathname.split('?')[0].replace(/\/$/, '') || '/';
  
  if (path === '' || path === '/') {
    return { path: '/', type: 'home', params: {} };
  }
  if (path === '/about') {
    return { path: '/about', type: 'about', params: {} };
  }
  if (path === '/projects') {
    return { path: '/projects', type: 'projects', params: {} };
  }
  if (path.startsWith('/projects/')) {
    const id = path.replace('/projects/', '');
    return { path, type: 'project-detail', params: { id } };
  }
  if (path === '/blog') {
    return { path: '/blog', type: 'blog', params: {} };
  }
  if (path.startsWith('/blog/')) {
    const id = path.replace('/blog/', '');
    return { path, type: 'blog-detail', params: { id } };
  }
  if (path === '/contact') {
    return { path: '/contact', type: 'contact', params: {} };
  }

  // Fallback to home
  return { path: '/', type: 'home', params: {} };
}

export function navigateTo(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('app-location-change', { detail: { path } }));
  }
}

export function useAppRoute(): RouteState {
  const [route, setRoute] = useState<RouteState>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      setRoute(parsePath(customEvent.detail.path));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('app-location-change', handleCustomEvent);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('app-location-change', handleCustomEvent);
    };
  }, []);

  return route;
}
