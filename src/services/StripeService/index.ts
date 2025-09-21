import Stripe from 'stripe';

export class StripeService {
    private stripe: Stripe;

    constructor(secret = process.env.STRIPE_SECRET_KEY!) {
        if (!secret) throw new Error('Missing STRIPE_SECRET_KEY');

        this.stripe = new Stripe(secret);
    }

    async ensureCustomer(opts: {
        email?: string;
        name?: string;
        metadata?: Record<string, string>;
    }) {
        const customer = await this.stripe.customers.create({
            email: opts.email,
            name: opts.name,
            metadata: opts.metadata,
        });

        return customer.id;
    }

    async createSetupIntent(customerId: string) {
        const setupIntent = await this.stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
            usage: 'off_session',
        });

        return { id: setupIntent.id, clientSecret: setupIntent.client_secret! };
    }

    async createSubscription(params: {
        customerId: string;
        priceId: string;
        anchorAt: number;
    }) {
        const subscription = await this.stripe.subscriptions.create({
            customer: params.customerId,
            items: [{ price: params.priceId }],
            billing_cycle_anchor: params.anchorAt,
            proration_behavior: 'create_prorations',
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });
        return subscription;
    }

    async cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
        const subscribe = await this.stripe.subscriptions.update(
            subscriptionId,
            {
                cancel_at_period_end: true,
            }
        );

        const maybeCurrentPeriod =
            typeof (subscribe as any).current_period_end === 'number'
                ? ((subscribe as any).current_period_end as number)
                : undefined;

        const cancelAt = subscribe.cancel_at ?? maybeCurrentPeriod ?? null;

        return {
            id: subscribe.id,
            status: subscribe.status,
            cancelAt,
            currentPeriodEnd: maybeCurrentPeriod,
        };
    }

    async hasDefaultPaymentMethod(customerId: string) {
        const customerResponse = await this.stripe.customers.retrieve(
            customerId
        );
        
        const customer = customerResponse as Stripe.Customer;

        const defaultPaymentMethod =
            customer.invoice_settings?.default_payment_method;

        return !!defaultPaymentMethod;
    }
}
