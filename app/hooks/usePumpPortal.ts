'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface TokenTradeData {
  mint: string;
  traderPublicKey: string;
  txType: 'buy' | 'sell';
  tokenAmount: number;
  newTokenBalance: number;
  bondingCurveKey: string;
  vTokensInBondingCurve: number;
  vSolInBondingCurve: number;
  marketCapSol: number;
  signature: string;
  timestamp?: number;
}

export interface NewTokenData {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  traderPublicKey: string;
  initialBuy: number;
  bondingCurveKey: string;
  vTokensInBondingCurve: number;
  vSolInBondingCurve: number;
  marketCapSol: number;
  signature: string;
}

export interface TokenMarketData {
  marketCapSol: number;
  marketCapUsd: number;
  priceUsd: number;
  lastTradeType: 'buy' | 'sell';
  lastTradeAmount: number;
  lastUpdated: number;
  volume24h: number;
  trades: number;
  // Bonding curve progress (0-100)
  bondingProgress: number;
  // Price changes
  change5m: number;
  change1h: number;
  change6h: number;
  change24h: number;
}

// SOL price fetcher
const SOL_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';

export function usePumpPortal(tokenMints: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const [marketData, setMarketData] = useState<Record<string, TokenMarketData>>({});
  const [connected, setConnected] = useState(false);
  const [solPrice, setSolPrice] = useState(0);
  const subscribedRef = useRef<Set<string>>(new Set());
  const tradeHistoryRef = useRef<Record<string, { time: number; mcap: number }[]>>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Fetch SOL price periodically
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const res = await fetch(SOL_PRICE_URL);
        const data = await res.json();
        setSolPrice(data.solana.usd);
      } catch {
        setSolPrice(170); // fallback
      }
    };
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate price changes from trade history
  const calculateChanges = useCallback((mint: string) => {
    const history = tradeHistoryRef.current[mint] || [];
    const now = Date.now();
    const currentMcap = history.length > 0 ? history[history.length - 1].mcap : 0;
    
    const getChange = (minutes: number) => {
      const target = now - minutes * 60 * 1000;
      const past = history.find(h => h.time <= target);
      if (!past || past.mcap === 0) return 0;
      return ((currentMcap - past.mcap) / past.mcap) * 100;
    };

    return {
      change5m: getChange(5),
      change1h: getChange(60),
      change6h: getChange(360),
      change24h: getChange(1440),
    };
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    if (tokenMints.length === 0) return;

    const connect = () => {
      try {
        const ws = new WebSocket('wss://pumpportal.fun/api/data');
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          reconnectAttemptsRef.current = 0; // reset on successful connection
          subscribedRef.current.clear();

        // Subscribe to trades for all tokens
        if (tokenMints.length > 0) {
          ws.send(JSON.stringify({
            method: 'subscribeTokenTrade',
            keys: tokenMints,
          }));
          tokenMints.forEach(m => subscribedRef.current.add(m));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.mint && data.marketCapSol !== undefined) {
            const mint = data.mint;
            const now = Date.now();

            // Track trade history
            if (!tradeHistoryRef.current[mint]) {
              tradeHistoryRef.current[mint] = [];
            }
            tradeHistoryRef.current[mint].push({ time: now, mcap: data.marketCapSol });
            // Keep only last 24h of history
            const cutoff = now - 24 * 60 * 60 * 1000;
            tradeHistoryRef.current[mint] = tradeHistoryRef.current[mint].filter(h => h.time > cutoff);

            const changes = calculateChanges(mint);
            const marketCapUsd = data.marketCapSol * (solPrice || 170);

            // Calculate bonding curve progress
            // Pump.fun tokens graduate at ~85 SOL in the bonding curve
            const GRADUATION_SOL = 85;
            const vSol = data.vSolInBondingCurve || 0;
            const bondingProgress = Math.min((vSol / GRADUATION_SOL) * 100, 100);

            setMarketData(prev => {
              const existing = prev[mint];
              return {
                ...prev,
                [mint]: {
                  marketCapSol: data.marketCapSol,
                  marketCapUsd,
                  priceUsd: marketCapUsd / 1_000_000_000, // assuming 1B supply
                  lastTradeType: data.txType || 'buy',
                  lastTradeAmount: data.tokenAmount || 0,
                  lastUpdated: now,
                  volume24h: (existing?.volume24h || 0) + (data.tokenAmount || 0) * (marketCapUsd / 1_000_000_000),
                  trades: (existing?.trades || 0) + 1,
                  bondingProgress: bondingProgress || existing?.bondingProgress || 0,
                  ...changes,
                },
              };
            });
          }
        } catch (err) {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Exponential backoff: 3s, 6s, 12s, 24s... max 60s
        const delay = Math.min(3000 * Math.pow(2, reconnectAttemptsRef.current), 60000);
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        // Silently close — onclose will handle reconnect
        ws.close();
      };
      } catch {
        // WebSocket constructor can throw if URL is invalid or network is down
        setConnected(false);
        const delay = Math.min(3000 * Math.pow(2, reconnectAttemptsRef.current), 60000);
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [tokenMints.join(','), solPrice, calculateChanges]);

  return { marketData, connected, solPrice };
}
