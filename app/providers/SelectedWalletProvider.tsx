'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallets as useSolanaWallets } from '@privy-io/react-auth/solana';
import { usePrivy } from '@privy-io/react-auth';

interface SelectedWalletContextType {
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  allAddresses: string[];
}

const SelectedWalletContext = createContext<SelectedWalletContextType>({
  selectedAddress: '',
  setSelectedAddress: () => {},
  allAddresses: [],
});

export function SelectedWalletProvider({ children }: { children: ReactNode }) {
  const { ready: privyReady } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const [selectedAddress, setSelectedAddressState] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedWalletAddress');
    if (saved) {
      setSelectedAddressState(saved);
    }
  }, []);

  // When wallets load, set default if none selected or saved address no longer valid
  useEffect(() => {
    if (!privyReady || !solanaWallets || solanaWallets.length === 0) return;

    const addresses = solanaWallets.map(w => w.address);

    if (!selectedAddress || !addresses.includes(selectedAddress)) {
      // Use first wallet as default
      const defaultAddr = addresses[0];
      setSelectedAddressState(defaultAddr);
      localStorage.setItem('selectedWalletAddress', defaultAddr);
    }
  }, [privyReady, solanaWallets, selectedAddress]);

  const setSelectedAddress = (address: string) => {
    setSelectedAddressState(address);
    localStorage.setItem('selectedWalletAddress', address);
  };

  const allAddresses = solanaWallets?.map(w => w.address) || [];

  return (
    <SelectedWalletContext.Provider value={{ selectedAddress, setSelectedAddress, allAddresses }}>
      {children}
    </SelectedWalletContext.Provider>
  );
}

export function useSelectedWallet() {
  return useContext(SelectedWalletContext);
}
