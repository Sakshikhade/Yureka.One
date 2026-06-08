# Yureka Money — API Reference

> **Base URL (local):** `http://localhost:8080`  
> **Base URL (prod):** `https://api.yureka.money`  
> **Interactive docs:** `{baseUrl}/swagger-ui`  
> **OpenAPI JSON:** `{baseUrl}/api-docs`

---

## Authentication

All protected endpoints require a Supabase-issued JWT in the `Authorization` header:

```
Authorization: Bearer <supabase_jwt_token>
```

The token is obtained from Supabase Auth after the user logs in. The `sub` claim is the user's UUID; `email` is their email address.

**Auth levels used in this doc:**

| Label | Meaning |
|---|---|
| 🔓 Public | No token required |
| 🔐 Auth | Any valid Supabase JWT |
| 🛡 Admin | Valid JWT + role must be `admin`, `editor`, or `writer` |

---

## Response Envelope

Every response is wrapped in `YurekaResponse<T>`:

**Success (single item)**
```json
{
  "data": { ... },
  "status": 200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Success (list)**
```json
{
  "data": [ ... ],
  "count": 42,
  "status": 200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error**
```json
{
  "error": "Card not found: hdfc-regalia",
  "status": 404,
  "path": "/api/v1/cms/cards/hdfc-regalia",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation error (400)**
```json
{
  "error": "Validation failed",
  "status": 400,
  "path": "/api/v1/waitlist/join",
  "details": {
    "email": ["must not be blank"],
    "type":  ["must not be blank"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 1. Health

### `GET /api/v1/health` 🔓

Liveness check. Safe to poll from anywhere.

**Response**
```json
{ "data": { "status": "ok", "env": "production" }, "status": 200 }
```

---

## 2. Auth

### `GET /api/v1/auth/role` 🔓

Returns the role for a given email. Call this immediately after Supabase login to decide which dashboard to render.

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | User's email address |

**Response**
```json
{ "data": { "role": "admin" }, "status": 200 }
```

Possible values: `admin` · `editor` · `writer` · `user`

**FE usage:** Call after `supabase.auth.signIn()`. If role is `admin/editor/writer` → redirect to `/admin`. Otherwise → redirect to `/dashboard`.

---

### `GET /api/v1/auth/admin-check` 🔓

Returns whether a user is an admin. Used to conditionally show admin UI elements.

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `userId` | string (UUID) | optional | JWT `sub` claim |
| `email` | string | optional | User's email |

Pass at least one. Email takes priority (super-admin check happens by email).

**Response**
```json
{ "data": { "isAdmin": true }, "status": 200 }
```

**FE usage:** Call on every protected admin route to guard the page render.

---

## 3. CMS — Cards (Public)

### `GET /api/v1/cms/cards` 🔓

All published credit cards, newest first. Cached 30 min.

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "HDFC Regalia",
      "slug": "hdfc-regalia",
      "bank": "HDFC",
      "rating": 4.5,
      "benefits": ["Airport lounge", "Fuel surcharge waiver"],
      "annualFee": "₹2,500",
      "status": "published",
      ...
    }
  ],
  "count": 38,
  "status": 200
}
```

**FE usage:** Card catalogue page, search index, comparison tool.

---

### `GET /api/v1/cms/cards/{slugOrId}` 🔓

Single card by slug or UUID. Slug is tried first; UUID fallback if not found and param is a valid UUID.

**Path params**

| Param | Description |
|---|---|
| `slugOrId` | Card slug (e.g. `hdfc-regalia`) or UUID |

**Errors:** `404` if not found.

**FE usage:** Card detail page — route `/cards/[slug]`.

---

## 4. CMS — Blogs (Public)

### `GET /api/v1/cms/blogs` 🔓

All live blog posts. Only `status = published` AND (`scheduled_at IS NULL` OR `scheduled_at <= NOW()`). Cached 30 min.

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Top 5 Cashback Cards 2024",
      "slug": "top-5-cashback-cards-2024",
      "excerpt": "...",
      "author": "Anwesh",
      "category": "Guides",
      "featured": true,
      "status": "published",
      "scheduledAt": null,
      ...
    }
  ],
  "count": 12,
  "status": 200
}
```

**FE usage:** Blog listing page.

---

### `GET /api/v1/cms/blogs/{slug}` 🔓

Single blog post by slug.

**Path params**

| Param | Description |
|---|---|
| `slug` | Blog URL slug (e.g. `top-5-cashback-cards-2024`) |

**Errors:** `404` if not found or if post is a draft.

**FE usage:** Blog detail page — route `/blog/[slug]`.

---

## 5. CMS — Reviews (Public)

### `GET /api/v1/cms/reviews` 🔓

All published testimonials, newest first. Cached 30 min.

**FE usage:** Landing page testimonials section.

---

## 6. Admin — Cards 🛡

> Requires JWT with role `admin`, `editor`, or `writer`.

### `GET /api/v1/admin/cards`

All cards including drafts. Use for the admin card management table.

---

### `POST /api/v1/admin/cards`

Create a new card. Empty strings in array fields are stripped automatically. Blank `benefitItems` headings are removed. Cache evicted on success.

**Request body** — full Card schema:

```json
{
  "name": "HDFC Regalia",
  "bank": "HDFC",
  "issuer": "Visa",
  "type": "Credit",
  "slug": "hdfc-regalia",
  "status": "published",
  "rating": 4.5,
  "annualFee": "₹2,500",
  "joiningFee": "₹2,500",
  "benefits": ["Airport lounge access", ""],
  "benefitItems": "[{\"heading\":\"Lounge\",\"subheading\":\"4 visits/quarter\"}]",
  "tags": ["travel", "lounge"],
  "categories": ["premium"],
  "applyLink": "https://...",
  "description": "...",
  "rewardType": "Points",
  "welcomeBenefits": "...",
  "pros": ["Great rewards"],
  "cons": ["High annual fee"],
  "verdict": "...",
  "projectedSavings": "₹12,000/year"
}
```

Empty strings in `benefits`, `tags`, `pros`, `cons`, `exclusions` etc. are filtered out automatically. Returns `201`.

---

### `PUT /api/v1/admin/cards/{id}`

Full replace. Pass the complete card object. `created_at` is preserved from the existing record.

**Path params:** `id` — card UUID  
**Errors:** `404` if not found.

---

### `DELETE /api/v1/admin/cards/{id}`

Snapshots full card to `platform_trash`, then hard-deletes. Restorable via `POST /api/v1/admin/trash/{id}/restore`.

---

## 7. Admin — Blogs 🛡

### `GET /api/v1/admin/blogs`

All blogs including drafts and future-scheduled posts.

---

### `POST /api/v1/admin/blogs`

**Request body:**
```json
{
  "title": "Top 5 Cashback Cards",
  "slug": "top-5-cashback-cards",
  "excerpt": "...",
  "content": "<p>Full HTML content</p>",
  "author": "Anwesh",
  "category": "Guides",
  "image": "https://...",
  "external_link": null,
  "read_time": "5 min",
  "featured": false,
  "status": "published",
  "scheduled_at": ""
}
```

`scheduled_at`: pass `""` or omit to publish immediately. Pass ISO-8601 (e.g. `"2024-12-01T10:00:00Z"`) to schedule. Returns `201`.

---

### `PUT /api/v1/admin/blogs/{id}`

Update a blog post. `created_at` preserved. Same body shape as create. `scheduled_at: ""` → clears the schedule.

---

### `DELETE /api/v1/admin/blogs/{id}`

Trash + hard delete.

---

## 8. Admin — Reviews 🛡

### `GET /api/v1/admin/reviews`
### `POST /api/v1/admin/reviews`

**Request body:**
```json
{
  "author": "Rahul Mehta",
  "role": "Software Engineer",
  "company": "Infosys",
  "quote": "Yureka helped me pick the perfect card.",
  "rating": 5,
  "source": "Google Play",
  "featured": true,
  "status": "published"
}
```
Returns `201`.

### `PUT /api/v1/admin/reviews/{id}`
### `DELETE /api/v1/admin/reviews/{id}` — trash + hard delete.

---

## 9. Waitlist

### `POST /api/v1/waitlist/join` 🔓

Upsert waitlist entry by email.

- **Existing email:** updates fields, preserves `status` (accepted users are never reset to pending).
- **New email:** assigns rank (`1000 + total_count + 1`), generates `YRKMNY####` referral code.

**Request body:**
```json
{
  "name": "Rahul Mehta",
  "first_name": "Rahul",
  "last_name": "Mehta",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "mobile_number": "+919876543210",
  "date_of_birth": "1995-03-15",
  "gender": "Male",
  "role": "user",
  "category": "salaried",
  "company": "Infosys",
  "credit_cards_count": 2,
  "credit_cards_details": [
    { "bank": "HDFC", "card": "Regalia" },
    { "bank": "Axis", "card": "Ace" }
  ],
  "most_used_for": "Travel",
  "monthly_spend": "₹25,000",
  "referral_code": "YRKMNY1234",
  "source_channel": "Instagram"
}
```

**Response:**
```json
{
  "data": {
    "data": { ...waitlistEntry },
    "alreadyExists": false
  },
  "status": 200
}
```

`alreadyExists: true` → show "Welcome back" message. `false` → show "You're on the list" with rank and referral code.

---

### `GET /api/v1/waitlist/entry` 🔐

Get a waitlist entry by email. Used to populate the dashboard waitlist card.

**Query:** `?email=rahul@example.com`  
**Errors:** `404` if email not found.

---

### `PATCH /api/v1/waitlist/{id}/metadata` 🔐

Update the three profile fields from the dashboard profile form.

**Request body:**
```json
{
  "mobile_number": "+919876543210",
  "date_of_birth": "1995-03-15",
  "gender": "Male"
}
```

All fields optional — only supplied fields are updated.

---

### `POST /api/v1/waitlist/rank/compute` 🔐

Recomputes the user's effective rank based on referral activity. Call after the user shares their referral link.

**Formula:**
```
boost = (totalReferrals × 15) + (approvedReferrals × 35)
effectiveRank = max(1, baseRank - boost)
```

**Request body:**
```json
{ "email": "rahul@example.com" }
```

**Response:**
```json
{
  "data": {
    "baseRank": 1050,
    "effectiveRank": 985,
    "totalReferrals": 2,
    "approvedReferrals": 1,
    "rankBoost": 65,
    "entry": { ...updatedWaitlistEntry }
  },
  "status": 200
}
```

---

### `GET /api/v1/waitlist/referrals` 🔐

People who joined using this user's referral code.

**Query:** `?code=YRKMNY1234`

**FE usage:** Referral list in the dashboard.

---

### `GET /api/v1/waitlist/referrals/{code}/stats` 🔐

Quick referral count stats.

**Response:**
```json
{ "data": { "total": 4, "approved": 1 }, "status": 200 }
```

**FE usage:** Referral stats widget in the dashboard.

---

## 10. Admin — Waitlist 🛡

### `GET /api/v1/admin/waitlist`

All waitlist entries across all statuses, ordered newest first.

---

### `PATCH /api/v1/admin/waitlist/{id}/status`

Update a waitlist entry's status.

**Request body:**
```json
{ "status": "accepted" }
```

Valid values: `accepted` · `rejected` · `on_hold` · `pending`

⚠️ **Side effect on `accepted`:** The service automatically finds the user in `auth.users` and syncs their `credit_cards_details` into `user_owned_cards`. First card → `is_primary = true`. Second → `is_secondary = true`. This sync is best-effort — the status update succeeds even if sync fails.

---

### `DELETE /api/v1/admin/waitlist/{id}`

Trash + hard delete.

---

## 11. User — Cards 🔐

> `userId` is always derived from the JWT `sub` claim. Never pass it in the request body.

### `GET /api/v1/users/cards`

All cards in the user's portfolio, newest first.

**FE usage:** Card portfolio section of the dashboard.

---

### `POST /api/v1/users/cards`

Add a card to the portfolio.

**Request body:**
```json
{
  "card_id": "uuid-or-null",
  "bank_name": "HDFC",
  "card_name": "Regalia",
  "card_image": "https://...",
  "synced_from_waitlist": false
}
```

- First card added → `is_primary = true`
- Second card added → `is_secondary = true`
- Third+ → both false

Returns `201`.

---

### `DELETE /api/v1/users/cards/{id}`

Remove a card. Returns `403` if the card doesn't belong to the current user.

---

### `PATCH /api/v1/users/cards/{id}/priority`

Set card priority.

**Request body:**
```json
{ "role": "primary" }
```

| `role` | Effect |
|---|---|
| `primary` | Clears `is_primary` from all other user cards, sets it on this one |
| `secondary` | Clears `is_secondary` from all other user cards, sets it on this one |
| `none` | Clears both flags on this card |

**FE usage:** "Set as main card" / "Set as secondary card" actions in the dashboard.

---

## 12. Notifications

### `GET /api/v1/notifications` 🔓

Active platform notifications (banners, alerts), newest first. Cached 5 min.

**FE usage:** Announcement banners on the dashboard. Render on every page load.

---

### `POST /api/v1/notifications/{id}/interact` 🔐

Record that a user has read or clicked a notification. Duplicate interactions are silently ignored.

**Request body:**
```json
{
  "user_email": "rahul@example.com",
  "username": "Rahul",
  "action": "read"
}
```

`action`: `read` · `clicked`

**FE usage:** Call when a notification becomes visible in the viewport (`read`) or when the user clicks it (`clicked`).

---

### `GET /api/v1/notifications/interactions` 🔐

All interaction records for a specific user. Used to know which notifications to hide.

**Query:** `?email=rahul@example.com`

**FE usage:** Fetch on dashboard load. Filter out notifications the user has already `read`.

---

## 13. Admin — Notifications 🛡

### `GET /api/v1/admin/notifications`

All notifications regardless of status.

---

### `POST /api/v1/admin/notifications`

**Request body:**
```json
{
  "title": "New feature: Card Scanner",
  "message": "You can now scan your Gmail to auto-detect transactions.",
  "type": "info",
  "image_url": "https://...",
  "created_by": "admin@yureka.money"
}
```

`type`: `info` · `warning` · `success` · `error`. Returns `201`.

---

### `PUT /api/v1/admin/notifications/{id}`

Full update. Same body as create.

---

### `PATCH /api/v1/admin/notifications/{id}/archive`

Sets `status = archived`. Notification disappears from the public endpoint but stays in DB.

---

### `DELETE /api/v1/admin/notifications/{id}`

Trash + hard delete.

---

### `GET /api/v1/admin/notifications/interactions`

All read/clicked interaction records across all notifications. Use for engagement analytics.

---

## 14. Newsletters

### `POST /api/v1/newsletters/subscribe` 🔓

Subscribe to the newsletter. Returns the existing record if already subscribed (no error).

**Request body:**
```json
{ "email": "rahul@example.com" }
```

**FE usage:** Footer subscribe form.

---

### `GET /api/v1/admin/newsletters` 🛡

All subscribers ordered by `subscribed_at DESC`.

---

### `DELETE /api/v1/admin/newsletters/{id}` 🛡

Hard delete — no trash (for GDPR removal).

---

## 15. Card Contributions (Community Intel)

### `POST /api/v1/contributions` 🔓

Submit a card add/update/remove suggestion.

**Request body:**
```json
{
  "type": "add",
  "card_name": "HDFC Tata Neu",
  "email": "rahul@example.com",
  "payload": {
    "bank": "HDFC",
    "annual_fee": "₹499",
    "notes": "Missing from the catalogue"
  }
}
```

`type`: `add` · `update` · `remove`. All submissions start with `status = pending`. Returns `201`.

---

### `GET /api/v1/admin/contributions` 🛡

All contributions ordered newest first. Use for the admin review queue.

---

### `PATCH /api/v1/admin/contributions/{id}/status` 🛡

**Request body:**
```json
{ "status": "approved" }
```

`status`: `approved` · `rejected` · `resolved`

---

### `DELETE /api/v1/admin/contributions/{id}` 🛡

Hard delete — no trash.

---

## 16. Admin — Team 🛡

### `GET /api/v1/admin/team`

All users in the `users` table (people who can access the admin dashboard).

---

### `POST /api/v1/admin/team`

Invite a new team member.

**Request body:**
```json
{ "email": "editor@yureka.money", "role": "editor" }
```

`role`: `admin` · `editor` · `writer`

`full_name` is derived from the email prefix. Returns `409` if email already exists. Returns `201`.

**FE workflow:** Invite → then call `POST /api/v1/admin/notify` to send the welcome email.

---

### `PATCH /api/v1/admin/team/{userId}/role`

Change a team member's role.

**Request body:**
```json
{ "role": "writer" }
```

---

### `DELETE /api/v1/admin/team/{userId}`

Trash + hard delete. The removed user loses admin access immediately.

---

## 17. Admin — Trash 🛡

All admin deletes across the platform land here first (cards, blogs, reviews, notifications, users, waitlist entries).

### `GET /api/v1/admin/trash`

All trashed items ordered by `deleted_at DESC`.

**Response includes:**

| Field | Description |
|---|---|
| `entityType` | `blog` · `card` · `review` · `notification` · `user` · `waitlist` |
| `originalId` | UUID of the deleted entity |
| `payload` | Full JSON snapshot of the deleted row |
| `deletedBy` | Email of the admin who deleted it |
| `deletedAt` | Timestamp |

---

### `POST /api/v1/admin/trash/{id}/restore`

Re-inserts the payload into the original table. Returns `409` if a unique constraint conflict is detected (e.g. a blog slug is already taken by a newer post).

---

### `DELETE /api/v1/admin/trash/{id}`

Permanent deletion — no further recovery possible.

---

## 18. Admin — Audit Logs 🛡

### `GET /api/v1/admin/audit-logs`

The 100 most recent audit log entries, ordered newest first.

**FE usage:** Admin Activity Log page.

---

## 19. Admin — Email 🛡

### `POST /api/v1/admin/notify`

Sends the Yureka Money Admin Dashboard welcome email.

**Request body:**
```json
{
  "email": "neweditor@yureka.money",
  "role": "editor",
  "firstName": "Priya"
}
```

**Email content:**
- Subject: `Welcome to Yureka Money Admin Dashboard`
- Greets by `firstName`; uses "there" if null
- States their role
- Link to `https://yurekamoney.netlify.app/admin`
- Security note: auto-logout after 15 min of inactivity

**FE workflow:** Call immediately after `POST /api/v1/admin/team`.

---

## 20. Financial Ledger

### `GET /api/v1/ledger` 🔐

Returns the user's financial transactions and profile.

**Query:** `?email=rahul@example.com`

Data source order:
1. `financial_ledger` table (filtered by email)
2. Falls back to `data/financial_cache.json` if table has no rows for this email

**Response:**
```json
{
  "data": {
    "profile": {
      "name": "Rahul Mehta",
      "dob": "15/03/1995",
      "gender": "Male",
      "phone": "9876543210",
      "email": "rahul@example.com"
    },
    "transactions": [
      {
        "brandName": "Zomato",
        "amount": "₹450",
        "description": "Order confirmed. Your total is ₹450...",
        "date": "2024-01-15",
        "sender": "orders@zomato.com",
        "type": "Transaction"
      }
    ]
  },
  "status": 200
}
```

---

### `POST /api/v1/ledger/scan` 🔐

Scans the user's Gmail inbox for financial transactions. **Synchronous — may take 10–30 seconds.** Do not set a short timeout on the frontend.

Scanner details:
- **Expense scanner:** Gmail query for payment/transaction keywords, up to 150 messages
- **Bill scanner:** Gmail query for bill/invoice/due keywords, up to 500 messages (scored by keyword weight)
- **Profile:** fetched from Google People API (name, gender, phone, DOB, email)
- Results are deduped against existing DB records before inserting

**Request body:**
```json
{
  "accessToken": "<google_oauth_access_token>",
  "email": "rahul@example.com",
  "fallbackData": {
    "name": "Rahul",
    "dob": "15/03/1995",
    "gender": "Male",
    "phone": "9876543210"
  }
}
```

`accessToken`: Google OAuth access token from the FE Google sign-in flow.  
`fallbackData`: Used for profile fields if the People API returns nothing. All fields optional.

**Response:** Same shape as `GET /api/v1/ledger`.

---

## Error Reference

| HTTP | When |
|---|---|
| `400` | Missing required field, malformed JSON, invalid UUID format |
| `401` | Missing or invalid JWT |
| `403` | Valid JWT but insufficient role |
| `404` | Entity not found |
| `405` | Wrong HTTP method for this endpoint |
| `409` | Duplicate unique field (email, slug) or restore conflict |
| `500` | Unexpected server error (check server logs) |

---

## FE Integration Checklist

- [ ] Set `Authorization: Bearer <token>` on all 🔐 and 🛡 requests
- [ ] Handle `alreadyExists` from `POST /waitlist/join` to show correct confirmation UI
- [ ] Do **not** pass `userId` in request bodies — it is always extracted from the JWT server-side
- [ ] `POST /ledger/scan` is slow (10–30s) — show a loading spinner and do not timeout below 60s
- [ ] `scheduled_at` in blog requests: pass `""` to publish immediately, ISO-8601 string to schedule
- [ ] After `POST /admin/team`, call `POST /admin/notify` to send the welcome email
- [ ] On `PATCH /admin/waitlist/{id}/status` with `accepted`, card sync happens automatically server-side
- [ ] Fetch `GET /notifications` + `GET /notifications/interactions` on dashboard load to render and filter banners
