import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageRoute = '/' | '/shop' | '/products' | '/cart' | '/checkout' | '/shark-tank' | '/contact' | '/admin';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return clean;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const target = normalizePath(path);
    if (target !== currentPath) {
      window.history.pushState({}, '', target);
      setCurrentPath(target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export const Link: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
}> = ({ to, className, children, onClick, id }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // allow cmd/ctrl click to open in new tab
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      if (onClick) onClick();
      navigate(to);
    }
  };

  return (
    <a id={id} href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
