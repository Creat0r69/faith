import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

interface MoralisTokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  logo: string | null;
  decimals: string;
  description: string | null;
  metaplex?: {
    metadataUri?: string;
  };
}

// Fetch the IPFS/Arweave metadata URI to get the description and image
async function fetchMetadataUri(uri: string): Promise<{ description?: string; image?: string }> {
  try {
    const res = await fetch(uri, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return {};
    const data = await res.json();
    return {
      description: data.description || undefined,
      image: data.image || undefined,
    };
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mints } = body as { mints: string[] };

    if (!mints || !Array.isArray(mints) || mints.length === 0) {
      return Response.json({ error: 'mints array required' }, { status: 400 });
    }

    const results: Record<string, { name: string; ticker: string; imageUrl: string | null; description: string | null }> = {};

    // Moralis token metadata endpoint is per-token, so we fetch in parallel
    const fetchPromises = mints.map(async (mint) => {
      try {
        const res = await fetch(
          `https://solana-gateway.moralis.io/token/mainnet/${mint}/metadata`,
          {
            headers: {
              accept: 'application/json',
              'X-API-Key': MORALIS_API_KEY,
            },
          }
        );

        if (!res.ok) {
          console.error(`Moralis fetch failed for ${mint}: ${res.status}`);
          return;
        }

        const data: MoralisTokenMetadata = await res.json();

        let description: string | null = null;
        let imageUrl: string | null = data.logo || null;

        // If there's a metadata URI, fetch it for description and a potentially better image
        if (data.metaplex?.metadataUri) {
          const extended = await fetchMetadataUri(data.metaplex.metadataUri);
          if (extended.description) description = extended.description;
          // Prefer the IPFS/Arweave image if the Moralis logo is missing
          if (!imageUrl && extended.image) imageUrl = extended.image;
        }

        results[mint] = {
          name: data.name?.trim() || mint.slice(0, 8),
          ticker: data.symbol?.trim() || '',
          imageUrl,
          description,
        };
      } catch (err) {
        console.error(`Moralis fetch error for ${mint}:`, err);
      }
    });

    await Promise.all(fetchPromises);

    // Update DB for any tokens we got metadata for
    const updatePromises = Object.entries(results).map(([mint, meta]) =>
      prisma.token.updateMany({
        where: { mint },
        data: {
          name: meta.name,
          ticker: meta.ticker,
          ...(meta.imageUrl ? { imageUrl: meta.imageUrl } : {}),
          ...(meta.description ? { description: meta.description } : {}),
        },
      })
    );

    await Promise.all(updatePromises);

    return Response.json({ updated: Object.keys(results).length, metadata: results });
  } catch (error) {
    console.error('Token metadata error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
