import { useState, useEffect } from 'react';

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  const updateSidebarCollapsed = (value: boolean) => {
    setSidebarCollapsed(value);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(value));
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed: updateSidebarCollapsed,
    isLoaded
  };
}
