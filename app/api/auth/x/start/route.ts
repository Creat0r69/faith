import { generateState, generatePKCE, getXAuthUrl } from '@/lib/oauth';
import { storeOAuthState } from '@/lib/oauth-state-store';

export async function GET() {
  try {
    console.log('=== OAuth Start ===');
    
    // Generate state for CSRF protection
    const state = generateState();
    console.log('Generated state:', state.substring(0, 20) + '...');

    // Generate PKCE values
    const { codeVerifier, codeChallenge } = generatePKCE();
    console.log('Generated PKCE verifier:', codeVerifier.substring(0, 20) + '...');

    // Store state and code verifier in memory
    storeOAuthState(state, codeVerifier);

    // Generate X OAuth URL
    const authUrl = getXAuthUrl(state, codeChallenge);
    console.log('Redirecting to X...');
    
    return Response.redirect(authUrl, 307);
  } catch (error) {
    console.error('OAuth start error:', error);
    return new Response('OAuth initialization failed', { status: 500 });
  }
}
