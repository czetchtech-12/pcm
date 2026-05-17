# Production Patch 007 — Giving / Donations

This patch makes the giving flow honest and safer for production v1:

- Public donors can only create `pending` giving records.
- The backend ignores any public attempt to submit `status: completed`.
- Donation amount is required and must be greater than zero.
- Purpose is required/defaulted to `General giving`.
- Payment provider is normalized to a safe enum: `manual`, `mtn_mobile_money`, `airtel_money`, `zamtel_money`, `bank_transfer`, `flutterwave`, `paypal`, `dpo_pay`.
- Donor phone and transaction/reference number are saved for treasurer verification.
- Admins can update giving status to `completed` or `failed` from `/admin/donations`.
- When an admin marks a donation completed, the system records `verified_at` and `verified_by`.
- If SMTP is configured, a simple donor receipt is sent after admin verification.

Important: this is still a manual/payment-record flow. It does not initiate real mobile-money or card payments. Real MTN/Airtel/Flutterwave/DPO integration requires merchant credentials and provider webhooks.

Run this migration in Supabase SQL Editor:

```sql
backend/src/sql/migrations/006_donation_manual_verification.sql
```
