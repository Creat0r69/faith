import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;

// Basic auth: appId as username, appSecret as password
const authHeader = 'Basic ' + Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
  }

  try {
    // Step 1: Find the wallet by listing all Solana wallets and matching by address
    const walletsRes = await fetch(
      `https://api.privy.io/v1/wallets?chain_type=solana`,
      {
        headers: {
          'Authorization': authHeader,
          'privy-app-id': PRIVY_APP_ID,
        },
      }
    );

    if (!walletsRes.ok) {
      const errorText = await walletsRes.text();
      console.error('[Balance API] Failed to list wallets:', walletsRes.status, errorText);
      return NextResponse.json({ error: 'Failed to list wallets' }, { status: 500 });
    }

    const walletsData = await walletsRes.json();
    const wallet = walletsData.data?.find(
      (w: any) => w.address.toLowerCase() === address.toLowerCase()
    );

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found', balance: '0' }, { status: 404 });
    }

    // Step 2: Get balance using the wallet_id
    const balanceRes = await fetch(
      `https://api.privy.io/v1/wallets/${wallet.id}/balance?chain=solana&asset=sol`,
      {
        headers: {
          'Authorization': authHeader,
          'privy-app-id': PRIVY_APP_ID,
        },
      }
    );

    if (!balanceRes.ok) {
      const errorText = await balanceRes.text();
      console.error('[Balance API] Failed to get balance:', balanceRes.status, errorText);
      return NextResponse.json({ error: 'Failed to get balance', balance: '0' }, { status: 500 });
    }

    const balanceData = await balanceRes.json();

    // Find SOL balance from the response
    const solBalance = balanceData.balances?.find((b: any) => b.asset === 'sol');

    return NextResponse.json({
      address: wallet.address,
      walletId: wallet.id,
      balance: solBalance?.display_values?.sol || '0',
      balanceUsd: solBalance?.display_values?.usd || null,
      rawValue: solBalance?.raw_value || '0',
    });
  } catch (error) {
    console.error('[Balance API] Error:', error);
    return NextResponse.json({ error: 'Internal server error', balance: '0' }, { status: 500 });
  }
}
