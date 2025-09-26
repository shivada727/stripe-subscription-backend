import Stripe from 'stripe';
import { StripeService } from '../services/StripeService';
import { getStripeKey } from '../utils/stripeKey';

const globalStripeCache = globalThis as unknown as {
    __stripeClient?: Stripe;
    __stripeService?: StripeService;
};

export const stripeClient: Stripe =
    globalStripeCache.__stripeClient ?? new Stripe(getStripeKey());

export const stripeService: StripeService =
    globalStripeCache.__stripeService ?? new StripeService(stripeClient);

globalStripeCache.__stripeClient ??= stripeClient;
globalStripeCache.__stripeService ??= stripeService;
