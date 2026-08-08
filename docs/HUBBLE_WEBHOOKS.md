# Hubble webhook dashboard setup

Paste these into the Hubble partner portal (Staging and Production separately).
Replace the host if your Render service URL differs.

| Hubble setting | URL |
|---|---|
| Order Terminal Status Webhook | `https://yureka-api.onrender.com/api/hubble/webhooks/order-terminal` |
| Brand Updated Webhook | `https://yureka-api.onrender.com/api/hubble/webhooks/brand-updated` |
| Brand Discount Update Webhook | `https://yureka-api.onrender.com/api/hubble/webhooks/brand-discount` |
| Wallet Balance Low Webhook | `https://yureka-api.onrender.com/api/hubble/webhooks/wallet-low` |

1. Set **Webhook Signature** in Hubble to a long random secret.
2. Set the same value on Render as `HUBBLE_WEBHOOK_SECRET`.
3. Resume the Render `yureka-api` service (webhooks cannot hit a suspended service).

Signature: Hubble sends `X-Verify` = Base64(HMAC-SHA256(rawBody, secret)).

Resume Render, then save the four URLs + signature in Hubble before placing live orders.
