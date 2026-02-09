import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Use a temp directory that persists across dev server reloads
const stateDir = path.join(os.tmpdir(), 'faith_site_oauth_states');

// Ensure directory exists
if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir, { recursive: true });
}

interface OAuthState {
  state: string;
  codeVerifier: string;
  createdAt: number;
}

// Clean up expired entries periodically
setInterval(() => {
  try {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000; // 15 minutes
    
    const files = fs.readdirSync(stateDir);
    for (const file of files) {
      const filePath = path.join(stateDir, file);
      const stat = fs.statSync(filePath);
      
      if (now - stat.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log('Cleaned up expired OAuth state file:', file.substring(0, 10) + '...');
      }
    }
  } catch (error) {
    console.error('Error cleaning OAuth state files:', error);
  }
}, 5 * 60 * 1000);

export function storeOAuthState(state: string, codeVerifier: string): void {
  try {
    const oauthState: OAuthState = {
      state,
      codeVerifier,
      createdAt: Date.now(),
    };
    
    const filePath = path.join(stateDir, state);
    fs.writeFileSync(filePath, JSON.stringify(oauthState), 'utf-8');
    console.log('Stored OAuth state to file:', state.substring(0, 20) + '...');
  } catch (error) {
    console.error('Error storing OAuth state:', error);
  }
}

export function getOAuthState(state: string): OAuthState | undefined {
  try {
    const filePath = path.join(stateDir, state);
    
    if (!fs.existsSync(filePath)) {
      console.log('OAuth state file not found:', state.substring(0, 20) + '...');
      return undefined;
    }
    
    const data = fs.readFileSync(filePath, 'utf-8');
    const oauthState: OAuthState = JSON.parse(data);
    
    // Delete after retrieval (one-time use)
    fs.unlinkSync(filePath);
    console.log('Retrieved and deleted OAuth state file:', state.substring(0, 20) + '...');
    
    return oauthState;
  } catch (error) {
    console.error('Error retrieving OAuth state:', error);
    return undefined;
  }
}
