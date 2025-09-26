import { Request, Response } from 'express';
import { Member } from '../models/members';

export class MemberController {
    public async getOneMember(request: Request, response: Response) {
        const { id } = request.params;

        const document = await Member.findById(id).lean();

        if (!document)
            return response.status(404).json({ error: 'member_not_found' });

        return response.json({
            id: String(document._id),
            householdId: String(document.householdId),
            userId: document.userId ?? null,
            status: document.status,
            role: document.role,
            stripeCustomerId: document.stripeCustomerId ?? null,
            stripeSubscriptionId: document.stripeSubscriptionId ?? null,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }
}
