/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'dd.dexscreener.com',
      },
      {
        protocol: 'https',
        hostname: 'img.dexscreener.com',
      },
      {
        protocol: 'https',
        hostname: 'pump.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'cf-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'd23exngyjlavgo.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'solana-gateway.moralis.io',
      },
    ],
  },
};

export default nextConfig;
