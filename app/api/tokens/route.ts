import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest'; // newest, oldest, name
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const tokens = await prisma.token.findMany({
      take: limit,
      skip: offset,
      orderBy,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const total = await prisma.token.count();

    return Response.json({ tokens, total });
  } catch (error) {
    console.error('Get tokens error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
