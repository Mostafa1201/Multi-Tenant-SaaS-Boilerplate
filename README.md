# Multi-Tenant SaaS Boilerplate

> NestJS · TypeORM · MySQL — isolated per-tenant databases with zero per-request overhead.

## How it works

Each HTTP request carries a tenant identifier. On the first request for a given tenant, a datasource is created and **cached by the durable provider** — subsequent requests reuse it instantly, with no reconnect cost and no request-scoped DI overhead.

```
Request → Durable Provider (cached datasource) → Tenant MySQL DB
```

## Key design decisions

**Durable default-scope providers** — Unlike request-scoped providers, these are initialized once per tenant and reused across all requests. This gives you per-tenant isolation without sacrificing singleton-level performance.

**Encrypted tenant settings** — Per-tenant environment variables are stored encrypted in the master database using AES-256. Each tenant's secrets are decrypted at runtime, never stored in plaintext.

**Auto-provisioning via API** — A single call to `POST saas/pilot` creates the tenant database and runs its migrations. No manual schema setup needed.

## Setup

**1. Install**

```bash
npm install
```

**2. Generate secrets**

Run this twice — once for your encryption key, once for your JWT secret — and add both to `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Run master migrations**

```bash
npm run migration:run:master
```

**4. Start**

```bash
npm run start:dev   # development (watch mode)
npm run start:prod  # production
```

## Provisioning a tenant

Two API calls are all it takes:

1. **`POST saas/pilot`** — Creates the tenant's isolated database and runs its schema migrations.
2. **`POST saas/environment`** — Stores encrypted per-tenant environment variables (API keys, feature flags, connection secrets).

## Performance notes

- Providers run at **default scope**, avoiding DI tree reconstruction on every request.
- The durable provider **caches each tenant's datasource** after first init — no cold start on repeat calls.
- Encryption key and JWT secret are loaded once at bootstrap from `.env`.
