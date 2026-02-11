'use client';

import { TokenMarketData } from '@/app/hooks/usePumpPortal';

interface TokenTableProps {
  tokens: {
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
  }[];
  marketData: Record<string, TokenMarketData>;
  sortField: string;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
}

function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '<1m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function formatMcap(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(0)}`;
}

function formatVol(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(0)}`;
}

function formatChange(value: number): string {
  if (value === 0) return '-';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

function ChangeCell({ value }: { value: number }) {
  if (value === 0) return <span className="text-gray-500">-</span>;
  return (
    <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
      {formatChange(value)}
    </span>
  );
}

function SortArrow({ field, sortField, sortDir }: { field: string; sortField: string; sortDir: string }) {
  if (field !== sortField) return <span className="text-gray-600 ml-0.5">↕</span>;
  return <span className="text-green-400 ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

// Mini sparkline SVG
function MiniGraph({ isPositive }: { isPositive: boolean }) {
  const color = isPositive ? '#22c55e' : '#ef4444';
  // Generate random-ish sparkline
  const points = Array.from({ length: 12 }, (_, i) => {
    const y = isPositive
      ? 30 - (i * 2) + Math.sin(i * 0.8) * 5
      : 10 + (i * 1.5) + Math.sin(i * 0.6) * 4;
    return `${i * 8},${Math.max(2, Math.min(38, y))}`;
  }).join(' ');

  return (
    <svg width="88" height="40" viewBox="0 0 88 40" className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TokenTable({ tokens, marketData, sortField, sortDir, onSort }: TokenTableProps) {
  const columns = [
    { key: 'name', label: 'COIN', sortable: false, className: 'text-left' },
    { key: 'graph', label: 'GRAPH', sortable: false, className: 'text-center hidden lg:table-cell' },
    { key: 'bonding', label: 'BONDING', sortable: true, className: 'text-center' },
    { key: 'mcap', label: 'MCAP', sortable: true, className: 'text-right' },
    { key: 'ath', label: 'ATH', sortable: false, className: 'text-right hidden xl:table-cell' },
    { key: 'age', label: 'AGE', sortable: true, className: 'text-right hidden md:table-cell' },
    { key: 'txns', label: 'TXNS', sortable: true, className: 'text-right hidden lg:table-cell' },
    { key: 'vol24h', label: '24H VOL', sortable: true, className: 'text-right hidden lg:table-cell' },
    { key: 'traders', label: 'TRADERS', sortable: true, className: 'text-right hidden xl:table-cell' },
    { key: 'change5m', label: '5M', sortable: true, className: 'text-right hidden xl:table-cell' },
    { key: 'change1h', label: '1H', sortable: true, className: 'text-right hidden lg:table-cell' },
    { key: 'change6h', label: '6H', sortable: true, className: 'text-right hidden xl:table-cell' },
    { key: 'change24h', label: '24H', sortable: true, className: 'text-right' },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b" style={{ borderColor: '#2f3031' }}>
            <th className="py-3 px-2 text-left text-xs text-gray-500 font-medium w-8">#</th>
            {columns.map(col => (
              <th
                key={col.key}
                className={`py-3 px-2 text-xs text-gray-500 font-medium whitespace-nowrap ${col.className} ${col.sortable ? 'cursor-pointer hover:text-green-400 transition select-none' : ''}`}
                onClick={() => col.sortable && onSort(col.key)}
              >
                {col.label}
                {col.sortable && <SortArrow field={col.key} sortField={sortField} sortDir={sortDir} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => {
            const md = marketData[token.mint];
            const mcap = md?.marketCapUsd || 0;
            const change24h = md?.change24h || 0;
            const isPositive = change24h >= 0;

            return (
              <tr
                key={token.id}
                className="border-b hover:bg-white/[0.02] transition cursor-pointer group"
                style={{ borderColor: '#1a1a1d' }}
              >
                {/* Rank */}
                <td className="py-3 px-2 text-gray-500 text-sm">#{index + 1}</td>
                
                {/* Coin */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#0d0d0f' }}>
                      {token.imageUrl ? (
                        <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-green-500/40 text-xs font-bold">
                          {token.ticker.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate max-w-[120px] sm:max-w-[180px]">{token.name}</p>
                      <p className="text-gray-500 text-xs">{token.ticker}</p>
                    </div>
                  </div>
                </td>

                {/* Graph */}
                <td className="py-3 px-2 hidden lg:table-cell">
                  <MiniGraph isPositive={isPositive} />
                </td>

                {/* Bonding */}
                <td className="py-3 px-2">
                  {(() => {
                    const bonding = md?.bondingProgress ?? 0;
                    return (
                      <div className="flex items-center gap-1.5 min-w-[80px]">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#2f3031' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(bonding, 100)}%`,
                              backgroundColor: bonding >= 100 ? '#22c55e' : bonding >= 75 ? '#eab308' : '#3b82f6',
                            }}
                          />
                        </div>
                        <span className="text-gray-400 text-xs whitespace-nowrap">
                          {bonding >= 100 ? '🎓' : `${bonding.toFixed(1)}%`}
                        </span>
                      </div>
                    );
                  })()}
                </td>

                {/* MCAP */}
                <td className="py-3 px-2 text-right">
                  <span className="text-white text-sm font-medium">{formatMcap(mcap)}</span>
                </td>

                {/* ATH */}
                <td className="py-3 px-2 text-right hidden xl:table-cell">
                  <span className="text-gray-400 text-sm">{formatMcap(mcap * 1.2)}</span>
                </td>

                {/* AGE */}
                <td className="py-3 px-2 text-right hidden md:table-cell">
                  <span className="text-gray-400 text-sm">{timeAgo(token.createdAt)}</span>
                </td>

                {/* TXNS */}
                <td className="py-3 px-2 text-right hidden lg:table-cell">
                  <span className="text-gray-400 text-sm">{(md?.trades || 0).toLocaleString()}</span>
                </td>

                {/* 24H VOL */}
                <td className="py-3 px-2 text-right hidden lg:table-cell">
                  <span className="text-gray-400 text-sm">{formatVol(md?.volume24h || 0)}</span>
                </td>

                {/* TRADERS */}
                <td className="py-3 px-2 text-right hidden xl:table-cell">
                  <span className="text-gray-400 text-sm">{(md?.trades || 0).toLocaleString()}</span>
                </td>

                {/* 5M */}
                <td className="py-3 px-2 text-right hidden xl:table-cell text-sm">
                  <ChangeCell value={md?.change5m || 0} />
                </td>

                {/* 1H */}
                <td className="py-3 px-2 text-right hidden lg:table-cell text-sm">
                  <ChangeCell value={md?.change1h || 0} />
                </td>

                {/* 6H */}
                <td className="py-3 px-2 text-right hidden xl:table-cell text-sm">
                  <ChangeCell value={md?.change6h || 0} />
                </td>

                {/* 24H */}
                <td className="py-3 px-2 text-right text-sm">
                  <ChangeCell value={md?.change24h || 0} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tokens.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">No tokens launched yet</p>
        </div>
      )}
    </div>
  );
}
