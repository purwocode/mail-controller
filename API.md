# API Documentation

Zero Sender API endpoints and usage guide.

## Base URL

Development: `http://localhost:3000`
Production: `https://your-domain.vercel.app`

## Authentication

All endpoints except `/api/health` require a valid Supabase session access token, sent as a Bearer header:

```bash
curl -H "Authorization: Bearer $SUPABASE_SESSION_TOKEN" \
  https://your-domain/api/endpoint
```

The server validates the token against Supabase Auth and scopes all database queries to that user via Row Level Security (see `getAuthenticatedUser()` in `src/lib/supabase.ts`). There is no cookie-based session for the API - the client (dashboard pages) reads the token from the Supabase JS client session and attaches it via `src/lib/api.ts`.

## Endpoints

### Health Check

Check if API is running.

```http
GET /api/health
```

**Response:**
```json
{
  "message": "Health check OK",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Campaigns - Send Email

Send emails for a campaign.

```http
POST /api/campaigns/send
Content-Type: application/json
Authorization: Bearer $SUPABASE_SESSION_TOKEN
```

**Request Body:**
```json
{
  "campaign_id": "uuid-here",
  "batch_size": 100
}
```

**Response:**
```json
{
  "message": "Campaign started",
  "status": "running",
  "campaign_id": "uuid-here"
}
```

**Status Codes:**
- `200`: Campaign started successfully
- `400`: Invalid request
- `401`: Unauthorized
- `500`: Server error

### Email Lists - Import

Import email addresses to a list.

```http
POST /api/lists/import
Content-Type: application/json
Authorization: Bearer $SUPABASE_SESSION_TOKEN
```

**Request Body:**
```json
{
  "list_id": "uuid-here",
  "emails": [
    {
      "email": "user@example.com",
      "name": "John Doe"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Emails imported successfully",
  "count": 100
}
```

**Status Codes:**
- `200`: Import successful
- `400`: Invalid email format
- `401`: Unauthorized
- `500`: Server error

### SMTP Configs

Manage per-user SMTP server credentials (stored encrypted in Supabase).

```http
GET    /api/smtp
POST   /api/smtp
PATCH  /api/smtp/:id
DELETE /api/smtp/:id
Authorization: Bearer $SUPABASE_SESSION_TOKEN
```

**POST/PATCH Request Body:**
```json
{
  "name": "Office 365 Account 1",
  "description": "Marketing team account",
  "host": "smtp.office365.com",
  "port": 587,
  "username": "your-email@example.com",
  "password": "your-password",
  "use_tls": true,
  "is_default": true
}
```

`password` is optional on `PATCH` - omit it to keep the existing (encrypted) password. Responses never include the `password` field.

**Status Codes:**
- `200`/`201`: Success
- `400`: Missing/invalid fields
- `401`: Unauthorized
- `404`: Config not found (or not owned by the caller)
- `500`: Server error

### Email Providers (Microsoft Graph & Gmail API)

Manage per-user OAuth/API sending credentials (stored encrypted in Supabase).

```http
GET    /api/email-providers
POST   /api/email-providers
PATCH  /api/email-providers/:id
DELETE /api/email-providers/:id
Authorization: Bearer $SUPABASE_SESSION_TOKEN
```

**POST Request Body (Microsoft Graph):**
```json
{
  "provider": "graph",
  "name": "Marketing Graph App",
  "graph_tenant_id": "common",
  "graph_client_id": "your-client-id",
  "graph_client_secret": "your-client-secret",
  "is_default": true
}
```

**POST Request Body (Gmail API):**
```json
{
  "provider": "gmail",
  "name": "Support Gmail",
  "gmail_sender_email": "you@example.com",
  "gmail_service_account_json": "{ \"type\": \"service_account\", ... }"
}
```

`graph_client_secret` / `gmail_service_account_json` are optional on `PATCH` - omit to keep the existing (encrypted) value. Responses never include these fields.

**Status Codes:**
- `200`/`201`: Success
- `400`: Missing/invalid fields (including invalid Gmail service account JSON)
- `401`: Unauthorized
- `404`: Config not found (or not owned by the caller)
- `500`: Server error

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

Common error messages:
- `"Unauthorized"` - No valid session token
- `"Resource not found"` - Campaign/list doesn't exist
- `"Invalid input"` - Malformed request body
- `"Server error"` - Internal server error

## Rate Limiting

Not currently implemented - all endpoints are only protected by Supabase auth + RLS. Add rate limiting (e.g. at the edge/proxy or via a service like Upstash) before exposing this publicly.

## Example Usage

### JavaScript/TypeScript

```typescript
// Send campaign
const response = await fetch('/api/campaigns/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    campaign_id: 'campaign-uuid',
  }),
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

url = 'http://localhost:3000/api/campaigns/send'
payload = {
    'campaign_id': 'campaign-uuid'
}

response = requests.post(url, json=payload)
print(response.json())
```

### cURL

```bash
curl -X POST http://localhost:3000/api/campaigns/send \
  -H "Content-Type: application/json" \
  -d '{"campaign_id":"uuid-here"}'
```

## Database Queries

Direct database access (server-side only):

```typescript
import { createServiceRoleClient } from '@/lib/supabase';

const supabase = createServiceRoleClient();

// Get campaigns
const { data, error } = await supabase
  .from('campaigns')
  .select('*')
  .eq('user_id', user_id);
```

## Webhooks (Future)

Subscribe to campaign events:

```javascript
// Coming soon
// POST /api/webhooks/subscribe
// Events: campaign.sent, campaign.completed, email.opened
```

## Rate Limit Handling

If you hit rate limit (429):

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

retryWithBackoff(() => sendCampaign(campaignId));
```

## CORS

Not currently configured - these are same-origin Next.js Route Handlers with no explicit CORS headers, so cross-origin browser requests are blocked by default.

## Request/Response Format

All requests and responses use JSON format.

Request headers:
```
Content-Type: application/json
Authorization: Bearer $TOKEN (if required)
```

Response headers:
```
Content-Type: application/json
X-Powered-By: Vercel
```

## Pagination

Not currently implemented - list endpoints (`GET /api/smtp`, `GET /api/email-providers`) return all rows for the authenticated user, ordered by `created_at desc`.

## API Versioning

Not currently implemented - there is a single unversioned API surface under `/api/*`.

## Support

For API issues:
1. Check error message for details
2. Review this documentation
3. Check Supabase logs in dashboard
4. Open an issue on GitHub

## Changelog

### v1.0 (Current)
- Health check endpoint
- SMTP config CRUD (`/api/smtp`, `/api/smtp/:id`)
- Email provider CRUD (`/api/email-providers`, `/api/email-providers/:id`)
- Campaign send endpoint (stub, auth-guarded)
- List import endpoint (stub, auth-guarded)
- Authentication via Supabase Bearer token + Row Level Security
