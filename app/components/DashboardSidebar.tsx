'use client';

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
  };
  handleLogout: () => void;
}

export default function DashboardSidebar({
  sidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  selectedPage,
  setSelectedPage,
  user,
  handleLogout,
}: DashboardSidebarProps) {
  return (
    <div className={`fixed left-0 top-0 bottom-0 p-6 flex flex-col transition-all duration-300 overflow-y-auto z-40 scrollbar-hide ${
      sidebarOpen ? (sidebarCollapsed ? 'w-20' : 'w-64') : 'w-0'
    }`} style={{backgroundColor: '#0d0d0f', scrollbarWidth: 'none', msOverflowStyle: 'none', borderRightWidth: '1px', borderRightColor: '#2f3031'}}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className={`mb-8 pt-2 flex items-center justify-center ${sidebarCollapsed ? 'flex-col gap-4' : 'justify-center'}`}>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
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
          href="/me"
          onClick={() => setSelectedPage('home')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${sidebarCollapsed ? 'justify-center' : ''} ${
            selectedPage === 'home' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'home' ? {border: '2px solid #2f3031'} : {}}
          title="Home"
        >
          <Home size={20} className="flex-shrink-0" style={{color: selectedPage === 'home' ? '#22c55e' : 'currentColor'}} />
          {!sidebarCollapsed && <span>Home</span>}
        </a>
        <a
          href="/me"
          onClick={() => setSelectedPage('profile')}
          className={`flex items-center gap-3 rounded-lg transition ${sidebarCollapsed ? 'justify-center' : 'px-4 py-2'} ${
            selectedPage === 'profile' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'profile' ? {border: '2px solid #2f3031', padding: sidebarCollapsed ? '6px' : '8px 16px'} : {padding: sidebarCollapsed ? '6px' : '8px 16px'}}
          title="Profile"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="rounded-full object-cover flex-shrink-0" 
              style={{width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', borderRadius: '50%', borderWidth: '1px', borderColor: selectedPage === 'profile' ? '#22c55e' : '#666'}}
            />
          ) : (
            <User size={20} className="flex-shrink-0" style={{color: selectedPage === 'profile' ? '#22c55e' : 'currentColor'}} />
          )}
          {!sidebarCollapsed && <span>Profile</span>}
        </a>
        <a
          href="/settings"
          onClick={() => setSelectedPage('settings')}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${sidebarCollapsed ? 'justify-center' : ''} ${
            selectedPage === 'settings' ? 'text-white' : 'text-gray-400'
          }`}
          style={selectedPage === 'settings' ? {border: '2px solid #2f3031'} : {}}
          title="Settings"
        >
          <Settings size={20} className="flex-shrink-0" style={{color: selectedPage === 'settings' ? '#22c55e' : 'currentColor'}} />
          {!sidebarCollapsed && <span>Settings</span>}
        </a>
      </nav>

      <button
        className={`flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold py-2.5 px-4 text-sm rounded-full transition mb-4 ${sidebarCollapsed ? 'w-full' : 'w-full'}`}
      >
        <span>+</span>
        {!sidebarCollapsed && <span>new coin</span>}
      </button>

      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 transition text-red-400 ${sidebarCollapsed ? 'justify-center' : ''}`}
        title="Logout"
      >
        <LogOut size={20} className="flex-shrink-0" />
        {!sidebarCollapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
