import { clearSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await clearSession();
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response('Logout failed', { status: 500 });
  }
}
