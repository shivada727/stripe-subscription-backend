export enum PlanType {
    Single = 'single',
    Duo = 'duo',
    Family = 'family',
}

export type PriceEnvKey =
    | 'STRIPE_PRICE_SINGLE_SEAT'
    | 'STRIPE_PRICE_DUO_SEAT'
    | 'STRIPE_PRICE_FAMILY_SEAT';

export type PlanConfig = {
    capacity: number;
    priceEnv: PriceEnvKey;
};

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
    [PlanType.Single]: { capacity: 1, priceEnv: 'STRIPE_PRICE_SINGLE_SEAT' },
    [PlanType.Duo]: { capacity: 2, priceEnv: 'STRIPE_PRICE_DUO_SEAT' },
    [PlanType.Family]: { capacity: 6, priceEnv: 'STRIPE_PRICE_FAMILY_SEAT' },
};

export type THouseholdKind = PlanType;

export const HOUSEHOLD_KINDS = Object.values(PlanType) as THouseholdKind[];

export function getPlan(kind: THouseholdKind) {
    const { capacity, priceEnv } = PLAN_CONFIG[kind];

    const priceId = process.env[priceEnv];

    if (!priceId) throw new Error(`Missing ${priceEnv} in .env`);

    return { capacity, priceId };
}

export const ACTIVATION_THRESHOLD: Record<THouseholdKind, number> = {
    [PlanType.Single]: PLAN_CONFIG[PlanType.Single].capacity,
    [PlanType.Duo]: PLAN_CONFIG[PlanType.Duo].capacity,
    [PlanType.Family]: PLAN_CONFIG[PlanType.Family].capacity,
};
