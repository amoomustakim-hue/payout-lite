# Payout Lite

Nomba-powered payment tracking for small Nigerian businesses.

## Test Nomba webhook locally

Use a transaction reference created by the invoice payment action. The webhook endpoint is idempotent and will not double-count duplicate provider event IDs.

```json
{
  "id": "evt_test_001",
  "event": "payment.successful",
  "reference": "pl_inv_REPLACE_WITH_REFERENCE",
  "status": "successful",
  "data": {
    "reference": "pl_inv_REPLACE_WITH_REFERENCE",
    "status": "successful",
    "transactionId": "nomba_test_tx_001"
  }
}
```

Only the webhook should mark transactions and invoices as paid. Redirect pages show pending unless the database already has `PAID` from webhook processing.
