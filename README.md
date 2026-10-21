# 2nr Web – Cloudflare Pages + API Proxy

## Live

- Site: https://2nr.pages.dev
- API proxy: https://2nr.pages.dev/api/* → https://api.2nr.xyz/*

## Architecture

```
Browser (2nr.pages.dev)
    │
    │  POST /api/auth/login
    ▼
Cloudflare Pages Function  (functions/api/[[path]].ts)
    │
    │  POST https://api.2nr.xyz/auth/login
    ▼
api.2nr.xyz
```

The proxy is **automatically bound** to your Pages project when you deploy.
No separate Worker needs to be created in the dashboard.

## Routes

| Frontend call | Proxied to |
|---------------|------------|
| `/api/auth/register` | `api.2nr.xyz/auth/register` |
| `/api/auth/login` | `api.2nr.xyz/auth/login` |
| `/api/auth/confirm` | `api.2nr.xyz/auth/confirm` |
| `/api/auth/password` | `api.2nr.xyz/auth/password` |
| `/api/auth/logout` | `api.2nr.xyz/auth/logout` |
| `/api/user/getUserDetails` | `api.2nr.xyz/user/getUserDetails` |
| `/api/user/deactivate` | `api.2nr.xyz/user/deactivate` |
| `/api/numbers/getUserNumbers` | `api.2nr.xyz/numbers/getUserNumbers` |
| `/api/numbers/reserveNumber` | `api.2nr.xyz/numbers/reserveNumber` |
| `/api/numbers/removeNumber` | `api.2nr.xyz/numbers/removeNumber` |
| `/api/sms/get` | `api.2nr.xyz/sms/get` |
| `/api/sms/getUnreadMessageCount` | `api.2nr.xyz/sms/getUnreadMessageCount` |
| `/api/sms/markAsRead` | `api.2nr.xyz/sms/markAsRead` |
| `/api/shop/getShopItems` | `api.2nr.xyz/shop/getShopItems` |

## Deploy

Cloudflare Pages (Git connected):

- Build command: `npm run build`
- Output directory: `dist`
- Functions from `/functions` deploy automatically

## Important limitation

`api.2nr.xyz` uses Cloudflare WAF / Bot Fight Mode.
Requests from **Cloudflare datacenter IPs** (Workers / Pages Functions) are often **blocked**.

You will see:
```json
{ "code": "CF_WAF_BLOCKED", "error": "..." }
```

The official Android app works because it uses a normal mobile IP + Play Integrity.

## Local dev

```bash
npm install
npm run dev
```

Vite proxies `/api` → `https://api.2nr.xyz` (may also be blocked from your network).
