import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_SECRET = process.env.SESSION_SECRET || '';

if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  console.warn(
    'SESSION_SECRET not set or too short. Using a weak default for development only.'
  );
}

// Sign a value with HMAC
function signValue(value: string): string {
  const hmac = createHmac('sha256', SESSION_SECRET);
  hmac.update(value);
  return hmac.digest('hex');
}

// Verify a signed value
function verifySignedValue(value: string, signature: string): boolean {
  const expectedSignature = signValue(value);
  return expectedSignature === signature;
}

// Create a session cookie
export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const value = `${userId}:${Date.now()}`;
  const signature = signValue(value);
  const sessionValue = `${value}.${signature}`;

  cookieStore.set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Get the current session
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionValue) {
    return null;
  }

  const [value, signature] = sessionValue.split('.');
  if (!value || !signature) {
    return null;
  }

  if (!verifySignedValue(value, signature)) {
    return null;
  }

  const userId = value.split(':')[0];
  return userId;
}

// Clear the session cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
