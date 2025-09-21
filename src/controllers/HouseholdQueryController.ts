import type { Request, Response } from 'express';
import { Household } from '../models/households';
import { Member } from '../models/members';

export class HouseholdQueryController {
    getOneMember = async (request: Request, response: Response) => {
        const { id } = request.params;

        const household = await Household.findById(id).lean();

        if (!household)
            return response.status(404).json({ error: 'household_not_found' });

        const counts = await Member.aggregate([
            { $match: { householdId: household._id } },
            { $group: { _id: '$status', n: { $sum: 1 } } },
        ]);

        const byStatus: Record<string, number> = {};

        for (const count of counts) byStatus[count._id] = count.n;

        response.json({
            id: String(household._id),
            kind: household.kind,
            capacity: household.capacity,
            postalCode: household.postalCode,
            anchorAt: household.anchorAt,
            priceId: household.priceId,
            createdAt: household.createdAt,
            updatedAt: household.updatedAt,
            seats: {
                used:
                    (byStatus.pending ?? 0) +
                    (byStatus.active ?? 0) +
                    (byStatus.past_due ?? 0) +
                    (byStatus.paused ?? 0),
                free: Math.max(
                    0,
                    household.capacity -
                        ((byStatus.pending ?? 0) +
                            (byStatus.active ?? 0) +
                            (byStatus.past_due ?? 0) +
                            (byStatus.paused ?? 0))
                ),
                byStatus,
            },
        });
    };
}
