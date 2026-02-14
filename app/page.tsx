'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Rocket, BarChart3, Wallet, Shield, Zap, Globe, Check, X, ChevronRight, Menu, X as XIcon, Github, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return;
      const rect = showcaseRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress: 0 when element enters viewport from bottom, 1 when it's at/above center
      const raw = 1 - (rect.top / windowH);
      setScrollProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ fontFamily: "'Roboto Mono', monospace" }}>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(6, 10, 10, 0.85)', borderColor: '#1a2a1a' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 text-sm hover:text-green-400 transition">Features</a>
            <a href="#why" className="text-gray-400 text-sm hover:text-green-400 transition">Why Faith?</a>
          </div>

          {/* Center logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Faith" width={32} height={32} className="rounded" />
          </div>

          {/* Right nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#showcase" className="text-gray-400 text-sm hover:text-green-400 transition">Platform</a>
            <Link href="/login" className="text-sm font-semibold text-black bg-green-500 hover:bg-green-400 rounded-full px-5 py-2 transition">
              Launch App
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-6 py-4 space-y-3" style={{ backgroundColor: 'rgba(6, 10, 10, 0.95)', borderColor: '#1a2a1a' }}>
            <a href="#features" className="block text-gray-400 text-sm hover:text-green-400">Features</a>
            <a href="#why" className="block text-gray-400 text-sm hover:text-green-400">Why Faith?</a>
            <a href="#showcase" className="block text-gray-400 text-sm hover:text-green-400">Platform</a>
            <Link href="/login" className="block text-center text-sm font-semibold text-black bg-green-500 hover:bg-green-400 rounded-full px-5 py-2">
              Launch App
            </Link>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 sm:pt-44 flex flex-col items-center text-center px-6">
        {/* Green glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.15) 0%, transparent 70%)' }} />

        <p className="text-green-400/80 text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
          Deploy tokens, track real-time markets, and manage your Solana portfolio — all in one platform
        </p>

        {/* Brand name with diamond border */}
        <div className="relative mb-8">
          {/* Diamond corners */}
          <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-green-500/40 rotate-0" />
          <div className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-green-500/40" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-green-500/40" />
          <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-green-500/40" />
          {/* Corner diamonds */}
          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500/60 rotate-45" />
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500/60 rotate-45" />
          <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-2 h-2 bg-green-500/60 rotate-45" />
          <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-2 h-2 bg-green-500/60 rotate-45" />

          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-green-400 px-8 py-4 tracking-tight" style={{ textShadow: '0 0 80px rgba(34, 197, 94, 0.3)' }}>
            Faith
          </h1>
        </div>

        <p className="text-gray-400 text-base sm:text-lg mb-10">
          Backed by Solana&apos;s fastest infrastructure
        </p>

        <Link
          href="/login"
          className="group relative inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-3 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black transition-all duration-300 z-50"
        >
          Launch App
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section id="showcase" className="relative px-6 -mt-20" ref={showcaseRef}>
        <div className="max-w-6xl mx-auto relative flex justify-center" style={{ perspective: '1200px' }}>
          {/* Large green aura glow behind */}
          <div
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.12) 30%, rgba(34, 197, 94, 0.04) 60%, transparent 80%)',
              opacity: 0.3 + scrollProgress * 0.7,
            }}
          />

          {/* Dashboard screenshot with 3D plane scroll animation — smaller size */}
          <div
            className="relative rounded-xl overflow-hidden transition-transform duration-100 ease-out w-full max-w-4xl"
            style={{
              transform: `rotateX(${Math.max(0, 60 - scrollProgress * 60)}deg) translateY(${350 - scrollProgress * 200}px)`,
              transformOrigin: 'center center',
              boxShadow: `0 0 80px rgba(34, 197, 94, ${0.1 + scrollProgress * 0.3})`,
              opacity: Math.max(0.3, Math.min(0.7, scrollProgress * 2)),
            }}
          >
            <Image
              src="/landingbg.png"
              alt="Faith Platform"
              width={1200}
              height={700}
              className="w-full h-auto"
              priority
            />
            {/* Bottom green fade */}
            <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, #060a0a 0%, rgba(34, 197, 94, 0.12) 50%, transparent 100%)' }} />
            {/* Side fades */}
            <div className="absolute inset-y-0 left-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #060a0a, transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(to left, #060a0a, transparent)' }} />
          </div>
        </div>
      </section>
      {/* ─── FEATURES BENTO GRID ─── */}
      <section id="features" className="px-6 py-20 sm:py-32 mt-10">
        <div className="max-w-6xl mx-auto">
                  <p className="text-center text-gray-400 text-sm sm:text-base mb-16">
          Deploy on Pump.fun and more launchpads
        </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-center text-white mb-3">
            <span className="italic text-green-400">Built</span> for Artists & Builders
          </h2>
          <p className="text-gray-500 text-center text-sm sm:text-base mb-16 max-w-xl mx-auto">
            Everything you need to launch and manage tokens.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large card */}
            <div className="md:col-span-2 md:row-span-2 rounded-xl border p-8 flex flex-col justify-between" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Token Deployment Engine</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                  Faith is the fastest way to deploy tokens on Solana. Select your platform, fill in the details, and we handle the rest — from liquidity to on-chain deployment. One click, fully automated.
                </p>
              </div>
              {/* Visual element */}
              <div className="mt-8 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  <div className="absolute inset-0 rounded-full border border-green-500/20 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border border-green-500/10" />
                  <div className="absolute inset-8 rounded-full border border-green-500/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Rocket size={40} className="text-green-400" />
                  </div>
                  {/* Orbiting dots */}
                  <div className="absolute top-2 left-1/2 w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'spin 8s linear infinite', transformOrigin: '0 94px' }} />
                </div>
              </div>
            </div>

            {/* Small card 1 */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <BarChart3 size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Market Data</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Live WebSocket feeds from PumpPortal. Track market cap, volume, bonding curves, and price changes in real-time.
              </p>
            </div>

            {/* Small card 2 */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Shield size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure by Default</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Privy-powered authentication with embedded wallets. Your keys, your tokens, fully non-custodial.
              </p>
            </div>

            {/* Small card 3 */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Zap size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Deployment</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Go from idea to live token in under 60 seconds. We provide the liquidity and handle all on-chain transactions.
              </p>
            </div>

            {/* Small card 4 */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Globe size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Platform</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Launch on Pump.fun today, with Bonk.fun, Meteora DLMM, and CPAMM coming soon. One interface, every launchpad.
              </p>
            </div>

            {/* Wide card */}
            <div className="md:col-span-2 rounded-xl border p-6" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Wallet size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Portfolio Tracking</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Monitor all your deployed tokens, track wallet balances, and view real-time P&L across your entire portfolio. Everything in one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE FAITH ─── */}
      <section id="why" className="px-6 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-center text-white mb-3">
            Why Choose <span className="italic text-green-400">Faith</span>?
          </h2>
          <p className="text-gray-500 text-center text-sm sm:text-base mb-16 max-w-xl mx-auto">
            Whether you&apos;re launching your first token or scaling a portfolio, Faith provides the speed, simplicity, and tools every builder needs.
          </p>

          {/* Comparison table */}
          <div className="grid grid-cols-2 rounded-xl border overflow-hidden" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
            {/* Headers */}
            <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: '#1a2a1a' }}>
              <Image src="/logo.png" alt="Faith" width={24} height={24} className="rounded" />
              <span className="text-green-400 font-bold text-lg">Faith</span>
            </div>
            <div className="p-6 border-b border-l flex items-center" style={{ borderColor: '#1a2a1a' }}>
              <span className="text-gray-400 font-bold text-lg">Other Platforms</span>
            </div>

            {/* Rows */}
            {[
              ['One-click token deployment', 'Complex multi-step processes'],
              ['Built-in liquidity provisioning', 'Bring your own liquidity'],
              ['Real-time WebSocket market data', 'Delayed or polling-based data'],
              ['Embedded wallet — no extensions', 'Requires wallet extensions'],
              ['Multi-launchpad support', 'Single platform only'],
            ].map(([good, bad], i) => (
              <div key={i} className="contents">
                <div className="p-4 sm:p-5 border-b flex items-start gap-3" style={{ borderColor: '#1a2a1a' }}>
                  <Check size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{good}</span>
                </div>
                <div className="p-4 sm:p-5 border-b border-l flex items-start gap-3" style={{ borderColor: '#1a2a1a' }}>
                  <X size={18} className="text-red-400/60 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 text-sm">{bad}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative px-6 py-20 sm:py-32">
        {/* Green glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.12) 0%, transparent 70%)' }} />

        <div className="max-w-3xl mx-auto rounded-xl border p-10 sm:p-16 text-center relative" style={{ backgroundColor: '#0c0f0f', borderColor: '#1a2a1a' }}>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready to launch your token?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            From idea to live Solana token in under 60 seconds. Faith handles deployment, liquidity, and market tracking — so you can focus on building.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-3 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t px-6 py-12" style={{ borderColor: '#1a2a1a' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="Faith" width={24} height={24} className="rounded" />
              <span className="text-green-400 font-bold tracking-wider">FAITH</span>
            </div>
            <p className="text-gray-600 text-xs mb-4">Token Deployment Platform</p>
            <div className="flex items-center gap-3">
              <a href="https://x.com/launchwithfaith" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-400 transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-green-400 transition">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="text-gray-600 hover:text-green-400 transition">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-gray-400 text-xs font-bold tracking-widest mb-3">SECTIONS</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-gray-600 text-sm hover:text-green-400 transition">Features</a>
              <a href="#why" className="block text-gray-600 text-sm hover:text-green-400 transition">Why Faith?</a>
              <a href="#showcase" className="block text-gray-600 text-sm hover:text-green-400 transition">Platform</a>
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-gray-400 text-xs font-bold tracking-widest mb-3">INFORMATION</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-600 text-sm hover:text-green-400 transition">FAQ</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-green-400 transition">Terms of Service</a>
              <a href="#" className="block text-gray-600 text-sm hover:text-green-400 transition">Contact</a>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-gray-400 text-xs font-bold tracking-widest mb-3">GET STARTED</h4>
            <p className="text-gray-600 text-xs mb-4">Deploy your first token in under a minute.</p>
            <Link
              href="/login"
              className="inline-block text-xs font-semibold rounded-full px-5 py-2 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black transition-all"
            >
              Launch App
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: '#1a2a1a' }}>
          <p className="text-gray-600 text-xs">&copy; 2026 Faith. All rights reserved.</p>
        </div>
      </footer>

      {/* Keyframe for orbit animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
