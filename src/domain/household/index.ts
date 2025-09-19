export const PLAN = {
    single: { capacity: 1, priceEnv: 'STRIPE_PRICE_SINGLE_SEAT' as const },
    duo: { capacity: 2, priceEnv: 'STRIPE_PRICE_DUO_SEAT' as const },
    family: { capacity: 6, priceEnv: 'STRIPE_PRICE_FAMILY_SEAT' as const },
} as const;

export type THouseholdKind = keyof typeof PLAN;

export const HOUSEHOLD_KINDS = Object.keys(PLAN) as THouseholdKind[];

export function isHouseholdKind(candidate: unknown): candidate is THouseholdKind {
    return typeof candidate === 'string' && candidate in PLAN;
}

export function getPlan(kind: THouseholdKind) {
    const { capacity, priceEnv } = PLAN[kind];
    const priceId = process.env[priceEnv];

    if (!priceId) throw new Error(`Missing ${priceEnv} in .env`);

    return { capacity, priceId };
}
