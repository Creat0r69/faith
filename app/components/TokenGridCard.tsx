'use client';

import Image from 'next/image';
import { TokenMarketData } from '@/app/hooks/usePumpPortal';

interface TokenCardProps {
  token: {
    id: string;
    mint: string;
    name: string;
    ticker: string;
    description: string | null;
    imageUrl: string | null;
    isLive: boolean;
    createdAt: string;
    creator: {
      username: string;
      avatarUrl: string | null;
    };
  };
  marketData?: TokenMarketData;
  bondingProgress?: number;
}

function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatMcap(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatChange(value: number): string {
  const prefix = value >= 0 ? '↑' : '↓';
  return `${prefix} ${Math.abs(value).toFixed(2)}%`;
}

export default function TokenGridCard({ token, marketData, bondingProgress }: TokenCardProps) {
  const mcap = marketData?.marketCapUsd || 0;
  const change = marketData?.change24h || 0;
  const isPositive = change >= 0;
  const shortMint = token.mint.slice(0, 6);
  const bonding = bondingProgress ?? 0;

  return (
    <div
      className="rounded-lg overflow-hidden transition hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group relative"
      style={{ backgroundColor: '#161618', border: '1px solid #2f3031' }}
    >
      {/* Live badge */}
      {token.isLive && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-full" style={{ fontSize: '10px' }}>
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}

      {/* Token Image */}
      <div className="aspect-[4/3] w-full relative overflow-hidden" style={{ backgroundColor: '#0d0d0f' }}>
        {token.imageUrl ? (
          <img
            src={token.imageUrl}
            alt={token.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-green-500/30">{token.ticker.slice(0, 2)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        {/* Name & Ticker */}
        <div className="flex items-start justify-between mb-0.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold text-xs truncate">{token.name}</h3>
            <p className="text-gray-500" style={{ fontSize: '10px' }}>{token.ticker}</p>
          </div>
        </div>

        {/* Creator & Time */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-green-500/30 flex-shrink-0 overflow-hidden">
            {token.creator.avatarUrl && (
              <img src={token.creator.avatarUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <span className="text-gray-400 truncate" style={{ fontSize: '10px' }}>{shortMint}</span>
          <span className="text-gray-600" style={{ fontSize: '10px' }}>{timeAgo(token.createdAt)}</span>
        </div>

        {/* Bonding Curve Progress */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium flex-shrink-0" style={{ fontSize: '10px' }}>
            {bonding >= 100 ? '🎓' : `${bonding.toFixed(1)}%`}
          </span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#2f3031' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(bonding, 100)}%`,
                backgroundColor: bonding >= 100 ? '#22c55e' : bonding >= 75 ? '#eab308' : '#3b82f6',
              }}
            />
          </div>
        </div>

        {/* Market Cap & Change */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-white font-semibold" style={{ fontSize: '10px' }}>MC {formatMcap(mcap)}</span>
          <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`} style={{ fontSize: '10px' }}>
            {formatChange(change)}
          </span>
        </div>
      </div>
    </div>
  );
}
