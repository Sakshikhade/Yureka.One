# Yureka One — Java Backend Specification

Full backend to replace the current Node.js/Express server and all direct Supabase SDK calls
from the React frontend. This is a greenfield Spring Boot application in its own repository.
No feature should be missing — every behaviour documented here is currently live in production.

---

## 1. Technology Stack

| Layer | Choice |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.x |
| Build | Gradle (Kotlin DSL) |
| Database | PostgreSQL (Supabase managed) via Spring Data JPA + Hibernate |
| Auth | Spring Security — verify Supabase-issued JWTs (HS256, secret from `SUPABASE_JWT_SECRET`) |
| Email | Spring Mail (JavaMailSender) via Gmail SMTP |
| Gmail API | Google API Client Library for Java (`google-api-services-gmail`) |
| Google People API | `google-api-services-people` |
| Scheduling | Spring `@Scheduled` |
| API style | REST, JSON, versioned under `/api/v1/` |
| CORS | Allow `https://yureka.one`, `https://yureka.one`, `http://localhost:3000` |

---

## 2. Environment Variables

```
# Database (Supabase PostgreSQL direct connection)
DB_URL=jdbc:postgresql://<supabase-host>:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=<db-password>

# Supabase JWT secret (for verifying tokens issued by Supabase Auth)
SUPABASE_JWT_SECRET=<jwt-secret-from-supabase-dashboard>

# Gmail SMTP (for onboarding emails)
GMAIL_USER=<gmail-address>
GMAIL_APP_PASSWORD=<app-password>

# Google OAuth (for Gmail API / email scanner)
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_TOKENS_PATH=./tokens   # directory where user OAuth tokens are persisted

# Gemini (not needed server-side — frontend-only feature)

# Server
PORT=8080
```

---

## 3. Database Schema

The database already exists in Supabase. JPA entities must match the existing column names exactly.
All tables are in the `public` schema.

### `cards`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            TEXT NOT NULL
bank            TEXT
issuer          TEXT
type            TEXT
image           TEXT
rating          NUMERIC
benefits        TEXT[]           -- Postgres array
annual_fee      TEXT
joining_fee     TEXT
best_for        TEXT
color           TEXT
rewards_rate    TEXT
category        TEXT
projected_savings TEXT
intro_offer     TEXT
tags            TEXT[]
elite_rating    NUMERIC
benefit_items   JSONB            -- [{ heading, subheading }]
verdict         TEXT
slug            TEXT UNIQUE
categories      TEXT[]
apply_link      TEXT
status          TEXT DEFAULT 'published'   -- 'published' | 'draft'
description     TEXT
updated_on      TEXT
author          TEXT
reward_type     TEXT
welcome_benefits TEXT
product_details TEXT[]
pros            TEXT[]
cons            TEXT[]
detailed_features JSONB          -- [{ title, content }]
cashback_details  TEXT[]
redemption_table  JSONB          -- [{ category, value }]
exclusions        TEXT[]
eligibility_criteria JSONB       -- [{ criteria, salaried, self_employed }]
comparison_cards  TEXT[]
latest_news       TEXT[]
final_review_image TEXT
final_verdict_text TEXT
grid_benefits   JSONB            -- [{ title, value }]
grid_fees       JSONB            -- [{ title, value }]
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

### `blogs`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
title         TEXT NOT NULL
slug          TEXT UNIQUE
excerpt       TEXT
content       TEXT
author        TEXT
category      TEXT
image         TEXT
external_link TEXT
date          TEXT
featured      BOOLEAN DEFAULT false
read_time     TEXT
status        TEXT DEFAULT 'published'   -- 'published' | 'draft'
scheduled_at  TIMESTAMPTZ               -- NULL = publish immediately
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
```

### `reviews`
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
author       TEXT NOT NULL
role         TEXT
company      TEXT
company_logo TEXT
avatar       TEXT
image        TEXT
quote        TEXT
rating       NUMERIC
source       TEXT               -- 'App Store' | 'Google Play' | 'Direct'
featured     BOOLEAN DEFAULT false
rotation     NUMERIC
status       TEXT DEFAULT 'published'
created_at   TIMESTAMPTZ DEFAULT now()
updated_at   TIMESTAMPTZ DEFAULT now()
```

### `waitlist`
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
name                  TEXT
first_name            TEXT
last_name             TEXT
email                 TEXT UNIQUE NOT NULL
phone                 TEXT
mobile_number         TEXT
date_of_birth         TEXT               -- stored as YYYY-MM-DD
gender                TEXT
role                  TEXT DEFAULT 'user'   -- 'user' | 'partner'
category              TEXT
company               TEXT
credit_cards_count    INTEGER
credit_cards_details  JSONB              -- array of { bank, card } objects
most_used_for         TEXT
monthly_spend         TEXT
referral_code         TEXT               -- code used when they signed up (others' code)
personal_referral_code TEXT UNIQUE       -- their own code e.g. YRKMNY1234
source_channel        TEXT
rank                  INTEGER DEFAULT 1000
status                TEXT DEFAULT 'pending'  -- 'pending'|'accepted'|'rejected'|'on_hold'
joined_at             TIMESTAMPTZ
created_at            TIMESTAMPTZ DEFAULT now()
```

### `users`
```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
email      TEXT UNIQUE NOT NULL
full_name  TEXT
role       TEXT DEFAULT 'user'   -- 'admin' | 'editor' | 'writer' | 'user'
created_at TIMESTAMPTZ DEFAULT now()
```

### `newsletters`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
email         TEXT UNIQUE NOT NULL
status        TEXT DEFAULT 'active'   -- 'active' | 'unsubscribed'
subscribed_at TIMESTAMPTZ DEFAULT now()
created_at    TIMESTAMPTZ DEFAULT now()
```

### `financial_ledger`
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_email  TEXT NOT NULL
brand_name  TEXT
amount      TEXT
description TEXT
date        TEXT
sender      TEXT
type        TEXT DEFAULT 'Transaction'
created_at  TIMESTAMPTZ DEFAULT now()
```

### `platform_notifications`
```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
title      TEXT NOT NULL
message    TEXT NOT NULL
type       TEXT DEFAULT 'info'    -- 'info' | 'warning' | 'success' | 'error'
status     TEXT DEFAULT 'active'  -- 'active' | 'archived'
image_url  TEXT
created_by TEXT
created_at TIMESTAMPTZ DEFAULT now()
```

### `notification_interactions`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
notification_id UUID NOT NULL
user_email      TEXT NOT NULL
username        TEXT
action          TEXT NOT NULL   -- 'read' | 'clicked'
created_at      TIMESTAMPTZ DEFAULT now()
UNIQUE (notification_id, user_email, action)
```

### `audit_logs`
```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
action     TEXT
entity     TEXT
entity_id  TEXT
performed_by TEXT
details    JSONB
created_at TIMESTAMPTZ DEFAULT now()
```

### `card_contributions`
```sql
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
type       TEXT NOT NULL    -- 'add' | 'update' | 'remove'
status     TEXT DEFAULT 'pending'  -- 'pending' | 'approved' | 'rejected' | 'resolved'
card_name  TEXT
email      TEXT
payload    JSONB
created_at TIMESTAMPTZ DEFAULT now()
```

### `user_owned_cards`
```sql
id                   UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id              UUID NOT NULL    -- Supabase Auth user ID
card_id              UUID             -- nullable, references cards.id
bank_name            TEXT NOT NULL
card_name            TEXT NOT NULL
card_image           TEXT
synced_from_waitlist BOOLEAN DEFAULT false
is_primary           BOOLEAN DEFAULT false
is_secondary         BOOLEAN DEFAULT false
created_at           TIMESTAMPTZ DEFAULT now()
```

### `platform_trash`
```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
entity_type TEXT NOT NULL   -- 'blog' | 'card' | 'review' | 'notification' | 'user' | 'waitlist'
original_id UUID NOT NULL
payload     JSONB NOT NULL  -- full snapshot of deleted row
deleted_by  TEXT DEFAULT 'Admin'
deleted_at  TIMESTAMPTZ DEFAULT now()
```

---

## 4. Authentication & Authorization

### How Supabase Auth Works with Java
Supabase issues JWTs (HS256) when users log in. These tokens contain:
- `sub` — the user's UUID (Supabase Auth user ID)
- `email` — user's email
- `role` — `authenticated`
- Standard claims: `iss`, `aud`, `exp`, `iat`

The Java API must:
1. Extract the `Authorization: Bearer <token>` header
2. Validate the JWT signature using `SUPABASE_JWT_SECRET`
3. Extract `sub` (userId) and `email` from claims
4. Inject a `CurrentUser` object into the request context

### Role Hierarchy
```
super_admin > admin > editor > writer > user
```

**Super admin emails** (always return `admin` role regardless of `users` table):
```
toanweshbiswas@gmail.com
buildwithjupyter.network@gmail.com
work.anweshbiswas@gmail.com
info.sachisiva@gmail.com
tiwari.sansrite@gmail.com
```
These should be stored in `application.yml` as a list, not hardcoded in Java source.

### Role Resolution
```
GET /api/v1/auth/role?email={email}
```
1. Check if email is in super_admin list → return `admin`
2. Query `users` table by email → return `role`
3. Default → return `user`

### Endpoint Protection Rules
| Endpoint group | Protection |
|---|---|
| `GET /api/v1/cms/**` | Public (no token required) |
| `POST /api/v1/waitlist/join` | Public |
| `POST /api/v1/newsletters/subscribe` | Public |
| `GET /api/v1/notifications` | Public |
| `POST /api/v1/contributions` | Public |
| `GET /api/v1/waitlist/entry` | Authenticated (any valid JWT) |
| `GET /api/v1/users/**` | Authenticated, user can only access own data (user_id from token must match) |
| `PATCH /api/v1/waitlist/rank/compute` | Authenticated |
| `POST /api/v1/notifications/{id}/interact` | Authenticated |
| `PATCH /api/v1/waitlist/{id}/metadata` | Authenticated |
| `GET /api/v1/ledger` | Authenticated |
| `POST /api/v1/ledger/scan` | Authenticated |
| `GET /api/v1/auth/admin-check` | Public (returns boolean) |
| `/api/v1/admin/**` | Authenticated + role in [admin, editor, writer] |

---

## 5. API Endpoints

All endpoints return JSON. Error shape:
```json
{ "error": "message", "status": 400 }
```

Success shape for lists:
```json
{ "data": [...], "count": 42 }
```

Success shape for single item:
```json
{ "data": { ... } }
```

---

### 5.1 Health

```
GET /api/v1/health
Response: { "status": "ok", "env": "production" }
```

---

### 5.2 CMS — Public

#### Cards
```
GET /api/v1/cms/cards
  Query params: none
  Returns: all cards with status='published', ordered by created_at DESC
  
GET /api/v1/cms/cards/{slugOrId}
  Logic: try slug match first; if not found and param is valid UUID, try id match
  Returns: single Card or 404
```

#### Blogs
```
GET /api/v1/cms/blogs
  Returns: blogs where status='published' AND (scheduled_at IS NULL OR scheduled_at <= NOW())
  Ordered by created_at DESC

GET /api/v1/cms/blogs/{slug}
  Returns: single Blog by slug or 404
```

#### Reviews
```
GET /api/v1/cms/reviews
  Returns: reviews where status='published', ordered by created_at DESC
```

---

### 5.3 CMS — Admin

All under `/api/v1/admin/` — require role in [admin, editor, writer].

#### Blogs
```
GET    /api/v1/admin/blogs          → all blogs (including drafts), ordered created_at DESC
POST   /api/v1/admin/blogs          → create blog
PUT    /api/v1/admin/blogs/{id}     → update blog
DELETE /api/v1/admin/blogs/{id}     → soft-delete (move to platform_trash), then hard-delete
```

**Blog create/update body:**
```json
{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "author": "string",
  "category": "string",
  "image": "string",
  "external_link": "string|null",
  "read_time": "string",
  "featured": false,
  "status": "published|draft",
  "scheduled_at": "ISO8601 timestamp|null"
}
```

**Scheduled publish logic**: If `scheduled_at` is an empty string, store as NULL. Blogs with a future `scheduled_at` are hidden from the public endpoint but visible in admin.

**Trash logic for delete**: Before deleting, insert the full row snapshot into `platform_trash` with `entity_type='blog'`, `original_id=id`, `payload=full_row_json`, `deleted_by=<admin email from JWT>`.

#### Cards
```
GET    /api/v1/admin/cards          → all cards (including drafts), ordered created_at DESC
POST   /api/v1/admin/cards          → create card
PUT    /api/v1/admin/cards/{id}     → update card
DELETE /api/v1/admin/cards/{id}     → trash + hard-delete
```

**Card create/update body**: the full Card schema from section 3. Strip undefined/null fields before insert. For `benefits` array: filter out empty strings. For `benefit_items`: filter items where `heading` is blank.

#### Reviews
```
GET    /api/v1/admin/reviews        → all reviews (including drafts)
POST   /api/v1/admin/reviews        → create review
PUT    /api/v1/admin/reviews/{id}   → update review
DELETE /api/v1/admin/reviews/{id}   → trash + hard-delete
```

---

### 5.4 Waitlist

#### Public
```
POST /api/v1/waitlist/join
```
**Body:**
```json
{
  "name": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "mobile_number": "string",
  "date_of_birth": "string",
  "gender": "string",
  "role": "user|partner",
  "category": "string",
  "company": "string",
  "credit_cards_count": 2,
  "credit_cards_details": [{ "bank": "HDFC", "card": "Regalia" }],
  "most_used_for": "string",
  "monthly_spend": "string",
  "referral_code": "string",
  "source_channel": "string"
}
```

**Join Logic (upsert):**
1. Normalise email: lowercase + trim
2. Check if email already exists in `waitlist`
3. **If exists**: update the row with new data, but **preserve existing `status`** (do not reset accepted users back to pending). Return the updated row.
4. **If new**:
   a. Count total rows in `waitlist`, compute `rank = 1000 + count + 1`
   b. Generate `personal_referral_code = "YRKMNY" + random 4-digit number (1000–9999)`
   c. Insert with `status='pending'`
   d. Return inserted row (include `personal_referral_code` in response)
5. Response: `{ "data": { ...waitlistEntry }, "alreadyExists": true|false }`

```
GET /api/v1/waitlist/entry?email={email}
  Returns: single waitlist entry by email (normalised), or 404
  Auth: Authenticated

PATCH /api/v1/waitlist/{id}/metadata
  Body: { "mobile_number": "...", "date_of_birth": "...", "gender": "..." }
  Auth: Authenticated — only update fields: mobile_number, date_of_birth, gender (profile update from dashboard)
```

#### Rank Engine
```
POST /api/v1/waitlist/rank/compute
  Body: { "email": "string" }
  Auth: Authenticated
```

**Rank Computation Logic:**
1. Fetch waitlist entry by email
2. Get `base_rank` and `personal_referral_code` from the entry
3. Count rows where `referral_code = personal_referral_code` → `total_referrals`
4. Count rows where `referral_code = personal_referral_code AND status = 'accepted'` → `approved_referrals`
5. `boost = (total_referrals × 15) + (approved_referrals × 35)`
6. `effective_rank = MAX(1, base_rank - boost)`
7. Persist `effective_rank` back to `waitlist.rank`
8. Return:
```json
{
  "baseRank": 1050,
  "effectiveRank": 985,
  "totalReferrals": 2,
  "approvedReferrals": 1,
  "rankBoost": 65,
  "entry": { ...updatedWaitlistEntry }
}
```

#### Referrals
```
GET /api/v1/waitlist/referrals?code={personalReferralCode}
  Returns: list of waitlist entries that used this code
  Fields returned: name, email (masked in frontend, full here), mobile_number, status, created_at
  Auth: Authenticated

GET /api/v1/waitlist/referrals/{code}/stats
  Returns: { "total": 4, "approved": 1 }
  Auth: Authenticated
```

#### Admin Waitlist
```
GET    /api/v1/admin/waitlist              → full list, all statuses, ordered created_at DESC
PATCH  /api/v1/admin/waitlist/{id}/status  → update status
DELETE /api/v1/admin/waitlist/{id}         → trash + hard-delete
```

**Status update body:** `{ "status": "accepted|rejected|on_hold|pending" }`

**Status update side-effect (CRITICAL):** When status changes to `'accepted'`, automatically call the card sync logic:
1. Fetch the waitlist entry (get `email` and `credit_cards_details`)
2. Find the Supabase Auth user by email (via Admin API or by joining against auth.users if accessible — see note below)
3. If the auth user exists, sync `credit_cards_details` into `user_owned_cards`:
   - Fetch existing `user_owned_cards` for the user (to avoid duplicates, dedup by `bank_name + card_name`)
   - For each entry in `credit_cards_details`: insert a row with `synced_from_waitlist=true`
   - **First card**: `is_primary=true, is_secondary=false`
   - **Second card**: `is_primary=false, is_secondary=true`
   - Skip if duplicate key already exists
4. This sync is best-effort — log warnings on failure, do not fail the status update itself

> **Note on Supabase Auth:** To look up a user by email, use the Supabase Management API (`GET /auth/v1/admin/users`) with the service role key, or query `auth.users` directly via JDBC (schema `auth`, table `users`). The JDBC approach is simpler in Java.

---

### 5.5 User Portal (Dashboard)

All endpoints require Authenticated JWT. `user_id` is always extracted from the JWT `sub` claim — never trusted from the request body.

#### User-Owned Cards
```
GET    /api/v1/users/cards
  Query: no params needed (user_id from JWT)
  Returns: list of user_owned_cards for this user, ordered created_at DESC

POST   /api/v1/users/cards
  Body:
    {
      "card_id": "uuid|null",
      "bank_name": "string",
      "card_name": "string",
      "card_image": "string|null",
      "synced_from_waitlist": false
    }
  Logic:
    - user_id is injected from JWT
    - If ownedCards count == 0: set is_primary=true
    - If ownedCards count == 1: set is_secondary=true
    - Otherwise: both false

DELETE /api/v1/users/cards/{id}
  Logic: verify the card belongs to the authenticated user before deleting

PATCH  /api/v1/users/cards/{id}/priority
  Body: { "role": "primary|secondary|none" }
  Logic:
    - If role == 'primary': clear is_primary from ALL other cards for this user, then set is_primary=true on this card, is_secondary=false
    - If role == 'secondary': clear is_secondary from ALL other cards for this user, then set is_secondary=true, is_primary=false
    - If role == 'none': set is_primary=false, is_secondary=false
```

---

### 5.6 Auth

```
GET /api/v1/auth/admin-check?userId={userId}&email={email}
```

**Logic:**
1. If email is in super_admin list → `{ "isAdmin": true }`
2. If no userId provided → `{ "isAdmin": false }`
3. Query `users` table by userId → check `role`
4. Return `{ "isAdmin": data.role === 'admin' }`

```
GET /api/v1/auth/role?email={email}
```

**Logic:**
1. Check super_admin list → return `'admin'`
2. Query `users` table by email → return role
3. Default → return `'user'`

---

### 5.7 Team Management (Admin)

```
GET    /api/v1/admin/team              → all users, ordered created_at DESC
POST   /api/v1/admin/team              → invite team member
PATCH  /api/v1/admin/team/{userId}/role → update role
DELETE /api/v1/admin/team/{userId}      → trash + hard-delete
```

**Invite body:** `{ "email": "string", "role": "admin|editor|writer" }`
- Insert into `users` table with `full_name = email.split('@')[0]`

---

### 5.8 Notifications

#### Public
```
GET /api/v1/notifications
  Returns: platform_notifications where status='active', ordered created_at DESC

POST /api/v1/notifications/{id}/interact
  Body: { "user_email": "string", "username": "string", "action": "read|clicked" }
  Auth: Authenticated
  Logic: INSERT into notification_interactions. On unique constraint violation (duplicate), silently ignore (don't error).

GET /api/v1/notifications/interactions?email={email}
  Auth: Authenticated
  Returns: all interactions for this email
```

#### Admin
```
GET    /api/v1/admin/notifications                  → all notifications (all statuses)
POST   /api/v1/admin/notifications                  → create notification
PUT    /api/v1/admin/notifications/{id}             → update notification
DELETE /api/v1/admin/notifications/{id}             → trash + hard-delete
PATCH  /api/v1/admin/notifications/{id}/archive     → set status='archived'
GET    /api/v1/admin/notifications/interactions     → all interaction logs
```

**Create/update body:**
```json
{
  "title": "string",
  "message": "string",
  "type": "info|warning|success|error",
  "image_url": "string|null",
  "created_by": "string"
}
```

---

### 5.9 Financial Ledger

```
GET /api/v1/ledger?email={email}
  Auth: Authenticated
  Logic:
    1. Query financial_ledger where user_email = email (normalised), return all rows
    2. Map columns: brand_name→brandName, etc. (camelCase in response)
    3. Also fetch profile from waitlist by email
    4. If no rows found in DB, fall back to reading data/financial_cache.json file (if present)
  Response:
    {
      "profile": { "name": "", "dob": "DD/MM/YYYY", "gender": "", "phone": "" },
      "transactions": [{ "brandName", "amount", "description", "date", "sender", "type" }]
    }
```

```
POST /api/v1/ledger/scan
  Auth: Authenticated
  Body: { "accessToken": "string", "email": "string", "fallbackData": {} }
  Logic: (see section 6 — Gmail Scanner)
```

---

### 5.10 Newsletters

```
POST /api/v1/newsletters/subscribe
  Body: { "email": "string" }
  Logic: INSERT with status='active'. On unique violation return the existing entry (not an error).

GET    /api/v1/admin/newsletters       → all subscribers, ordered subscribed_at DESC
DELETE /api/v1/admin/newsletters/{id}  → hard-delete (no trash for this entity)
```

---

### 5.11 Card Contributions (Community Intel)

```
POST /api/v1/contributions
  Body:
    {
      "type": "add|update|remove",
      "card_name": "string",
      "email": "string",
      "payload": { ...arbitrary fields }
    }
  Auth: Public
  Returns: created contribution

GET    /api/v1/admin/contributions                    → all, ordered created_at DESC
PATCH  /api/v1/admin/contributions/{id}/status        → { "status": "approved|rejected|resolved" }
DELETE /api/v1/admin/contributions/{id}               → hard-delete
```

---

### 5.12 Trash Engine

```
GET    /api/v1/admin/trash                 → all trash entries, ordered deleted_at DESC
POST   /api/v1/admin/trash/{id}/restore    → restore entity (see logic below)
DELETE /api/v1/admin/trash/{id}            → hard-delete from trash (permanent)
```

**Restore Logic:**
1. Fetch trash record by id
2. Map `entity_type` → table name:
   - `blog` → `blogs`
   - `card` → `cards`
   - `notification` → `platform_notifications`
   - `user` → `users`
   - `waitlist` → `waitlist`
   - `review` → `reviews`
3. Re-insert `payload` (full original row) into the target table
4. If insert succeeds, hard-delete the trash record
5. If insert fails (e.g. slug conflict), return 409 with details

---

### 5.13 Audit Logs

```
GET /api/v1/admin/audit-logs
  Returns: last 100 entries ordered created_at DESC
```

---

### 5.14 Admin Onboarding Email

```
POST /api/v1/admin/notify
  Body:
    {
      "email": "string",
      "role": "string",
      "firstName": "string"
    }
  Auth: Admin only
```

**Email content:**
- To: `email`
- From: `"Yureka One" <GMAIL_USER>`
- Subject: `"Welcome to Yureka One Admin Dashboard"`
- Body: HTML + text
  - Greet by `firstName` (or "there" if null)
  - State they've been added as `role`
  - Link to `https://yureka.one/admin`
  - Security note: auto-logout after 15 minutes of inactivity

---

## 6. Gmail Scanner (Email Ledger Feature)

This is the most complex feature. It currently runs as a Python subprocess. In Java, implement it natively using the Google API Client Library.

### Overview
When `/api/v1/ledger/scan` is called with a valid Google OAuth `accessToken`:
1. Build Gmail service from the token
2. Build People service from the token
3. Extract financial transactions from emails (two scanners: expense + bill)
4. Extract user profile from People API
5. Persist profile to `waitlist` table (upsert)
6. Deduplicate and persist transactions to `financial_ledger` table
7. Cache the result to `data/financial_cache.json` as local fallback
8. Return the result

### Expense Scanner
**Query:** Gmail search for `q = "amount OR transaction OR payment OR credited OR debited OR spent OR purchase"`, max 150 messages.

For each message:
1. Extract full body (HTML + text) and PDF attachments
2. Extract sender and subject
3. Parse transaction data:
   - **Brand/merchant**: extract from email sender domain or subject (e.g., `zomato.com` → `Zomato`)
   - **Amount**: regex for Indian currency patterns: `₹[\d,]+\.?\d*` or `Rs\.?\s*[\d,]+\.?\d*` or `INR\s*[\d,]+`
   - **Description**: first sentence of body
4. Filter: skip if amount is null or looks like a balance/OTP email

### Bill Scanner
**Query:** Gmail search for `q = "bill OR invoice OR statement OR outstanding OR due date OR payment due"`, max 500 messages.

For each message:
1. Extract subject, snippet, sender
2. Score the email (is it financial?):
   - keywords in subject: `outstanding`(5), `invoice`(5), `due`(4), `transaction`(4), `payment`(3), `bill`(2), `statement`(2)
   - min score = 2 to include
3. Extract amount from snippet (same regex as expense scanner)
4. Classify type: `Bill` if subject contains bill/statement/outstanding/due, else `Transaction`

### Profile Extraction (Google People API)
```
resourceName = 'people/me'
personFields = 'names,phoneNumbers,birthdays,genders,emailAddresses'
```

Extract:
- `name`: `names[0].givenName + " " + names[0].familyName`
- `gender`: `genders[0].formattedValue`
- `email`: `emailAddresses[0].value`
- `phone`: `phoneNumbers[0].value` (cleaned of non-digits)
- `dob`: `birthdays[0]` → format as `DD/MM/YYYY`

If People API fails, use fallback values from the `fallbackData` passed in the request.

### Persistence Logic

**Profile (upsert to `waitlist`):**
```
email = explicit email from request OR profile.email
1. Check if row exists by email
2. If exists: UPDATE name, first_name, last_name, mobile_number, date_of_birth (as YYYY-MM-DD), gender
3. If new: INSERT with rank=1000+count+1, personal_referral_code, status='pending'
```

**Transactions (dedup insert to `financial_ledger`):**
```
1. Fetch existing rows: SELECT brand_name, amount, date WHERE user_email = email
2. Build a set of existing keys: brand_name|amount|date
3. Filter new transactions against this set
4. Bulk insert only new ones
```

**Response:**
```json
{
  "profile": { "name": "...", "dob": "DD/MM/YYYY", "gender": "...", "phone": "...", "email": "..." },
  "transactions": [
    { "brandName": "Zomato", "amount": "₹450", "description": "...", "date": "2024-01-15", "sender": "...", "type": "Transaction" }
  ]
}
```

### Background Daily Sync
Use `@Scheduled(cron = "0 0 12 * * *")` (12:00 PM daily).

Trigger the same scanner pipeline using locally stored OAuth tokens (from `GOOGLE_TOKENS_PATH`). If no tokens exist, skip silently. Log result. Store in `financial_cache.json`.

---

## 7. Cross-Cutting Concerns

### Retry Logic
All Supabase/DB calls that are not in a request-response path should retry 3 times with exponential backoff (1s, 2s, 4s) on transient failures (connection reset, 502, 503).

### Data Cleaning (equivalent of `cleanData()`)
Before any INSERT or UPDATE:
- Remove fields that are `null` or `undefined` where the column has no default
- Convert empty string `""` to `null` for `scheduled_at`
- Filter empty strings from array fields (`benefits`, `product_details`, `pros`, `cons`, `exclusions`, `latest_news`, `cashback_details`)
- Filter blank-heading items from `benefit_items` JSONB array

### CORS
Allow:
- `https://yureka.one`
- `https://yureka.one`
- `http://localhost:3000`
- `http://localhost:5173`

All methods. Allow `Authorization`, `Content-Type` headers.

### Error Handling
- All endpoints: wrap in try/catch, return structured `{ "error": "...", "status": ... }`
- 404: entity not found
- 409: conflict (duplicate email, slug already exists)
- 403: unauthorized role
- 401: missing or invalid JWT
- 500: unexpected server error (log full stack trace, return generic message to client)

---

## 8. Project Structure (Recommended)

```
src/main/java/money/yureka/
├── YurekaApplication.java
├── config/
│   ├── SecurityConfig.java          # Spring Security + JWT filter
│   ├── CorsConfig.java
│   └── SchedulerConfig.java
├── security/
│   ├── JwtAuthFilter.java           # Extracts + validates Supabase JWT
│   └── CurrentUser.java             # Request-scoped user info
├── common/
│   ├── ApiResponse.java             # Wrapper: { data, count, error, status }
│   └── DataCleaner.java             # cleanData equivalent
├── modules/
│   ├── cms/
│   │   ├── CardsController.java
│   │   ├── CardsService.java
│   │   ├── BlogsController.java
│   │   ├── BlogsService.java
│   │   ├── ReviewsController.java
│   │   └── ReviewsService.java
│   ├── waitlist/
│   │   ├── WaitlistController.java
│   │   └── WaitlistService.java
│   ├── users/
│   │   ├── UserCardsController.java
│   │   └── UserCardsService.java
│   ├── ledger/
│   │   ├── LedgerController.java
│   │   ├── LedgerService.java
│   │   └── GmailScannerService.java  # Gmail + People API logic
│   ├── notifications/
│   │   ├── NotificationsController.java
│   │   └── NotificationsService.java
│   ├── contributions/
│   │   ├── ContributionsController.java
│   │   └── ContributionsService.java
│   └── admin/
│       ├── TrashController.java
│       ├── TrashService.java
│       ├── TeamController.java
│       ├── TeamService.java
│       ├── AuditController.java
│       ├── NewslettersController.java
│       └── EmailNotificationService.java  # JavaMailSender wrapper
└── entities/                        # JPA @Entity classes matching section 3
```

---

## 9. Notes for the Agent

1. **No Supabase client library needed** — connect directly to PostgreSQL via JDBC. Supabase is just a managed Postgres.

2. **JWT secret** — get it from Supabase project settings → API → JWT Secret. Use `io.jsonwebtoken:jjwt` library for verification.

3. **Supabase Auth users table** — it lives at `auth.users` schema, not `public.users`. To look up a user by email for the waitlist card sync, query `auth.users` via JDBC: `SELECT id FROM auth.users WHERE email = ?`. Requires the `postgres` user (direct DB connection).

4. **JSON columns** — map JSONB columns to `String` and let Jackson deserialise, or use `@JdbcTypeCode(SqlTypes.JSON)` with Hibernate 6.

5. **Array columns** (`TEXT[]`) — use `String[]` in JPA or map to `List<String>`. May need a custom Hibernate type for Postgres arrays.

6. **financial_cache.json** — store in a configurable path (`./data/financial_cache.json`). Used as fallback when DB has no rows for an email.

7. **Gmail OAuth tokens** — the scanner requires persistent OAuth tokens. Store them in the `GOOGLE_TOKENS_PATH` directory. When `accessToken` is provided in the request, use it directly (mobile app / frontend flow). When running the background sync, load from the token file (server-side flow). Use `StoredCredential` pattern from the Google API client library.

8. **Super admin list** — must be in `application.yml`, not hardcoded in Java source:
   ```yaml
   app:
     super-admins:
       - toanweshbiswas@gmail.com
       - buildwithjupyter.network@gmail.com
       - work.anweshbiswas@gmail.com
       - info.sachisiva@gmail.com
       - tiwari.sansrite@gmail.com
   ```

9. **Rank constants** — expose as config too:
   ```yaml
   app:
     rank:
       boost-per-referral: 15
       boost-per-approval: 35
       base: 1000
   ```

10. **`/api/v1/ledger/scan` timeout** — the Gmail scanner can take 10–30 seconds. Set Spring MVC async timeout or run it async (return a job ID and poll), or just set a high timeout (60s) and let the client wait. Current behaviour is synchronous — keep it synchronous for now.
