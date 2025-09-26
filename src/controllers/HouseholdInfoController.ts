import { toStatusMap, computeSeats } from '../utils/members';
import { HttpStatus } from '../domain/httpStatuses';
import { Household } from '../models/households';
import { Request, Response } from 'express';
import { Member } from '../models/members';

export class HouseholdInfoController {
    public async getHousehold(request: Request, response: Response) {
        const { id } = request.params;

        const household = await Household.findById(id).lean();
        if (!household) {
            const error: any = new Error('household_not_found');
            error.status = HttpStatus.NOT_FOUND;
            throw error;
        }

        const counts = await Member.aggregate([
            { $match: { householdId: household._id } },
            { $group: { _id: '$status', n: { $sum: 1 } } },
        ]);

        const byStatus = toStatusMap(counts);
        const seats = computeSeats(household.capacity, byStatus);

        return response.status(HttpStatus.OK).json({
            id: String(household._id),
            kind: household.kind,
            capacity: household.capacity,
            postalCode: household.postalCode,
            anchorAt: household.anchorAt,
            priceId: household.priceId,
            createdAt: household.createdAt,
            updatedAt: household.updatedAt,
            seats,
        });
    }
}
