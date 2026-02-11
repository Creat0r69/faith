'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy, useLoginWithOAuth } from '@privy-io/react-auth';

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const { initOAuth } = useLoginWithOAuth({
    onComplete: async ({ user, isNewUser }) => {
      console.log('[Login] Privy OAuth complete. User:', user);
      console.log('[Login] Is new user:', isNewUser);
      console.log('[Login] Twitter data:', user.twitter);

      // Save user to our database and create session
      try {
        const res = await fetch('/api/auth/privy-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            privyUserId: user.id,
            twitterUsername: user.twitter?.username || '',
            twitterName: user.twitter?.name || '',
            twitterProfileImage: user.twitter?.profilePictureUrl || null,
            twitterSubject: user.twitter?.subject || '',
          }),
        });

        if (res.ok) {
          console.log('[Login] User synced to database');
          router.push('/me');
        } else {
          console.error('[Login] Failed to sync user:', await res.text());
          setError('Failed to save user data. Please try again.');
          setLoggingIn(false);
        }
      } catch (err) {
        console.error('[Login] Sync error:', err);
        setError('Something went wrong. Please try again.');
        setLoggingIn(false);
      }
    },
    onError: (err) => {
      console.error('[Login] Privy OAuth error:', err);
      setError('Login failed. Please try again.');
      setLoggingIn(false);
    },
  });

  // If already authenticated, redirect to /me
  useEffect(() => {
    if (ready && authenticated) {
      router.push('/me');
    }
  }, [ready, authenticated, router]);

  const handleLogin = () => {
    setLoggingIn(true);
    setError('');
    initOAuth({ provider: 'twitter' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Faith Logo"
            width={80}
            height={80}
            className="object-contain w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>
        <p className="text-gray-400 mb-8 sm:mb-12 text-sm sm:text-base">Log in with your X account</p>
        
        {error && (
          <p className="text-red-400 mb-6 text-sm">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={!ready || loggingIn}
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694L2.306 21.75H-1v-3.308l7.227-8.26L-1.5 2.25h6.514l5.106 6.694L21.75 2.25h.494z" />
          </svg>
          {loggingIn ? 'Signing in...' : 'Sign in with X'}
        </button>
      </div>
    </div>
  );
}
