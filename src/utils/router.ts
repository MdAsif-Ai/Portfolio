// ─── Lightweight HTML5 History Router ────────────────────────────────────────

import { useState, useEffect } from 'react';

export type RouteType =
  | 'home'
  | 'about'
  | 'projects'
  | 'project-detail'
  | 'skills'
  | 'experience'
  | 'certificates'
  | 'blog'
  | 'blog-detail'
  | 'contact'
  | 'gallery'
  | 'app';

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
  if (path === '/skills') {
    return { path: '/skills', type: 'skills', params: {} };
  }
  if (path === '/experience') {
    return { path: '/experience', type: 'experience', params: {} };
  }
  if (path === '/certificates') {
    return { path: '/certificates', type: 'certificates', params: {} };
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
  if (path === '/gallery' || path.startsWith('/gallery/')) {
    const section = path.replace('/gallery/', '').replace('/gallery', '') || 'all';
    return { path, type: 'gallery', params: { section } };
  }
  if (path.startsWith('/apps/')) {
    const appId = path.replace('/apps/', '');
    return { path, type: 'app', params: { appId } };
  }

  // Fallback to home
  return { path: '/', type: 'home', params: {} };
}

export function navigateTo(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('app-location-change', { detail: { path } }));
  }
}

export function useAppRoute(): RouteState {
  const [route, setRoute] = useState<RouteState>(() => 
    typeof window !== 'undefined' ? parsePath(window.location.pathname) : { path: '/', type: 'home', params: {} }
  );

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
