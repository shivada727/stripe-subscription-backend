import Stripe from 'stripe';
import { WebhookService } from '../services/WebhookService';
import { HttpStatus } from '../domain/httpStatuses';
import { StripeHeader } from '../domain/headers';
import { Request, Response } from 'express';

export class WebhookController {
    private readonly stripe: Stripe;
    private readonly service: WebhookService;
    private readonly handlers: Record<
        string,
        (event: Stripe.Event) => Promise<void>
    >;

    constructor(
        secret: string = process.env.STRIPE_SECRET_KEY as string,
        service: WebhookService = new WebhookService()
    ) {
        if (!secret) throw new Error('Missing STRIPE_SECRET_KEY');

        this.stripe = new Stripe(secret);
        this.service = service;

        this.handlers = {
            'invoice.paid': (event) => this.service.onInvoicePaid(event),
            'invoice.payment_failed': (event) =>
                this.service.onInvoicePaymentFailed(event),
            'customer.subscription.deleted': (event) =>
                this.service.onSubscriptionDeleted(event),
        };
    }

    public async handleStripe(request: Request, response: Response) {
        const signature = request.header(StripeHeader.Signature);
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!signature || !webhookSecret) {
            const error: any = new Error(
                'Missing stripe-signature or webhook secret'
            );

            error.status = HttpStatus.BAD_REQUEST;
            error.asText = true;

            throw error;
        }

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                request.body as Buffer,
                signature,
                webhookSecret
            );
        } catch (err: any) {
            const error: any = new Error(
                `Webhook Error: ${err?.message || 'invalid_payload'}`
            );

            error.status = HttpStatus.BAD_REQUEST;
            error.asText = true;

            throw error;
        }

        await this.service.markProcessedOrThrow(event.id);

        const handler = this.handlers[event.type];

        if (!handler) {
            console.log('Unhandled event type:', event.type);

            return response.status(HttpStatus.OK).json({ received: true });
        }

        await handler(event);

        return response.status(HttpStatus.OK).json({ received: true });
    }
}
