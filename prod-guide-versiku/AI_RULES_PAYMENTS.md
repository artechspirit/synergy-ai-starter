⚠️ Extends root `AI_CONTEXT.md`. Payment wajib dianggap high-risk.

## 1. GENERAL
- Jangan percaya amount, currency, product price, atau discount dari client. Hitung ulang di server.
- Payment provider baru butuh ADR, risk note, dan rollback plan.
- Gunakan idempotency key untuk create payment/charge/order.
- Simpan state machine pembayaran secara eksplisit: `pending`, `paid`, `failed`, `expired`, `refunded`, `disputed` jika relevan.

## 2. WEBHOOKS
- Validasi signature webhook sebelum parsing business logic.
- Return 2xx cepat setelah validasi minimal; proses berat via queue/job.
- Handler webhook wajib idempotent.
- Simpan provider event id untuk deduplication.
- Jangan expose webhook secret di repo atau client.

## 3. RECONCILIATION
- Production payment butuh reconciliation job/report.
- Refund dan dispute harus punya audit trail.
- Jika fulfillment tergantung payment, fulfillment hanya boleh terjadi setelah status server-side valid.

## 4. TESTING
- Mock provider untuk unit/integration.
- Test minimal: duplicate webhook, invalid signature, amount mismatch, success payment, failed payment.
