# API Documentation

Zero Sender API endpoints and usage guide.

## Base URL

Development: `http://localhost:3000`
Production: `https://your-domain.vercel.app`

## Authentication

Most endpoints require authentication. Include session token in headers:

```bash
curl -H "Cookie: auth_token=your_token" \
  https://your-domain/api/endpoint
```

The app uses Supabase Auth which handles this automatically via cookies.

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

API rate limits (per user):
- Health check: Unlimited
- Campaign send: 10 requests per hour
- List import: 5 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1234567890
```

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

CORS is enabled for:
- Origin: `http://localhost:3000` (dev)
- Origin: `https://your-domain.vercel.app` (prod)

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

List endpoints support pagination:

```
GET /api/resource?page=1&limit=10&sort=-created_at
```

Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field with direction (+/-)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## API Versioning

Current API version: `v1`

Version in URL (future):
```
GET /api/v1/campaigns
```

## Support

For API issues:
1. Check error message for details
2. Review this documentation
3. Check Supabase logs in dashboard
4. Open an issue on GitHub

## Changelog

### v1.0 (Current)
- Health check endpoint
- Campaign send endpoint
- List import endpoint
- Authentication via Supabase
