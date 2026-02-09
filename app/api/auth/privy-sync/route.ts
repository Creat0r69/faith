import { createSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { privyUserId, twitterUsername, twitterName, twitterProfileImage, twitterSubject } = body;

    console.log('[Privy Sync] Syncing user:', { privyUserId, twitterUsername, twitterName });

    if (!privyUserId || !twitterUsername) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Use the Twitter subject (Twitter user ID) or Privy user ID as the xUserId
    const xUserId = twitterSubject || privyUserId;

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { xUserId },
      update: {
        username: twitterUsername,
        name: twitterName || twitterUsername,
        avatarUrl: twitterProfileImage || null,
      },
      create: {
        xUserId,
        username: twitterUsername,
        name: twitterName || twitterUsername,
        avatarUrl: twitterProfileImage || null,
        bio: null,
      },
    });

    console.log('[Privy Sync] User upserted:', user.id);

    // Create session cookie
    await createSession(user.id);

    console.log('[Privy Sync] Session created for user:', user.id);

    return Response.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('[Privy Sync] Error:', error);
    return new Response('Failed to sync user', { status: 500 });
  }
}
