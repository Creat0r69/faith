import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

// Generate random state for CSRF protection
export function generateState(): string {
  return randomBytes(32).toString('hex');
}

// Generate PKCE code verifier and challenge
export function generatePKCE() {
  const codeVerifier = randomBytes(32).toString('hex');
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return { codeVerifier, codeChallenge };
}

// Generate X OAuth2 authorization URL
export function getXAuthUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: process.env.X_REDIRECT_URI!,
    scope: 'tweet.read users.read offline.access',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<{ access_token: string; refresh_token?: string }> {
  console.log('Exchanging code for token...');
  console.log('Client ID:', process.env.X_CLIENT_ID);
  console.log('Redirect URI:', process.env.X_REDIRECT_URI);
  
  // Create Basic Auth header
  const credentials = `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    redirect_uri: process.env.X_REDIRECT_URI!,
    code,
    code_verifier: codeVerifier,
  }).toString();

  console.log('Request body keys:', body.split('&').map(p => p.split('=')[0]).join(', '));
  
  const response = await fetch('https://api.x.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedCredentials}`,
    },
    body,
  });

  const responseText = await response.text();
  
  console.error('Token exchange response:');
  console.error('Status:', response.status);
  console.error('OK:', response.ok);
  console.error('Content-Type:', response.headers.get('content-type'));
  console.error('Response length:', responseText.length);
  
  // Try to parse as JSON even if status is 200
  try {
    const data = JSON.parse(responseText);
    console.log('Successfully parsed JSON response');
    console.log('Response keys:', Object.keys(data).join(', '));
    
    if (data.access_token) {
      console.log('Got access token!');
      return data;
    } else {
      console.error('No access_token in response:', data);
      throw new Error(data.error_description || 'No access_token received');
    }
  } catch (parseError) {
    console.error('Failed to parse response as JSON');
    console.error('First 200 chars:', responseText.substring(0, 200));
    throw new Error(`Token exchange failed: received ${response.status}`);
  }
}

// Fetch user profile from X API
export async function fetchXProfile(
  accessToken: string
): Promise<{
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
  description?: string;
}> {
  const url = new URL('https://api.twitter.com/2/users/me');
  url.searchParams.append(
    'user.fields',
    'id,name,username,description,profile_image_url,verified'
  );

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error('Profile fetch failed:', response.status, response.statusText);
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}
