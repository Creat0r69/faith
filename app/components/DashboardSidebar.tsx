'use client';

import Image from 'next/image';
import { Home, User, Settings, LogOut, Menu } from 'lucide-react';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  user: {
    avatarUrl: string | null;
    name: string;
  } | null;
  handleLogout: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function DashboardSidebar({
  sidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  selectedPage,
  setSelectedPage,
  user,
  handleLogout,
  isMobile = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const handleNavClick = (page: string) => {
    setSelectedPage(page);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <div className={`fixed left-0 top-0 bottom-0 p-6 pb-16 flex flex-col transition-all duration-300 overflow-y-auto scrollbar-hide ${
        isMobile
          ? (sidebarOpen ? 'w-64 z-40' : 'w-0 -translate-x-full z-40')
          : (sidebarOpen ? (sidebarCollapsed ? 'w-20 z-40' : 'w-64 z-40') : 'w-0 z-40')
      }`} style={{backgroundColor: 'rgba(9, 13, 14, 0.92)', scrollbarWidth: 'none', msOverflowStyle: 'none', borderRightWidth: '1px', borderRightColor: '#2f3031', backdropFilter: 'blur(12px)'}}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className={`mb-8 pt-2 flex items-center justify-center ${sidebarCollapsed ? 'flex-col gap-4' : 'justify-center'}`}>
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Faith Logo"
            width={32}
            height={32}
            className="object-contain flex-shrink-0"
          />
        </div>
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-green-500/20 rounded-lg transition text-gray-400 hover:text-green-400 absolute right-6"
          >
            <Menu size={18} />
          </button>
        )}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-green-500/20 rounded-lg transition text-gray-400 hover:text-green-400"
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-4">
        <a
          href="/home"
          onClick={() => handleNavClick('home')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${sidebarCollapsed && !isMobile ? 'justify-center' : ''} ${
            selectedPage === 'home' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'home' ? {border: '2px solid #2f3031'} : {}}
          title="Home"
        >
          <Home size={20} className="flex-shrink-0" style={{color: selectedPage === 'home' ? '#22c55e' : 'currentColor'}} />
          {(isMobile || !sidebarCollapsed) && <span>Home</span>}
        </a>
        
        {/* Profile - visible but disabled when not authenticated */}
        <a
          href={user ? "/me" : "#"}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              return;
            }
            handleNavClick('profile');
          }}
          className={`flex items-center gap-3 rounded-lg transition ${sidebarCollapsed && !isMobile ? 'justify-center' : 'px-4 py-2'} ${
            !user ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            selectedPage === 'profile' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'profile' ? {border: '2px solid #2f3031', padding: sidebarCollapsed && !isMobile ? '6px' : '8px 16px'} : {padding: sidebarCollapsed && !isMobile ? '6px' : '8px 16px'}}
          title={user ? "Profile" : "Login to access profile"}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="rounded-full object-cover flex-shrink-0" 
              style={{width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', borderRadius: '50%', borderWidth: '1px', borderColor: selectedPage === 'profile' ? '#22c55e' : '#666'}}
            />
          ) : (
            <User size={20} className="flex-shrink-0" style={{color: selectedPage === 'profile' ? '#22c55e' : 'currentColor'}} />
          )}
          {(isMobile || !sidebarCollapsed) && <span>Profile</span>}
        </a>
        
        {/* Settings - enabled for all users */}
        <a
          href="/settings"
          onClick={() => handleNavClick('settings')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${sidebarCollapsed && !isMobile ? 'justify-center' : ''} ${
            selectedPage === 'settings' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'settings' ? {border: '2px solid #2f3031'} : {}}
          title="Settings"
        >
          <Settings size={20} className="flex-shrink-0" style={{color: selectedPage === 'settings' ? '#22c55e' : 'currentColor'}} />
          {(isMobile || !sidebarCollapsed) && <span>Settings</span>}
        </a>
        
        <a
          href="/Docs"
          onClick={() => handleNavClick('Docs')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${sidebarCollapsed && !isMobile ? 'justify-center' : ''} ${
            selectedPage === 'Docs' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'Docs' ? {border: '2px solid #2f3031'} : {}}
          title="Docs"
        >
          <Home size={20} className="flex-shrink-0" style={{color: selectedPage === 'Docs' ? '#22c55e' : 'currentColor'}} />
          {(isMobile || !sidebarCollapsed) && <span>Docs</span>}
        </a>
      </nav>

      <a
        href="/create"
        className={`flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold py-2.5 px-4 text-sm rounded-full transition mb-4 w-full`}
      >
        <span>+</span>
        {(isMobile || !sidebarCollapsed) && <span>new coin</span>}
      </a>

      {/* Logout button when authenticated, Login button when not */}
      {user ? (
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 transition text-red-400 ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}`}
          title="Logout"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {(isMobile || !sidebarCollapsed) && <span>Logout</span>}
        </button>
      ) : (
        <a
          href="/login"
          className={`flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold py-2.5 px-4 text-sm rounded-lg transition w-full`}
          title="Login"
        >
          {(isMobile || !sidebarCollapsed) && <span>Login</span>}
        </a>
      )}
    </div>
    </>
  );
}
