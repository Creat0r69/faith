'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletBalance } from '@/app/hooks/useWalletBalance';
import DashboardTopbar from '@/app/components/DashboardTopbar';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardFooter from '@/app/components/DashboardFooter';
import { useSidebarState } from '@/app/hooks/useSidebarState';

interface User {
  id: string;
  xUserId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}

export default function MePage() {
  const router = useRouter();
  const { user: privyUser, ready: privyReady, authenticated, logout: privyLogout } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed, isMobile, toggleSidebar, isLoaded } = useSidebarState();
  const [selectedPage, setSelectedPage] = useState('profile');
  const walletBalance = useWalletBalance();

  // Redirect to login if not authenticated with Privy
  useEffect(() => {
    if (privyReady && !authenticated) {
      console.log('[Me] Not authenticated with Privy, redirecting to login');
      router.push('/login');
    }
  }, [privyReady, authenticated, router]);

  // Fetch app user from our DB
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Solana wallet is auto-created by PrivyProvider config (createOnLogin: 'users-without-wallets')

  const handleLogout = async () => {
    try {
      // Logout from Privy
      await privyLogout();
      // Clear our session cookie
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-lg">Loading Faith...</div>
      </div>
    );
  }

  if (!user || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-lg">Not authenticated</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Top Navigation Bar */}
      <DashboardTopbar 
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        user={{
          username: user.username,
          avatarUrl: user.avatarUrl
        }}
        isMobile={isMobile}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="fixed inset-0 -z-10 pt-16">
          <style>{`
            @keyframes moveGlow1 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(100px, 50px); }
            }
            @keyframes moveGlow2 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-80px, -60px); }
            }
          `}</style>
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" style={{animation: 'moveGlow1 6s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" style={{animation: 'moveGlow2 8s ease-in-out infinite'}}></div>
        </div>

        {/* Sidebar */}
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          user={{
            avatarUrl: user.avatarUrl,
            name: user.name
          }}
          handleLogout={handleLogout}
          isMobile={isMobile}
          onCloseMobile={() => toggleSidebar()}
        />

        {/* Main Content */}
        <div className={`flex-1 flex items-start justify-center p-4 sm:p-8 transition-all duration-300 pb-24 ${
          isMobile ? 'mt-16 ml-0' : (sidebarOpen ? (sidebarCollapsed ? 'mt-24 ml-20' : 'mt-24 ml-64') : 'mt-24 ml-0')
        }`}>
          <style>{`
            @keyframes moveDotBottom {
              0% { 
                left: 5%;
                bottom: 0;
              }
              50% { 
                left: calc(100% - 20px);
                bottom: 0;
              }
              100% { 
                left: 5%;
                bottom: 0;
              }
            }
            @keyframes moveGlowBorder {
              0% {
                box-shadow: inset 0 -30px 20px -10px rgba(34, 197, 94, 0.6);
                background-position: 0% 0;
              }
              50% {
                box-shadow: inset calc(100% - 40px) -30px 20px -10px rgba(34, 197, 94, 0.6);
                background-position: 100% 0;
              }
              100% {
                box-shadow: inset 0 -30px 20px -10px rgba(34, 197, 94, 0.6);
                background-position: 200% 0;
              }
            }
            .card-dot {
              border: 1px solid #2f3031;
              position: relative;
              animation: moveGlowBorder 10s ease-in-out infinite;
            }
            .card-dot::after {
              content: '';
              position: absolute;
              width: 4px;
              height: 4px;
              background-color: #22c55e;
              border-radius: 50%;
              animation: moveDotBottom 10s ease-in-out infinite;
              filter: drop-shadow(0 0 3px rgba(34, 197, 94, 1)) drop-shadow(0 0 8px rgba(34, 197, 94, 0.9)) drop-shadow(0 2px 15px rgba(34, 197, 94, 0.7));
            }
            .card-glow {
              border: 1px solid #2f3031;
              position: relative;
              animation: moveGlowBorder 10s ease-in-out infinite;
            }
          `}</style>
          <div className="w-full max-w-lg">
            {/* Crypto Balance Card */}
            <div className="rounded-xl p-6 backdrop-blur transition card-dot mb-6" style={{backgroundColor: '#161618'}}>
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-4">
                  {user.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover shadow-lg shadow-green-500/30 flex-shrink-0" style={{borderWidth: '2px', borderColor: '#22c55e'}}
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-white">${user.username.toUpperCase()}</h4>
                    <p className="text-gray-400 text-xs">by {user.name}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-green-500/20 rounded-lg transition">
                  <Settings size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-5">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Balance</p>
                <h3 className="text-3xl font-bold text-green-400 mb-1">{walletBalance.loading ? '...' : `${walletBalance.balance} SOL`}</h3>
                <p className="text-gray-500 text-xs">{walletBalance.balanceUsd ? `$${walletBalance.balanceUsd}` : '$0.00'}</p>
              </div>

              <div className="border-t pt-4 mb-4" style={{borderTopColor: '#2f3031'}}>
                <p className="text-gray-400 text-xs mb-2">Wallet Address</p>
                <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-green-400">{walletBalance.shortAddress || 'No wallet'}</p>
                <button
                  onClick={() => {
                    if (walletBalance.address) {
                      navigator.clipboard.writeText(walletBalance.address);
                    }
                  }}
                  className="text-gray-400 hover:text-green-400 transition"
                  title="Copy address"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z"></path>
                      <path d="M13 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Earnings Card */}
            <div className="rounded-xl p-6 backdrop-blur transition card-glow mb-12" style={{backgroundColor: '#161618'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Earnings</p>
                  <p className="text-3xl font-bold text-green-400">$0.00</p>
                </div>
                <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-1.5 px-4 text-sm rounded-full transition" style={{border: '1px solid #2f3031'}}>
                  Share
                </button>
              </div>
            </div>

            {/* No launches message */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">No launches found</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
