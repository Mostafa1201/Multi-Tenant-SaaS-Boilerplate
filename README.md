<div align="center">

# 🏗️ Multi-Tenant SaaS Boilerplate

**NestJS · TypeORM · MySQL**

Isolated per-tenant databases, encrypted per-tenant configuration, and dedicated log files —
all with zero per-request overhead.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## ✨ How It Works

Each HTTP request carries a tenant identifier. On the **first request** for a given tenant, a datasource, logger, and settings context are created and **cached by durable providers**. Every subsequent request reuses them instantly — no reconnect cost, no DI overhead, no cold starts.

```
Request
  └─► Durable Provider resolves tenant context
        ├─► DataSource      → Tenant's isolated MySQL database
        ├─► SettingsService → Tenant's decrypted config overrides
        └─► Logger          → Tenant's dedicated log file
```

---

## ⚡ Key Design Decisions

| Pillar                    | What                                           | Why                                                                                    |
| ------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| 🔁 **Durable Providers**  | Default-scope, cached per tenant               | Singleton-level performance with full per-tenant isolation — no DI rebuild per request |
| 🗄️ **Isolated Databases** | Separate MySQL DB per tenant                   | Full data separation; tenant data never bleeds across boundaries                       |
| ⚙️ **Tenant Settings**    | Per-tenant config overrides, encrypted at rest | Each tenant can override global defaults without touching shared infrastructure        |
| 📋 **Tenant Logger**      | Dedicated log file per tenant                  | Logs are isolated, auditable, and never mixed across tenants                           |
| 🔐 **Encrypted Secrets**  | AES-256 encryption on all tenant settings      | Sensitive config stored safely in the master DB, decrypted only at runtime             |

---

## ⚙️ Tenant Settings

Each tenant gets its own configuration layer that sits **on top of global defaults**. Settings are managed via the `saas/environment` API and are:

- **Encrypted at rest** using AES-256 — decrypted only when the tenant's durable provider is initialized
- **Scoped overrides** — any global config value can be overridden per tenant (e.g. rate limits, feature flags, third-party API keys, SMTP config)
- **Loaded once** — settings are resolved on first access and cached in the durable provider for the lifetime of the process

```
Global Config (app defaults)
      │
      ▼
Tenant Settings (encrypted overrides in master DB)
      │
      ▼
Merged Runtime Config (what the tenant's services actually see)
```

### Managing settings

```bash
# Create or update a tenant setting
POST /saas/environment
{
  "code": "acme",
  "environment": [
    {
      "key": "SMTP_HOST",
      "value": "smtp.acme.com"        # stored AES-256 encrypted
    }
  ]
}

# Settings are decrypted and injected automatically on tenant init
# — no plaintext values ever touch the database
```

> 💡 **Why this matters:** Rather than managing `.env` files per deployment or relying on infrastructure-level secrets per tenant, settings live in your master database — version-controlled, API-manageable, and encrypted. Onboarding a new tenant is an API call, not a DevOps ticket.

---

## 📋 Tenant Logger

The logger is implemented as a **durable provider**, meaning one logger instance is created per tenant and reused across all requests — just like the datasource.

Each tenant gets its own **dedicated log file**, keeping logs completely isolated:

```
acme/
├── 2026-06-12.log
abcd
└── 2026-06-12.log  # platform-level logs
```

### Why a durable logger matters

| Concern           | Without durable logger                     | With durable logger                |
| ----------------- | ------------------------------------------ | ---------------------------------- |
| **Log isolation** | All tenants mixed in one stream            | Each tenant writes to its own file |
| **Auditability**  | Hard to trace issues per tenant            | Tail a single file per tenant      |
| **Security**      | Sensitive tenant data can leak across logs | Strict per-tenant boundaries       |
| **Performance**   | Logger re-instantiated per request         | Initialized once, reused forever   |

```typescript
// The logger is injected automatically — already scoped to the tenant
this.logger.log('Payment processed');
// → writes to logs/acme.log with full context, never to another tenant's file
```

---

## 🚀 Setup

**1. Install dependencies**

```bash
npm install
```

**2. Generate secrets**

Run this twice — once for your AES encryption key, once for your JWT secret — then add both to `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```env
ENCRYPTION_KEY=your_generated_key_here
JWT_SECRET=your_generated_secret_here
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=secret
DB_NAME=master
```

**3. Run master migrations**

```bash
npm run migration:run:master
```

**4. Start the server**

```bash
npm run start:dev    # development (watch mode)
npm run start:prod   # production
```

---

## 🏢 Provisioning a Tenant

Two API calls are all it takes to onboard a new tenant:

**Step 1 — Create the tenant**

```bash
POST /saas/pilot
{
  "tenantCode": "acme",
  "tenantName": "acme corp",
  "dbCredentials": {
    "host": "localhost",
    "port": "3306",
    "database": "corp_acme",
    "username": "user",
    "password": "pass"
  }
}
# ✓ Creates isolated MySQL database
# ✓ Runs tenant schema migrations
# ✓ Registers tenant in master DB
```

**Step 2 — Configure the tenant**

```bash
POST /saas/environment
{
  "code": "acme",
  "environment": [
    {
      "key": "SMTP_HOST",
      "value": "smtp.acme.com"
    },
    ...
  ]
}
# ✓ Encrypted and stored in tenant DB
# ✓ Loaded in tenant settings (environment) at run-time
```

From this point, every request for `acme` gets its own datasource, its own decrypted config, and its own log file — automatically when adding "x-tenant-id" in request header, for example → "x-tenant-id": "acme".

---

## 📝 Architecture & Performance Notes

> **Why not request-scoped providers?**
> Request-scoped providers rebuild the entire DI tree on every incoming request — expensive at scale. This project uses **default-scope durable providers** that initialize each tenant's context once and cache it. The result: multi-tenancy flexibility at near-monolith performance.

- ✅ Datasource cached per tenant after first init — no reconnect on repeat requests
- ✅ Settings decrypted once at tenant init — no crypto overhead per request
- ✅ Logger instantiated once per tenant — no file handle churn
- ✅ Encryption key and JWT secret loaded once at bootstrap from `.env`

---
