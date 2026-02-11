import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the first user to use as creator
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found in the database. Log in first to create a user.');
    process.exit(1);
  }
  console.log(`Using creator: ${user.username} (${user.id})`);

  const tokens = [
    {
      mint: 'A2gA786ED2SHJZYYXdUgRPDrqKj8kpzmL6bfcv9dpump',
      name: 'Test Token A',
      ticker: 'TSTA',
      description: 'Test token for PumpPortal integration',
      isLive: true,
      creatorId: user.id,
    },
    {
      mint: '9fNS2hzc1Qzdtd3ctWDD4u7yso9HrRNNfHWJH7Vvpump',
      name: 'Test Token B',
      ticker: 'TSTB',
      description: 'Second test token for PumpPortal integration',
      isLive: true,
      creatorId: user.id,
    },
    {
      mint: 'HWtu9dtGjeSBzMZFWiEaVFemEyrv2Ncy5zy5DiZipump',
      name: 'Test Token C',
      ticker: 'TSTC',
      description: 'Third test token for PumpPortal integration',
      isLive: true,
      creatorId: user.id,
    },
  ];

  for (const token of tokens) {
    const result = await prisma.token.upsert({
      where: { mint: token.mint },
      update: token,
      create: token,
    });
    console.log(`Upserted token: ${result.name} (${result.mint.slice(0, 8)}...)`);
  }

  console.log('Done! 3 test tokens seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
