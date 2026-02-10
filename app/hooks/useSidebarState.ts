import { useState, useEffect, useCallback } from 'react';

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Detect mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();

    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
    setIsLoaded(true);

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save to localStorage whenever state changes
  const updateSidebarCollapsed = (value: boolean) => {
    setSidebarCollapsed(value);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(value));
  };

  // Toggle sidebar open/closed (for mobile hamburger)
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed: updateSidebarCollapsed,
    isMobile,
    toggleSidebar,
    isLoaded
  };
}
