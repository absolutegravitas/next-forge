# Better Auth + Cloudflare Integration

This document describes the complete integration of `better-auth-cloudflare` in your monorepo, providing comprehensive authentication with Cloudflare D1, KV storage, R2 file storage, and geolocation tracking.

## 🌟 Features Implemented

### 🗄️ D1 Database Integration
- **Primary database**: Cloudflare D1 via Drizzle ORM
- **Enhanced schema**: User tables with geolocation fields
- **Performance**: Optimized indexes for location-based queries

### 🔌 KV Storage Integration  
- **Session caching**: Optional KV storage for high-performance session retrieval
- **Configurable**: Enable/disable based on your needs
- **TTL support**: Automatic expiration handling

### 📁 R2 File Storage
- **User file uploads**: Direct integration with Cloudflare R2
- **File tracking**: Database records for all uploaded files
- **Security**: User-scoped file access with proper permissions
- **Type validation**: Configurable file type restrictions

### 📍 Automatic Geolocation Tracking
- **Session enrichment**: Location data stored with each session
- **IP detection**: Automatic Cloudflare IP header parsing
- **Timezone tracking**: User timezone detection and storage

### 🌐 Cloudflare IP Detection
- **Headers**: Supports `cf-connecting-ip`, `cf-ipcountry`, etc.
- **Fallback**: Falls back to `x-forwarded-for` if needed
- **Rate limiting**: IP-based rate limiting integration

### 🔍 Rich Client-Side Context
- **Hooks**: React hooks for accessing geolocation data
- **Real-time**: Live updates of user context
- **TypeScript**: Full type safety for all data

## 📦 Package Structure

```
packages/auth/
├── index.ts                     # Main exports
├── server.ts                    # Better Auth server config
├── client.ts                    # React client with hooks
├── middleware.ts                # Next.js middleware
├── handlers.ts                  # API route handlers
├── keys.ts                      # Environment configuration
├── components/
│   └── auth-provider.tsx        # Enhanced auth provider
└── utils/
    ├── file-upload.ts           # R2 file operations
    ├── geolocation.ts           # Location utilities
    └── session.ts               # Session management
```

## 🚀 Getting Started

### 1. Environment Variables

Add the following to your `.env.local` files:

```bash
# Required
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000" # or your domain

# Cloudflare (Optional - enables enhanced features)
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_D1_DATABASE_ID="your-d1-database-id"
CLOUDFLARE_API_TOKEN="your-api-token"

# KV Storage (Optional - for session caching)
CLOUDFLARE_KV_NAMESPACE_ID="your-kv-namespace-id"

# R2 File Storage (Optional - for file uploads)
CLOUDFLARE_R2_BUCKET_NAME="your-r2-bucket"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-key"

# Feature Flags
ENABLE_GEOLOCATION_TRACKING="true"
```

### 2. Database Migration

Run the migration to set up the database schema:

```bash
# Apply the migration
pnpm db:migrate

# Or push the schema directly
pnpm db:push
```

### 3. API Routes

The auth handlers are automatically set up in:
- `apps/app/app/api/auth/[...all]/route.ts`
- `apps/api/app/auth/[...all]/route.ts`

## 🛠️ Usage Examples

### Client-Side Authentication

```tsx
import { 
  signIn, 
  signOut, 
  useSession, 
  useCloudflareContext,
  useUserGeolocation 
} from '@repo/auth';

function MyComponent() {
  const session = useSession();
  const cloudflareContext = useCloudflareContext();
  const geolocation = useUserGeolocation();

  return (
    <div>
      {session?.user ? (
        <div>
          <p>Welcome, {session.user.name}!</p>
          <p>Location: {cloudflareContext.city}, {cloudflareContext.country}</p>
          <p>IP: {cloudflareContext.ip}</p>
          <p>Timezone: {cloudflareContext.timezone}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn.email({
          email: "user@example.com",
          password: "password"
        })}>
          Sign In
        </button>
      )}
    </div>
  );
}
```

### Server-Side Session Access

```tsx
import { auth } from '@repo/auth/server';
import { headers } from 'next/headers';

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Hello, {session.user.name}!</h1>
      <p>Country: {session.session.country}</p>
      <p>Region: {session.session.region}</p>
      <p>City: {session.session.city}</p>
    </div>
  );
}
```

### File Upload to R2

```tsx
import { uploadFileToR2 } from '@repo/auth/utils/file-upload';

async function handleFileUpload(file: File, userId: string) {
  try {
    const result = await uploadFileToR2(file, userId, {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png'],
    });

    console.log('File uploaded:', result.url);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

### Session Management

```tsx
import { 
  getAllUserSessions, 
  revokeSession,
  revokeAllSessions 
} from '@repo/auth/utils/session';

async function SessionManager({ userId }: { userId: string }) {
  const sessions = await getAllUserSessions(userId);

  return (
    <div>
      <h2>Active Sessions</h2>
      {sessions.map(session => (
        <div key={session.id}>
          <p>{session.country}, {session.city}</p>
          <p>IP: {session.ipAddress}</p>
          <p>Created: {session.createdAt.toLocaleString()}</p>
          <button onClick={() => revokeSession(session.id)}>
            Revoke
          </button>
        </div>
      ))}
      <button onClick={() => revokeAllSessions(userId)}>
        Revoke All Sessions
      </button>
    </div>
  );
}
```

### Geolocation Utilities

```tsx
import { 
  formatLocationString,
  extractGeolocationFromHeaders,
  isValidTimezone 
} from '@repo/auth/utils/geolocation';

// Format location for display
const locationString = formatLocationString({
  city: "San Francisco",
  region: "California", 
  country: "US"
}); // "San Francisco, California, US"

// Extract from request headers
const geolocation = extractGeolocationFromHeaders(request.headers);

// Validate timezone
if (isValidTimezone(geolocation.timezone)) {
  // Use the timezone
}
```

## 🔧 Configuration Options

### Server Configuration

```tsx
// packages/auth/server.ts
export const auth = betterAuth(
  withCloudflare(
    {
      cf: {
        ipHeader: "cf-connecting-ip",
        geolocation: {
          enabled: true,
          trackOnSignIn: true,
          trackOnSignUp: true,
        },
      },
      d1: { db: getDatabase() },
      kv: { /* KV config */ },
      r2: { /* R2 config */ },
    },
    {
      secret: env.BETTER_AUTH_SECRET,
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
      },
      advanced: {
        rateLimit: {
          enabled: true,
          window: 60,
          max: 100,
        },
      },
    }
  )
);
```

### Client Configuration

```tsx
// packages/auth/client.ts
export const { signIn, signOut, useSession } = createAuthClient({
  baseUrl: "/api/auth",
  plugins: [
    cloudflareClient({
      enableContextTracking: true,
      enrichContext: {
        timezone: true,
        location: true,
        device: true,
      },
      enableFileUpload: true,
    }),
  ],
});
```

## 🔒 Security Features

### Rate Limiting
- **IP-based**: Automatic rate limiting by IP address
- **Configurable**: Customizable windows and limits
- **Cloudflare aware**: Uses Cloudflare IP headers

### CSRF Protection
- **Origin validation**: Trusted origins configuration
- **Header checking**: Validates request origins
- **Automatic**: Built into better-auth

### Session Security
- **Encryption**: Secure session tokens
- **HttpOnly cookies**: XSS protection
- **SameSite**: CSRF protection
- **Expiration**: Automatic session cleanup

## 📊 Monitoring & Analytics

### Geolocation Analytics
Access rich location data for:
- **User demographics**: Country/region distribution
- **Security monitoring**: Unusual login locations
- **Performance optimization**: Regional CDN routing

### Session Analytics
Track session patterns:
- **Device types**: Mobile vs desktop usage
- **Geographic patterns**: User movement
- **Security events**: Suspicious activities

## 🚀 Deployment

### Cloudflare Workers/Pages
Your app is ready for deployment to Cloudflare with:
- **D1 database**: Automatic connection
- **KV storage**: Session caching
- **R2 storage**: File uploads
- **Geolocation**: Built-in headers

### Environment Setup
1. **Create D1 database**: `wrangler d1 create your-database`
2. **Create KV namespace**: `wrangler kv:namespace create "AUTH_KV"`
3. **Create R2 bucket**: `wrangler r2 bucket create your-bucket`
4. **Configure wrangler.toml**: Add bindings

## 🐛 Troubleshooting

### Common Issues

1. **Geolocation not working**: Ensure Cloudflare proxy is enabled
2. **File uploads failing**: Check R2 bucket permissions
3. **Sessions not caching**: Verify KV namespace configuration
4. **CORS errors**: Add your domain to trusted origins

### Debug Mode
Enable debug logging:
```bash
DEBUG=better-auth* npm run dev
```

## 📚 TypeScript Support

Full TypeScript support with:
- **Session types**: Enhanced with geolocation data
- **Context types**: Cloudflare-specific data
- **Utility types**: File upload responses
- **Hook types**: All React hooks typed

## 🤝 Contributing

When extending this integration:
1. **Follow patterns**: Use existing utility structures
2. **Add types**: Maintain TypeScript coverage
3. **Update docs**: Document new features
4. **Test thoroughly**: Verify all environments

## 📖 Further Reading

- [Better Auth Documentation](https://better-auth.com)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [OpenNext.js Cloudflare](https://opennext.js.org/cloudflare)

---

This integration provides a complete, production-ready authentication system with all the Cloudflare features you requested. The modular structure makes it easy to enable/disable features as needed.