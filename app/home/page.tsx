'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import DashboardTopbar from '@/app/components/DashboardTopbar';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardFooter from '@/app/components/DashboardFooter';
import TokenGridCard from '@/app/components/TokenGridCard';
import TokenTable from '@/app/components/TokenTable';
import { useSidebarState } from '@/app/hooks/useSidebarState';
import { usePumpPortal, TokenMarketData } from '@/app/hooks/usePumpPortal';

interface User {
  id: string;
  xUserId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface TokenFromDB {
  id: string;
  mint: string;
  name: string;
  ticker: string;
  description: string | null;
  imageUrl: string | null;
  isLive: boolean;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
}

type ViewMode = 'grid' | 'table';
type FilterTab = 'movers' | 'live' | 'new' | 'marketcap' | 'oldest';

const FILTER_TABS: { key: FilterTab; label: string; icon: string }[] = [
  { key: 'movers', label: 'Movers', icon: '⭐' },
  { key: 'live', label: 'Live', icon: '🔴' },
  { key: 'new', label: 'New', icon: '🚀' },
  { key: 'marketcap', label: 'Market cap', icon: '🔥' },
  { key: 'oldest', label: 'Oldest', icon: '🔥' },
];

export default function HomePage() {
  const router = useRouter();
  const { ready: privyReady, authenticated, logout: privyLogout } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<TokenFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed, isMobile, toggleSidebar, isLoaded } = useSidebarState();
  const [selectedPage, setSelectedPage] = useState('home');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('movers');
  const [sortField, setSortField] = useState('mcap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Extract mints for PumpPortal subscription
  const tokenMints = useMemo(() => tokens.map(t => t.mint), [tokens]);
  const { marketData, connected } = usePumpPortal(tokenMints);

  // Auth check
  useEffect(() => {
    if (privyReady && !authenticated) {
      router.push('/login');
    }
  }, [privyReady, authenticated, router]);

  // Fetch user
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
      }
    };
    fetchUser();
  }, [router]);

  // Fetch tokens, then enrich with real metadata from DexScreener
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch('/api/tokens');
        if (res.ok) {
          const data = await res.json();
          setTokens(data.tokens);

          // Check if any tokens need metadata (no image or placeholder name)
          const needsMeta = data.tokens.filter(
            (t: TokenFromDB) => !t.imageUrl || t.name.startsWith('Test Token')
          );
          if (needsMeta.length > 0) {
            try {
              const metaRes = await fetch('/api/tokens/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mints: needsMeta.map((t: TokenFromDB) => t.mint) }),
              });
              if (metaRes.ok) {
                const metaData = await metaRes.json();
                // Update tokens with real metadata
                setTokens((prev: TokenFromDB[]) =>
                  prev.map((t: TokenFromDB) => {
                    const meta = metaData.metadata[t.mint];
                    if (meta) {
                      return {
                        ...t,
                        name: meta.name || t.name,
                        ticker: meta.ticker || t.ticker,
                        imageUrl: meta.imageUrl || t.imageUrl,
                        description: meta.description || t.description,
                      };
                    }
                    return t;
                  })
                );
              }
            } catch (metaErr) {
              console.error('Failed to fetch token metadata:', metaErr);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, []);

  // Sort tokens based on active filter and market data
  const sortedTokens = useMemo(() => {
    let sorted = [...tokens];

    switch (activeFilter) {
      case 'movers':
        sorted.sort((a, b) => {
          const aChange = Math.abs(marketData[a.mint]?.change24h || 0);
          const bChange = Math.abs(marketData[b.mint]?.change24h || 0);
          return bChange - aChange;
        });
        break;
      case 'live':
        sorted = sorted.filter(t => t.isLive);
        break;
      case 'new':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'marketcap':
        sorted.sort((a, b) => {
          const aMcap = marketData[a.mint]?.marketCapUsd || 0;
          const bMcap = marketData[b.mint]?.marketCapUsd || 0;
          return bMcap - aMcap;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    // Apply table sort if in table mode
    if (viewMode === 'table' && sortField) {
      sorted.sort((a, b) => {
        let aVal = 0, bVal = 0;
        const aMd = marketData[a.mint];
        const bMd = marketData[b.mint];

        switch (sortField) {
          case 'mcap': aVal = aMd?.marketCapUsd || 0; bVal = bMd?.marketCapUsd || 0; break;
          case 'age': aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break;
          case 'txns': aVal = aMd?.trades || 0; bVal = bMd?.trades || 0; break;
          case 'vol24h': aVal = aMd?.volume24h || 0; bVal = bMd?.volume24h || 0; break;
          case 'traders': aVal = aMd?.trades || 0; bVal = bMd?.trades || 0; break;
          case 'change5m': aVal = aMd?.change5m || 0; bVal = bMd?.change5m || 0; break;
          case 'change1h': aVal = aMd?.change1h || 0; bVal = bMd?.change1h || 0; break;
          case 'change6h': aVal = aMd?.change6h || 0; bVal = bMd?.change6h || 0; break;
          case 'change24h': aVal = aMd?.change24h || 0; bVal = bMd?.change24h || 0; break;
        }

        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return sorted;
  }, [tokens, activeFilter, marketData, viewMode, sortField, sortDir]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleLogout = async () => {
    try {
      await privyLogout();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-lg">Loading Faith...</div>
      </div>
    );
  }

  if (!user) {
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
        user={{ username: user.username, avatarUrl: user.avatarUrl }}
        isMobile={isMobile}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          user={{ avatarUrl: user.avatarUrl, name: user.name }}
          handleLogout={handleLogout}
          isMobile={isMobile}
          onCloseMobile={() => toggleSidebar()}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 pb-20 ${
          isMobile ? 'mt-16 ml-0' : (sidebarOpen ? (sidebarCollapsed ? 'mt-24 ml-20' : 'mt-24 ml-64') : 'mt-24 ml-0')
        }`}>
          {/* Filter Tabs + View Toggle Bar */}
          <div className="sticky top-16 sm:top-24 z-30 border-b px-3 sm:px-6 py-3 backdrop-blur-md" style={{ backgroundColor: 'rgba(9, 13, 14, 0.85)', borderColor: '#2f3031' }}>
            <div className="flex items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide flex-1" style={{ scrollbarWidth: 'none' }}>
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                {FILTER_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                      activeFilter === tab.key
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden xs:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* View Toggle + Filter Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Filter button */}
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition hidden sm:flex">
                  <span>Filter</span>
                  <SlidersHorizontal size={16} />
                </button>

                {/* Grid / Table toggle */}
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid #2f3031' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition ${viewMode === 'grid' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}
                    title="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 transition ${viewMode === 'table' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}
                    title="Table view"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-3 sm:px-6 py-4 sm:py-6 flex-1">
            {/* Connection indicator */}
            {tokenMints.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-gray-500 text-xs">
                  {connected ? 'Live data connected' : 'Connecting...'}
                </span>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2.5">
                {sortedTokens.map(token => (
                  <TokenGridCard
                    key={token.id}
                    token={token}
                    marketData={marketData[token.mint]}
                    bondingProgress={marketData[token.mint]?.bondingProgress}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <TokenTable
                tokens={sortedTokens}
                marketData={marketData}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
              />
            )}

            {/* Empty State */}
            {!loading && sortedTokens.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">No tokens launched yet</h3>
                <p className="text-gray-400 text-sm mb-6">Be the first to launch a token on Faith</p>
                <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-2.5 px-6 rounded-lg transition">
                  + Launch Token
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
