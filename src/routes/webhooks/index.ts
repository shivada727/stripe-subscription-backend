import Stripe from 'stripe';
import { Router } from 'express';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

router.post(
  '/stripe',
  require('express').raw({ type: 'application/json' }),
  (request, response) => {
    const signature = request.headers['stripe-signature'] as string| undefined;
    const secret = process.env.STRIPE_WEBHOOK_SECRET as string;

    if (!signature || !secret) return response.status(400).send('Missing signature/secret');

    try {
      const event = stripe.webhooks.constructEvent(request.body as Buffer, signature, secret);

      console.log('🔔', event.type, event.id);

      response.json({ received: true });
    } catch (error: any) {
      console.error('❌ verify failed:', error.message);

      response.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

export default router;
