import {
  exchangeCodeForToken,
  fetchXProfile,
} from '@/lib/oauth';
import { createSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getOAuthState } from '@/lib/oauth-state-store';

export async function GET(request: Request) {
  try {
    console.log('=== OAuth Callback ===');
    
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    console.log('Received state from URL:', state?.substring(0, 20) + '...');
    console.log('Received code:', code?.substring(0, 20) + '...');

    // Check for authorization errors
    if (error) {
      console.error('OAuth error:', error);
      return new Response(`Authorization error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      return new Response('Missing code or state parameter', { status: 400 });
    }

    // Get stored OAuth state from memory
    const oauthState = getOAuthState(state);

    if (!oauthState) {
      console.error('OAuth state not found in memory!');
      return new Response('OAuth state expired or not found', { status: 400 });
    }

    const codeVerifier = oauthState.codeVerifier;
    console.log('Retrieved code verifier from memory');

    // Exchange code for access token
    let tokenData;
    try {
      tokenData = await exchangeCodeForToken(code, codeVerifier);
      console.log('Token exchanged successfully');
    } catch (tokenError) {
      console.error('Token exchange failed:', tokenError);
      return new Response('Token exchange failed. Check your X credentials.', { status: 500 });
    }

    if (!tokenData.access_token) {
      console.error('No access token in response');
      return new Response('No access token received', { status: 500 });
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile from X
    let xProfile;
    try {
      xProfile = await fetchXProfile(accessToken);
      console.log('User profile fetched:', xProfile);
    } catch (profileError) {
      console.error('Profile fetch failed:', profileError);
      return new Response('Failed to fetch X profile. Check X API access.', { status: 500 });
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { xUserId: xProfile.id },
      update: {
        username: xProfile.username,
        name: xProfile.name,
        avatarUrl: xProfile.profile_image_url || null,
        bio: xProfile.description || null,
      },
      create: {
        xUserId: xProfile.id,
        username: xProfile.username,
        name: xProfile.name,
        avatarUrl: xProfile.profile_image_url || null,
        bio: xProfile.description || null,
      },
    });

    // Create session cookie
    await createSession(user.id);

    // Redirect to profile page
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/me' },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}
