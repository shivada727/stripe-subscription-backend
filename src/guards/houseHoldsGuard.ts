import { ICreateHouseholdInput } from '../domain/household/dto';
import { isHouseholdKind } from './typeGuard';

export function guardCreateHouseholdBody(body: any): ICreateHouseholdInput {
    const { kind, address, postalCode, anchorAt } = body ?? {};

    if (!isHouseholdKind(kind))
        throw new Error('kind must be: single | duo | family');

    if (typeof address !== 'string' || address.trim().length < 5)
        throw new Error('address is required (>=5 chars)');

    if (typeof postalCode !== 'string' || postalCode.trim().length < 2)
        throw new Error('postalCode is required');

    const response: ICreateHouseholdInput = {
        kind,
        address: address.trim(),
        postalCode: postalCode.trim(),
    };

    if (anchorAt != null) {
        const numeric =
            typeof anchorAt === 'number' ? anchorAt : Number(anchorAt);

        if (!Number.isFinite(numeric) || !Number.isInteger(numeric)) {
            throw new Error(
                'anchorAt must be an integer unix timestamp (seconds)'
            );
        }
        if (numeric <= 0) {
            throw new Error(
                'anchorAt must be a positive unix timestamp (seconds)'
            );
        }

        response.anchorAt = numeric;
    }

    return response;
}
