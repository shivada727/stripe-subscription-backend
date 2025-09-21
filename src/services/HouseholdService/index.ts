import { getPlan, THouseholdKind } from '../../domain/household';
import { Household } from '../../models/households';
import { addressHash } from '../../utils/adress';
import { StripeService } from '../StripeService';
import { Member } from '../../models/members';
import {
    CreateHouseholdInput,
    THouseholdPublic,
    TJoinHouseholdInput,
    TMemberPublic,
} from '../../types';

const stripeSvc = new StripeService();

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

    async joinPlan(
        householdId: string,
        input: TJoinHouseholdInput
    ): Promise<TMemberPublic> {
        const lookingForHousehold = await Household.findById(
            householdId
        ).lean();

        if (!lookingForHousehold) {
            throw new Error('household_not_found');
        }

        const incomingHash = addressHash(input.address);

        if (
            incomingHash !== lookingForHousehold.addressHash ||
            input.postalCode !== lookingForHousehold.postalCode
        ) {
            throw new Error('address_mismatch');
        }

        const seatsUsed = await Member.countDocuments({
            householdId,
            status: { $in: ['pending', 'active', 'past_due', 'paused'] },
        });

        if (seatsUsed >= lookingForHousehold.capacity) {
            throw new Error('household_full');
        }

        const member = await Member.create({
            householdId,
            userId: input.userId,
            status: 'pending',
            role: 'member',
        });

        const looksLikeEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

        const customerId = await stripeSvc.ensureCustomer({
            email:
                input.userId && looksLikeEmail(input.userId)
                    ? input.userId
                    : undefined,
            name:
                input.userId && !looksLikeEmail(input.userId)
                    ? input.userId
                    : undefined,
            metadata: { householdId, memberId: member._id.toString() },
        });

        member.stripeCustomerId = customerId;

        await member.save();

        return {
            id: member._id.toString(),
            householdId,
            userId: member.userId,
            status: member.status as any,
            role: member.role as any,
            createdAt: member.createdAt,
        };
    }
}
