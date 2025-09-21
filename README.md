# 🏠 Stripe Household Subscriptions — Backend

Backend service for **subscription management** with:

- **Single / Duo / Family** plans (1, 2 or 6 seats).
- **Split payments** — each member pays for their own seat with their own card.
- Integration with **Stripe** (Customers, PaymentMethods, Subscriptions, Webhooks).
- **MongoDB** stores households and members.

---

## 0) Prerequisites

Install the following tools before you start:

- [Node.js (v20+)](https://nodejs.org/en/download/)
- [npm (v9+)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) _(bundled with Node)_
- [MongoDB Community (v6+)](https://www.mongodb.com/try/download/community)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) _(GUI client for inspecting data)_
- [Stripe CLI](https://stripe.com/docs/stripe-cli) _(for local webhooks and event triggers)_

---

## 1) Clone the Repository

```bash
git clone https://github.com/shivada727/stripe-subscription-backend.git
cd stripe-subscription-backend
git checkout development
```

---

## 1.1) Environmental Variables

Create a `.env` file in the root directory with the following content:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/stripe-project

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHER_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

STRIPE_PRICE_SINGLE_SEAT=price_xxx
STRIPE_PRICE_DUO_SEAT=price_xxx
STRIPE_PRICE_FAMILY_SEAT=price_xxx

APP_BASE_URL=http://localhost:3000
LOG_LEVEL=info
```

- **Price IDs** (`price_xxx`) are from [Stripe Dashboard → Products → Prices].
- **Webhook secret** (`whsec_xxx`) is from `stripe listen`.

---

## 2) Project Overview

This service provides:

- **Households**: create single/duo/family with capacity.
- **Members**: join a household by address/postal code.
- **Stripe Customers** created automatically on join.
- **Subscriptions**: each member subscribes individually with their own card.
- **Webhooks**: update member status when payments succeed, fail, or are canceled.
- **Cancel**: members can cancel their subscription.
- **GET endpoints**: inspect household and members state.

---

## 3) Local Development

### Install dependencies
```bash
npm install
```

### Run in dev mode (hot reload)
```bash
npm run dev
```

Server starts on:  
- Healthcheck → http://localhost:3000/health  

---

## 4) Webhooks Setup (Stripe CLI)

In a separate terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/webhooks/stripe
```

Copy the `whsec_xxx` value into `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 5) Endpoints (highlights)

### Households
- `POST /households`
  ```json
  {
    "kind": "family",
    "address": "Almaty, Gogolya 166",
    "postalCode": "00100"
  }
  ```
  → creates a household.

- `GET /households/:id` → returns household details and seat counters.

---

### Members
- `POST /households/:id/join`
  ```json
  {
    "address": "Almaty, Gogolya 166",
    "postalCode": "00100",
    "userId": "user@example.com"
  }
  ```
  → creates a member and a Stripe Customer.

- `GET /members/:id` → returns member details (status, customerId, subscriptionId).

---

### Subscription Flow

1. **Attach a card** to the Customer:  
   - via Stripe Dashboard → Customer → Add Payment Method → Set as default.  
   - or via Stripe CLI:
     ```bash
     stripe payment_methods create --type card        --card[number]=4242424242424242 --card[exp_month]=12 --card[exp_year]=2030 --card[cvc]=123
     stripe payment_methods attach pm_xxx --customer cus_xxx
     stripe customers update cus_xxx --invoice_settings[default_payment_method]=pm_xxx
     ```

2. `POST /members/:id/subscribe`  
   → creates a subscription for the member.

3. Webhooks (`invoice.paid`, `payment_failed`, `subscription.deleted`) update Member status.  
   For testing:
   ```bash
   stripe trigger invoice.paid
   stripe trigger invoice.payment_failed
   stripe trigger customer.subscription.deleted
   ```

---

### Cancel
- `POST /members/:id/cancel`  
  → marks subscription to cancel at the end of the current period.  
  After the period, webhook sets status to `canceled`.  

---

## 6) Scripts

```json
{
  "dev": "nodemon -r dotenv/config --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

- `npm run dev` → development with hot reload.  
- `npm run build` → compile TypeScript.  
- `npm start` → run compiled server.  

---

## 7) Typical Flow (Postman/Demo)

1. Create household → `POST /households`.  
2. Add member → `POST /households/:id/join`.  
3. Add card to the customer (Dashboard/CLI).  
4. Subscribe → `POST /members/:id/subscribe`.  
5. Simulate payment → `stripe trigger invoice.paid`.  
6. Inspect → `GET /members/:id`.  
7. Cancel → `POST /members/:id/cancel`.  

---

## 8) Troubleshooting

- **Missing payment method** → add a card for the customer.  
- **Anchor timestamp is in the past** → use future billing cycle anchors (handled by resolver).  
- **Webhook Error** → ensure `STRIPE_WEBHOOK_SECRET` matches `stripe listen`.  
- **Mongo connection failed** → ensure MongoDB is running on `mongodb://127.0.0.1:27017/stripe-project`.  

---
