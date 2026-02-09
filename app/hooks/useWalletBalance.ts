'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSelectedWallet } from '@/app/providers/SelectedWalletProvider';

interface WalletBalance {
  address: string;
  shortAddress: string;
  balance: string;
  balanceUsd: string | null;
  loading: boolean;
}

export function useWalletBalance() {
  const { ready: privyReady } = usePrivy();
  const { selectedAddress } = useSelectedWallet();
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    address: '',
    shortAddress: '',
    balance: '0',
    balanceUsd: null,
    loading: true,
  });

  useEffect(() => {
    if (!privyReady || !selectedAddress) {
      setWalletBalance(prev => ({ ...prev, loading: !privyReady }));
      return;
    }

    const shortAddress = selectedAddress.slice(0, 4) + '...' + selectedAddress.slice(-4);

    setWalletBalance(prev => ({
      ...prev,
      address: selectedAddress,
      shortAddress,
      loading: true,
    }));

    fetch(`/api/wallet/balance?address=${selectedAddress}`)
      .then(res => res.json())
      .then(data => {
        setWalletBalance({
          address: selectedAddress,
          shortAddress,
          balance: data.balance || '0',
          balanceUsd: data.balanceUsd || null,
          loading: false,
        });
      })
      .catch(err => {
        console.error('Failed to fetch wallet balance:', err);
        setWalletBalance(prev => ({ ...prev, loading: false }));
      });
  }, [privyReady, selectedAddress]);

  return walletBalance;
}
