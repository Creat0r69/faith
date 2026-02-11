import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

// Small delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mints } = body as { mints: string[] };

    if (!mints || !Array.isArray(mints) || mints.length === 0) {
      return Response.json({ error: 'mints array required' }, { status: 400 });
    }

    console.log('[Bonding] Fetching bonding status for', mints.length, 'tokens');
    console.log('[Bonding] API key present:', !!MORALIS_API_KEY);

    const results: Record<string, number> = {};

    // Fetch one at a time sequentially to avoid rate limits
    for (const mint of mints) {
      try {
        const url = `https://solana-gateway.moralis.io/token/mainnet/${mint}/bonding-status`;
        console.log('[Bonding] Fetching:', url);

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'X-API-Key': MORALIS_API_KEY || '',
          },
        });

        const text = await res.text();
        console.log(`[Bonding] ${mint}: status=${res.status}, body=${text}`);

        if (res.ok) {
          const data = JSON.parse(text);
          if (data.bondingProgress !== undefined) {
            results[mint] = data.bondingProgress;
          }
        }
      } catch (err) {
        console.error(`[Bonding] Error for ${mint}:`, err);
      }

      // Small delay between requests to avoid rate limiting
      if (mints.indexOf(mint) < mints.length - 1) {
        await delay(200);
      }
    }

    console.log('[Bonding] Results:', results);
    return Response.json({ bonding: results });
  } catch (error) {
    console.error('Bonding status error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
