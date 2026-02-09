'use client';

import { useWalletBalance } from '@/app/hooks/useWalletBalance';

interface DashboardTopbarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  user: {
    username: string;
    avatarUrl: string | null;
  };
}

export default function DashboardTopbar({ sidebarOpen, sidebarCollapsed, user }: DashboardTopbarProps) {
  const { balance, balanceUsd, loading } = useWalletBalance();

  return (
    <div className={`fixed top-0 right-0 border-b backdrop-blur flex items-center justify-center gap-6 z-50 h-24 px-6 transition-all duration-300 ${
      sidebarOpen ? (sidebarCollapsed ? 'left-20' : 'left-64') : 'left-0'
    }`} style={{backgroundColor: '#0d0d0f', borderBottomColor: '#2f3031'}}>
      {/* Search Bar - Takes up most space */}
      <div className="flex-1 max-w-2xl">
        <input
          type="text"
          placeholder="Search by CA or ticker"
          className="w-full border text-white placeholder-gray-500 px-4 py-2.5 rounded-lg text-sm focus:outline-none" 
          style={{backgroundColor: '#161617', borderColor: '#2f3031', color: '#ffffff'}} 
          onFocus={(e) => e.target.style.borderColor = '#22c55e'}
          onBlur={(e) => e.target.style.borderColor = '#2f3031'}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center gap-6 flex-shrink-0">
        <a href="#" className="text-gray-400 text-sm hover:text-green-400 transition whitespace-nowrap">
          [how it works]
        </a>
        
        <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-5 text-sm rounded-lg transition whitespace-nowrap">
          + new project
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-6" style={{borderLeftWidth: '1px', borderLeftColor: '#2f3031'}}>
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-9 h-9 rounded-full object-cover" 
              style={{border: '1px solid #2f3031'}}
            />
          )}
          <div className="text-right">
            <p className="text-xs font-semibold text-white">${user.username.toUpperCase()}</p>
            <p className="text-xs text-gray-400">{loading ? '...' : `${balance} SOL`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
