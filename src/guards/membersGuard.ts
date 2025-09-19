import type { TJoinHouseholdInput } from '../types';

export function guardJoinHouseholdBody(body: any): TJoinHouseholdInput {
    const { address, postalCode, userId } = body ?? {};

    if (typeof address !== 'string' || address.trim().length < 5) {
        throw new Error('address is required (>=5 chars)');
    }
    if (typeof postalCode !== 'string' || postalCode.trim().length < 2) {
        throw new Error('postalCode is required');
    }

    return {
        address: address.trim(),
        postalCode: postalCode.trim(),
        userId:
            typeof userId === 'string' && userId.trim()
                ? userId.trim()
                : undefined,
    };
}
