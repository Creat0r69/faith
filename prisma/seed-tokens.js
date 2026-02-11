const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found!');
    return;
  }
  console.log('Using user:', user.id, user.username);

  const mints = [
    '6cNScCPxRp4VKs24YrH91sUiJJh8ffvDLc5baAUgpump',
    '6g3rhd4KG3wUeVHJCPvtw4ihbvPfyUrWJQkNWJ3rpump',
    '3ZgJ7ny1fNPJhfRBVpGF1faqvyU66pymGKKLfLDEpump',
  ];

  for (const mint of mints) {
    try {
      const token = await prisma.token.upsert({
        where: { mint },
        update: {},
        create: {
          mint,
          name: mint.slice(0, 8),
          ticker: mint.slice(0, 4).toUpperCase(),
          isLive: true,
          creatorId: user.id,
        },
      });
      console.log('Created/existing token:', token.id, token.mint);
    } catch (err) {
      console.error('Error for', mint, err.message);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); });
