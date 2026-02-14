'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Upload, Image as ImageIcon, ArrowLeft, ArrowRight, Check, Rocket, Wallet, FileCheck } from 'lucide-react';
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

type Platform = 'pumpfun' | 'bonkfun' | 'meteora_dlmm' | 'meteora_cpamm';

const PLATFORMS: { key: Platform; label: string; description: string; comingSoon?: boolean }[] = [
  { key: 'pumpfun', label: 'Pump.fun', description: 'Launch on the leading Solana memecoin platform' },
  { key: 'bonkfun', label: 'Bonk.fun', description: 'Launch on the Bonk ecosystem launchpad', comingSoon: true },
  { key: 'meteora_dlmm', label: 'Meteora DLMM', description: 'Dynamic Liquidity Market Maker pool', comingSoon: true },
  { key: 'meteora_cpamm', label: 'Meteora CPAMM', description: 'Constant Product AMM pool', comingSoon: true },
];

export default function CreateTokenPage() {
  const router = useRouter();
  const { ready: privyReady, authenticated, logout: privyLogout } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed, isMobile, toggleSidebar, isLoaded } = useSidebarState();
  const [selectedPage, setSelectedPage] = useState('create');

  // Wizard step
  const [step, setStep] = useState(1);

  // Step 1 — Platform & Token
  const [platform, setPlatform] = useState<Platform>('pumpfun');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — Wallet (fixed)
  const DEPLOY_WALLET = '57ZMWc1zXFwH3cNso8MWGM2gnRW7JQNmi3tcdeVFjLzd';
  const INITIAL_LIQUIDITY = '1';

  // Auth check — only fetch if authenticated
  useEffect(() => {
    if (!privyReady) return;
    
    if (!authenticated) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.status === 401) {
          setUser(null);
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
  }, [privyReady, authenticated]);

  const handleLogout = async () => {
    try {
      await privyLogout();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const canProceedStep1 = tokenName.trim() && tokenSymbol.trim();
  const canProceedStep2 = true; // wallets step is optional for now

  const steps = [
    { number: 1, label: 'Platform & Token', icon: Rocket },
    { number: 2, label: 'Deployment', icon: Wallet },
    { number: 3, label: 'Review', icon: FileCheck },
  ];

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-lg">Loading Faith...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col">
      <DashboardTopbar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        user={user ? { username: user.username, avatarUrl: user.avatarUrl } : null}
        isMobile={isMobile}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1 relative overflow-hidden">
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          user={user ? { avatarUrl: user.avatarUrl, name: user.name } : null}
          handleLogout={handleLogout}
          isMobile={isMobile}
          onCloseMobile={() => toggleSidebar()}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 pb-20 ${
          isMobile ? 'mt-16 ml-0' : (sidebarOpen ? (sidebarCollapsed ? 'mt-24 ml-20' : 'mt-24 ml-64') : 'mt-24 ml-0')
        }`}>
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: 'monospace' }}>
                TOKEN DEPLOYMENT
              </h1>
              <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'monospace' }}>
                Deploy your token on Pump.fun, Bonk.fun, MeteoraDLMM, or MeteoraCPAMM
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8 px-4">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        step === s.number
                          ? 'bg-green-500 text-black'
                          : step > s.number
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'text-gray-500 border border-gray-700'
                      }`}
                    >
                      {step > s.number ? <Check size={18} /> : s.number}
                    </div>
                    <span
                      className={`text-xs mt-2 whitespace-nowrap ${
                        step === s.number ? 'text-green-400' : step > s.number ? 'text-green-400/60' : 'text-gray-600'
                      }`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-3 mt-[-20px]">
                      <div
                        className="h-px w-full"
                        style={{ backgroundColor: step > s.number ? '#22c55e40' : '#2f3031' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Platform & Token Details */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Platform Selection */}
                <div className="rounded-xl border p-5" style={{ backgroundColor: '#111113', borderColor: '#1e3a2a' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Rocket size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-bold tracking-widest" style={{ fontFamily: 'monospace' }}>
                      {'>'} PLATFORM {'<'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.key}
                        onClick={() => !p.comingSoon && setPlatform(p.key)}
                        disabled={p.comingSoon}
                        className={`rounded-lg border p-3 text-left transition relative ${
                          p.comingSoon
                            ? 'border-gray-800 bg-white/[0.01] opacity-50 cursor-not-allowed'
                            : platform === p.key
                            ? 'border-green-500 bg-green-500/10 hover:border-green-500/50'
                            : 'border-gray-700/50 bg-white/[0.02] hover:border-green-500/50'
                        }`}
                      >
                        <span className={`text-sm font-semibold ${platform === p.key && !p.comingSoon ? 'text-green-400' : 'text-white'}`}>
                          {p.label}
                        </span>
                        {p.comingSoon && (
                          <span className="block text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: 'monospace' }}>COMING SOON</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Token Details */}
                <div className="rounded-xl border p-5" style={{ backgroundColor: '#111113', borderColor: '#1e3a2a' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-green-400 text-sm font-bold tracking-widest" style={{ fontFamily: 'monospace' }}>
                      {'>'} TOKEN DETAILS {'<'}
                    </span>
                  </div>

                  {/* Name, Symbol, Logo row */}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 mb-5">
                    {/* Name */}
                    <div>
                      <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                        {'>'} NAME * {'<'}
                      </label>
                      <input
                        type="text"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        placeholder="TOKEN NAME"
                        className="w-full border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                      />
                    </div>

                    {/* Symbol */}
                    <div>
                      <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                        {'>'} SYMBOL * {'<'}
                      </label>
                      <input
                        type="text"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                        placeholder="SYMBOL"
                        className="w-full border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                      />
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                        {'>'} LOGO * {'<'}
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e)}
                        className="hidden"
                      />
                      {logoPreview ? (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-[42px] rounded-lg border overflow-hidden flex items-center gap-2 px-3 hover:border-green-500 transition"
                          style={{ borderColor: '#1e3a2a', backgroundColor: '#0d0d0f' }}
                        >
                          <img src={logoPreview} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-green-400 text-xs truncate">{logoFile?.name}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-[42px] border rounded-lg flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-green-400 hover:border-green-500 transition"
                          style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                        >
                          <Upload size={14} />
                          UPLOAD
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-5">
                    <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                      {'>'} DESCRIPTION {'<'}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="DESCRIBE YOUR TOKEN"
                      rows={4}
                      className="w-full border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition resize-y"
                      style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                    />
                  </div>

                  {/* Social Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                        {'>'} TWITTER {'<'}
                      </label>
                      <input
                        type="url"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="https://x.com/..."
                        className="w-full border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                        {'>'} TELEGRAM {'<'}
                      </label>
                      <input
                        type="url"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="https://t.me/..."
                        className="w-full border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                        {'>'} WEBSITE {'<'}
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
                        style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Deployment Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-xl border p-5" style={{ backgroundColor: '#111113', borderColor: '#1e3a2a' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <Wallet size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-bold tracking-widest" style={{ fontFamily: 'monospace' }}>
                      {'>'} DEPLOYMENT INFO {'<'}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: 'monospace' }}>
                    We handle everything for you. Your token will be launched with the configuration below.
                  </p>

                  {/* Deployer Wallet */}
                  <div className="mb-5">
                    <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                      {'>'} DEPLOYER WALLET {'<'}
                    </label>
                    <div
                      className="border rounded-lg px-4 py-3 text-sm text-white flex items-center gap-2"
                      style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                    >
                      <span className="text-green-400">◆</span>
                      <span className="truncate">{DEPLOY_WALLET}</span>
                    </div>
                  </div>

                  {/* Initial Liquidity */}
                  <div className="mb-5">
                    <label className="text-green-400/80 text-xs font-bold tracking-widest mb-1.5 block" style={{ fontFamily: 'monospace' }}>
                      {'>'} INITIAL LIQUIDITY {'<'}
                    </label>
                    <div
                      className="border rounded-lg px-4 py-3 text-sm text-white"
                      style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a', fontFamily: 'monospace' }}
                    >
                      {INITIAL_LIQUIDITY} SOL
                    </div>
                    <p className="text-gray-600 text-xs mt-1.5" style={{ fontFamily: 'monospace' }}>
                      Fixed liquidity provided at launch
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="rounded-lg border px-4 py-3 flex items-start gap-3" style={{ backgroundColor: '#0d0d0f', borderColor: '#22c55e20' }}>
                    <span className="text-green-400 text-lg mt-0.5">ℹ</span>
                    <p className="text-gray-400 text-xs leading-relaxed" style={{ fontFamily: 'monospace' }}>
                      Faith deploys your token automatically using our platform wallet. No wallet connection or gas fees required from you.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-xl border p-5" style={{ backgroundColor: '#111113', borderColor: '#1e3a2a' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <FileCheck size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-bold tracking-widest" style={{ fontFamily: 'monospace' }}>
                      {'>'} REVIEW {'<'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Token Preview */}
                    <div className="flex items-center gap-4 p-4 rounded-lg border" style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a' }}>
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3a2a' }}>
                          <ImageIcon size={24} className="text-green-400/40" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white text-lg font-bold">{tokenName || 'Untitled Token'}</h3>
                        <p className="text-green-400 text-sm" style={{ fontFamily: 'monospace' }}>${tokenSymbol || '???'}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Platform', value: PLATFORMS.find(p => p.key === platform)?.label },
                        { label: 'Liquidity', value: `${INITIAL_LIQUIDITY} SOL` },
                        { label: 'Deployer', value: `${DEPLOY_WALLET.slice(0, 4)}...${DEPLOY_WALLET.slice(-4)}` },
                        { label: 'Twitter', value: twitter || '—' },
                        { label: 'Telegram', value: telegram || '—' },
                        { label: 'Website', value: website || '—' },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-lg border" style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a' }}>
                          <p className="text-gray-500 text-xs mb-0.5" style={{ fontFamily: 'monospace' }}>{'>'} {item.label.toUpperCase()} {'<'}</p>
                          <p className="text-white text-sm truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    {description && (
                      <div className="p-3 rounded-lg border" style={{ backgroundColor: '#0d0d0f', borderColor: '#1e3a2a' }}>
                        <p className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'monospace' }}>{'>'} DESCRIPTION {'<'}</p>
                        <p className="text-gray-300 text-sm">{description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white border rounded-lg px-5 py-2.5 text-sm transition"
                  style={{ borderColor: '#2f3031', fontFamily: 'monospace' }}
                >
                  <ArrowLeft size={16} />
                  BACK
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !canProceedStep1}
                  className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                    (step === 1 && !canProceedStep1)
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-black'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  NEXT
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  disabled={!authenticated}
                  onClick={() => {
                    if (!authenticated) return;
                    // TODO: Implement token deployment logic
                    console.log('Deploying token:', { tokenName, tokenSymbol, description });
                  }}
                  className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                    !authenticated
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-black'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                  title={!authenticated ? 'Login to deploy token' : 'Deploy token'}
                >
                  <Rocket size={16} />
                  DEPLOY TOKEN
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}
