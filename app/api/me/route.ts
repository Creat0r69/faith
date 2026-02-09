import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await getSession();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
