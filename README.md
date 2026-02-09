# Faith Site - X OAuth2 Authentication

## Production-Grade Next.js 14 with OAuth2 PKCE, Postgres, and Cookie Sessions

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `X_CLIENT_ID`: From X Developer Portal
   - `X_CLIENT_SECRET`: From X Developer Portal
   - `X_REDIRECT_URI`: Must match your OAuth app settings (http://localhost:3000/api/auth/x/callback for dev)
   - `SESSION_SECRET`: Random string, at least 32 characters

3. **Set up PostgreSQL Database**
   - Create a new PostgreSQL database for this project
   - Update `DATABASE_URL` in `.env.local`

4. **Create Database Schema**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Get X OAuth2 Credentials

1. Go to [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new App
3. Set up OAuth2 settings:
   - Enable OAuth 2.0
   - Set App permissions to **Read**
   - Add Redirect URI: `http://localhost:3000/api/auth/x/callback`
   - Request scopes: `tweet.read users.read offline.access`
4. Copy Client ID and Client Secret to `.env.local`

### Project Structure

```
/app
  page.tsx                 # Home (redirects to /login)
  /login/page.tsx         # Login page with "Sign in with X" button
  /me/page.tsx            # User profile page
  /api
    /auth
      /x
        /start/route.ts   # OAuth flow initiation
        /callback/route.ts # OAuth callback handler
      /logout/route.ts    # Session logout
    /me/route.ts          # Get current user data
/lib
  prisma.ts               # Prisma client singleton
  session.ts              # Cookie-based session management
  oauth.ts                # OAuth2 helpers (PKCE, token exchange)
/prisma
  schema.prisma           # Database schema
```

### Features

✅ OAuth2 with PKCE (Proof Key for Code Exchange)  
✅ CSRF protection via state parameter  
✅ HttpOnly secure cookies for sessions  
✅ PostgreSQL + Prisma ORM  
✅ User profile upsert on login  
✅ Session persistence across page refreshes  
✅ Logout functionality  
✅ TypeScript throughout  
✅ Clean, production-ready code  

### Security

- ✅ PKCE enabled (S256 challenge method)
- ✅ State parameter for CSRF protection
- ✅ HttpOnly cookies (can't be accessed via JavaScript)
- ✅ Secure flag on production (HTTPS only)
- ✅ SameSite=Lax on cookies
- ✅ Client secret never exposed
- ✅ Session HMAC signing

### API Routes

#### `GET /api/auth/x/start`
Initiates OAuth flow. Generates state and PKCE values, stores in cookies, redirects to X.

#### `GET /api/auth/x/callback`
Handles X OAuth callback. Validates state, exchanges code for token, fetches user profile, upserts user in DB, creates session.

#### `GET /api/me`
Returns current user data or 401 if not authenticated.

#### `POST /api/auth/logout`
Clears session cookie, returns `{ ok: true }`.

### Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  xUserId   String   @unique
  username  String   @unique
  name      String
  avatarUrl String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Sync database schema
npm run db:studio    # Open Prisma Studio (UI for DB)
npm run generate     # Generate Prisma client
npm run lint         # Run ESLint
```

### Troubleshooting

**"State verification failed"**
- State cookie may have expired (10-minute TTL)
- Ensure cookies are enabled in your browser

**"Token exchange failed"**
- Check that X_CLIENT_ID and X_CLIENT_SECRET are correct
- Verify X_REDIRECT_URI matches your OAuth app settings

**"Failed to fetch user profile"**
- Ensure your X app has users.read scope enabled
- Check X API rate limits

**"User not found" on /me**
- Session cookie may have expired (7-day TTL)
- Try logging in again

### License

MIT
