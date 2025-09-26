import { IJoinHouseholdInput } from '../domain/household/dto';

export function guardJoinHouseholdBody(body: any): IJoinHouseholdInput {
    const { address, postalCode, userId } = body ?? {};

    if (typeof address !== 'string' || address.trim().length < 5) {
        throw new Error('address is required (>=5 chars)');
    }
    if (typeof postalCode !== 'string' || postalCode.trim().length < 2) {
        throw new Error('postalCode is required');
    }

    const trimmedAddress = address.trim();
    const trimmedPostalCode = postalCode.trim();

    let normalizedUserId: string | undefined;

    if (typeof userId === 'string') {
        const trimmedUserId = userId.trim();
        if (trimmedUserId) normalizedUserId = trimmedUserId;
    }

    return {
        address: trimmedAddress,
        postalCode: trimmedPostalCode,
        userId: normalizedUserId,
    };
}
