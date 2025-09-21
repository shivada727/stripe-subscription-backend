import Stripe from 'stripe';
import { WebhookService } from '../services/WebhookService';
import type { Request, Response } from 'express';

export class WebhookController {
    private stripe: Stripe;
    private service: WebhookService;

    constructor(secret = process.env.STRIPE_SECRET_KEY as string) {
        if (!secret) throw new Error('Missing STRIPE_SECRET_KEY');

        this.stripe = new Stripe(secret);

        this.service = new WebhookService();
    }

    handleStripe = async (request: Request, response: Response) => {
        const signature = request.header('stripe-signature');

        const secret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!signature || !secret)
            return response
                .status(400)
                .send('Missing stripe-signature or webhook secret');

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                request.body as Buffer,
                signature,
                secret
            );
        } catch (error: any) {
            console.error('❌ Webhook verify failed:', error.message);

            return response.status(400).send(`Webhook Error: ${error.message}`);
        }

        try {
            await this.service.markProcessedOrThrow(event.id);

            switch (event.type) {
                case 'invoice.paid':
                    await this.service.onInvoicePaid(event);
                    break;
                case 'invoice.payment_failed':
                    await this.service.onInvoicePaymentFailed(event);
                    break;
                case 'customer.subscription.deleted':
                    await this.service.onSubscriptionDeleted(event);
                    break;
                default:
                    console.log('ℹ️  Unhandled event type:', event.type);
            }

            return response.json({ received: true });
        } catch (error: any) {
            if (error?.code === 'event_already_processed') {
                return response.json({ received: true, duplicate: true });
            }

            console.error('🔥 Webhook handler failed:', error);

            return response.status(500).json({ error: 'handler_failed' });
        }
    };
}
