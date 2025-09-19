import { CreateHouseholdInput, THouseholdPublic } from '../../types';
import { getPlan, THouseholdKind } from '../../domain';
import { Household } from '../../models/households';
import { addressHash } from '../../utils/adress';

export class HouseholdService {
    async createPlan(input: CreateHouseholdInput): Promise<THouseholdPublic> {
        const { capacity, priceId } = getPlan(input.kind as THouseholdKind);
        const anchorAt = input.anchorAt ?? Math.floor(Date.now() / 1000);
        const hash = addressHash(input.address);

        const document = await Household.create({
            kind: input.kind,
            capacity,
            addressHash: hash,
            postalCode: input.postalCode,
            priceId,
            anchorAt,
        });

        return {
            id: document.id.toString(),
            kind: document.kind as THouseholdKind,
            capacity: document.capacity,
            postalCode: document.postalCode,
            anchorAt: document.anchorAt,
            createdAt: document.createdAt,
        };
    }
}
