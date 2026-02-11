'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
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

export default function SettingsPage() {
  const router = useRouter();
  const { logout: privyLogout } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed, isMobile, toggleSidebar, isLoaded } = useSidebarState();
  const [selectedPage, setSelectedPage] = useState('settings');

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

  const handleLogout = async () => {
    try {
      await privyLogout();
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
        <div className="text-green-400 text-lg">Loading...</div>
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

  const settingsItems = [
    { label: 'my wallets', href: '/wallets' },
    { label: 'follow @launchwithfaith on x', href: 'https://x.com/launchwithfaith' },
    { label: 'get help' },
    { label: 'chat with support' },
    { label: 'sign out', onClick: handleLogout },
  ];

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
          <div className="w-full max-w-lg">
            {/* Profile Section */}
            <div className="text-center mb-8 sm:mb-12">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" 
                  style={{borderWidth: '2px', borderColor: '#22c55e'}}
                />
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">${user.username.toUpperCase()}</h1>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                &#128279; {user.bio || 'No bio set'}
              </p>
            </div>
              
            {/* Settings Items */}
            <div className="space-y-3">
              {settingsItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href || '#'}
                  target={item.href && item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition hover:bg-green-500/10 group block"
                  style={{
                    backgroundColor: '#161618',
                    border: '1px solid #2f3031'
                  }}
                >
                  <span className="text-white font-medium">{item.label}</span>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-green-400 transition" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
