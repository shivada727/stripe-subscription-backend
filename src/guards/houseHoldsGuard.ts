import { CreateHouseholdInput } from '../types';
import { isHouseholdKind } from '../domain';

export function guardCreateHouseholdBody(body: any): CreateHouseholdInput {
    const { kind, address, postalCode, anchorAt } = body ?? {};

    if (!isHouseholdKind(kind))
        throw new Error('kind must be: single | duo | family');

    if (typeof address !== 'string' || address.trim().length < 5)
        throw new Error('address is required (>=5 chars)');

    if (typeof postalCode !== 'string' || postalCode.trim().length < 2)
        throw new Error('postalCode is required');

    const response: CreateHouseholdInput = {
        kind,
        address: address.trim(),
        postalCode: postalCode.trim(),
    };

    if (anchorAt !== undefined) {
        const ts = Number(anchorAt);

        if (!Number.isFinite(ts))
            throw new Error('anchorAt must be a unix timestamp (seconds)');

        response.anchorAt = ts;
    }
    return response;
}
