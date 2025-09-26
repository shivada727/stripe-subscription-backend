export function getStripeKey(): string {
    const key = process.env.STRIPE_SECRET_KEY ?? '';

    if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
    
    return key;
}
