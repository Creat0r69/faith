'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Copy, Check } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useCreateWallet, useWallets as useSolanaWallets, useExportWallet, useImportWallet } from '@privy-io/react-auth/solana';
import DashboardTopbar from '@/app/components/DashboardTopbar';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import DashboardFooter from '@/app/components/DashboardFooter';
import { useSidebarState } from '@/app/hooks/useSidebarState';
import { useSelectedWallet } from '@/app/providers/SelectedWalletProvider';

interface User {
  id: string;
  xUserId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface Wallet {
  id: string;
  address: string;
  isSelected: boolean;
}

export default function WalletsPage() {
  const router = useRouter();
  const { user: privyUser, ready: privyReady, logout: privyLogout } = usePrivy();
  const { wallets: privyWallets } = useSolanaWallets();
  const { createWallet } = useCreateWallet();
  const { exportWallet } = useExportWallet();
  const { importWallet } = useImportWallet();
  const { selectedAddress, setSelectedAddress } = useSelectedWallet();
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed, isMobile, toggleSidebar, isLoaded } = useSidebarState();
  const [selectedPage, setSelectedPage] = useState('wallets');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importPrivateKey, setImportPrivateKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [balances, setBalances] = useState<Record<string, { sol: string; usd: string | null }>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setAppUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Sync Privy wallets with state (filter for Solana wallets only)
  useEffect(() => {
    console.log('[Wallets] Privy state - Ready:', privyReady, 'User:', !!privyUser, 'Wallets count:', privyWallets?.length || 0);
    if (privyWallets && privyWallets.length > 0) {
      console.log('[Wallets] Found Solana wallets:', privyWallets.map(w => ({ address: w.address })));
      const syncedWallets = privyWallets.map((w) => ({
        id: w.address,
        address: w.address.slice(0, 6) + '...' + w.address.slice(-4),
        fullAddress: w.address,
        isSelected: w.address === selectedAddress,
      }));
      setWallets(syncedWallets as Wallet[]);

      // Fetch balances for all wallets
      syncedWallets.forEach((w) => {
        fetchBalance(w.id);
      });
    } else {
      console.log('[Wallets] No wallets found yet');
    }
  }, [privyWallets, privyReady, privyUser]);

  const fetchBalance = async (address: string) => {
    try {
      const res = await fetch(`/api/wallet/balance?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setBalances(prev => ({
          ...prev,
          [address]: { sol: data.balance, usd: data.balanceUsd },
        }));
      }
    } catch (error) {
      console.error('Failed to fetch balance for', address, error);
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

  const handleGenerateWallet = async () => {
    // Check if user is authenticated with Privy
    if (!privyUser) {
      console.warn('User not authenticated with Privy yet');
      alert('Please wait for wallet authentication to complete or try again in a moment');
      return;
    }

    try {
      setCreatingWallet(true);
      console.log('Creating additional wallet...');
      
      // Create a new embedded Solana wallet using Privy
      const result = await createWallet();
      
      console.log('Solana wallet created:', result);
      alert('Wallet created successfully!');
      setShowGenerateModal(false);
    } catch (error) {
      console.error('Failed to create wallet:', error);
      alert(`Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCreatingWallet(false);
    }
  };

  const handleImportWallet = async () => {
    if (!importPrivateKey.trim()) {
      alert('Please enter a private key');
      return;
    }
    try {
      const result = await importWallet({ privateKey: importPrivateKey.trim() });
      console.log('Wallet imported:', result);
      alert('Wallet imported successfully!');
      setImportPrivateKey('');
      setShowImportModal(false);
    } catch (error) {
      console.error('Failed to import wallet:', error);
      alert(`Failed to import wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExportPrivateKey = async (address: string) => {
    try {
      await exportWallet({ address });
    } catch (error) {
      console.error('Failed to export wallet:', error);
      alert(`Failed to export private key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectWallet = (id: string) => {
    setSelectedAddress(id);
    setWallets(wallets.map(w => ({ ...w, isSelected: w.id === id })));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!appUser || !isLoaded) {
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
          username: appUser.username,
          avatarUrl: appUser.avatarUrl
        }}
        isMobile={isMobile}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="fixed inset-0 -z-10 pt-24">
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
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" style={{ animation: 'moveGlow1 6s ease-in-out infinite' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" style={{ animation: 'moveGlow2 8s ease-in-out infinite' }}></div>
        </div>

        {/* Sidebar */}
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          user={{
            avatarUrl: appUser.avatarUrl,
            name: appUser.name
          }}
          handleLogout={handleLogout}
          isMobile={isMobile}
          onCloseMobile={() => toggleSidebar()}
        />

        {/* Main Content */}
        <div className={`flex-1 flex items-start justify-center p-4 sm:p-8 transition-all duration-300 pb-24 ${
          isMobile ? 'mt-16 ml-0' : (sidebarOpen ? (sidebarCollapsed ? 'mt-24 ml-20' : 'mt-24 ml-64') : 'mt-24 ml-0')
        }`}>
          <div className="w-full max-w-2xl">
            {/* Debug Info - Remove in production */}

            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">Wallet Management</h1>
              <p className="text-gray-400 text-sm sm:text-base">Select a wallet to view its launched coins and royalties</p>
            </div>

            {/* Solana Wallets Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Solana Wallets</h2>
                <button
                  onClick={() => setShowGenerateModal(true)}
                  disabled={wallets.length > 0}
                  className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition ${
                    wallets.length > 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                >
                  <Plus size={18} />
                  <span>Generate</span>
                </button>
              </div>

              {/* Wallets List */}
              <div className="space-y-3">
                {!privyReady ? (
                  <p className="text-gray-400 text-center py-8">Initializing wallet system...</p>
                ) : !privyUser ? (
                  <p className="text-gray-400 text-center py-8">Loading wallets...</p>
                ) : wallets.length > 0 ? (
                  wallets.map(wallet => (
                    <button
                      key={wallet.id}
                      onClick={() => handleSelectWallet(wallet.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 rounded-xl transition"
                      style={{
                        backgroundColor: '#161618',
                        border: '1px solid #2f3031',
                      }}
                    >
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-white font-semibold mb-1 text-sm sm:text-base truncate">{wallet.address}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-green-400 text-xs sm:text-sm font-bold">
                            {balances[wallet.id] ? `${balances[wallet.id].sol} SOL` : 'Loading...'}
                            {balances[wallet.id]?.usd && (
                              <span className="text-gray-400 font-normal ml-1">(${balances[wallet.id].usd})</span>
                            )}
                          </span>
                          <span className="text-gray-600 hidden sm:inline">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportPrivateKey(wallet.id);
                            }}
                            className="text-green-400 text-sm font-medium cursor-pointer hover:text-green-300 transition"
                          >
                            export private key
                          </button>
                        </div>
                      </div>
                      <div>
                        {wallet.isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                            <Check size={16} className="text-black" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full" style={{ border: '2px solid #2f3031' }}></div>
                        )}
                      </div>
                    </button>
                  ))
                ) : privyUser ? (
                  <p className="text-gray-400 text-center py-8">No wallets yet. Generate one to get started!</p>
                ) : null}
              </div>

              {/* Import Button */}
              <button
                onClick={() => setShowImportModal(true)}
                className="w-full mt-6 py-3 px-6 rounded-lg font-semibold transition"
                style={{
                  backgroundColor: '#161618',
                  border: '1px solid #2f3031',
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#22c55e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2f3031';
                }}
              >
                + Import Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Wallet Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="rounded-xl p-8 max-w-md w-full mx-4"
            style={{ backgroundColor: '#161618', border: '1px solid #2f3031' }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Generate New Wallet</h2>
            <p className="text-gray-400 mb-6">
              A new Solana wallet will be created and securely stored. Make sure to backup your recovery phrase.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleGenerateWallet}
                disabled={creatingWallet}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-lg transition"
              >
                {creatingWallet ? 'Creating Wallet...' : 'Generate Wallet'}
              </button>
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={creatingWallet}
                className="w-full py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #2f3031',
                  color: '#ffffff'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Wallet Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="rounded-xl p-8 max-w-md w-full mx-4"
            style={{ backgroundColor: '#161618', border: '1px solid #2f3031' }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Import Wallet</h2>
            <p className="text-gray-400 mb-6">
              Enter your private key to import an existing wallet.
            </p>

            <input
              type="password"
              placeholder="Paste your private key"
              value={importPrivateKey}
              onChange={(e) => setImportPrivateKey(e.target.value)}
              className="w-full px-4 py-2 rounded-lg mb-4 text-white placeholder-gray-500"
              style={{
                backgroundColor: '#0d0d0f',
                border: '1px solid #2f3031',
              }}
            />

            <div className="space-y-4">
              <button
                onClick={handleImportWallet}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-lg transition"
              >
                Import Wallet
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportPrivateKey('');
                }}
                className="w-full py-3 px-4 rounded-lg font-semibold transition"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #2f3031',
                  color: '#ffffff'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
