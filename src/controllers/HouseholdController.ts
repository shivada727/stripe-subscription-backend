import { guardCreateHouseholdBody } from '../guards/houseHoldsGuard';
import { guardJoinHouseholdBody } from '../guards/membersGuard';
import { HouseholdService } from '../services/HouseholdService';
import type { Request, Response } from 'express';

export class HouseholdController {
    constructor(private readonly service = new HouseholdService()) {}

    createPlan = async (request: Request, response: Response) => {
        try {
            const input = guardCreateHouseholdBody(request.body);

            const payload = await this.service.createPlan(input);

            return response.status(201).json(payload);
        } catch (error: any) {
            const message = String(error?.message || '');
            if (
                message.includes('kind must be') ||
                message.startsWith('address is required') ||
                message.startsWith('postalCode is required') ||
                message.startsWith('anchorAt must be')
            ) {
                return response.status(400).json({ error: message });
            }
            console.error('[HouseholdController.create] error', error);

            return response.status(500).json({ error: 'internal_error' });
        }
    };
    joinPlan = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const input = guardJoinHouseholdBody(req.body);
            const payload = await this.service.joinPlan(id, input);

            return res.status(201).json(payload);
        } catch (error: any) {
            const message = String(error?.message || '');
            
            if (
                message === 'household_not_found' ||
                message === 'address_mismatch' ||
                message === 'household_full' ||
                message.startsWith('address is required') ||
                message.startsWith('postalCode is required')
            ) {
                const code =
                    message === 'household_not_found'
                        ? 404
                        : message === 'address_mismatch'
                        ? 403
                        : message === 'household_full'
                        ? 409
                        : 400;
                return res.status(code).json({ error: message });
            }
            console.error('[HouseholdController.join] error', message);

            return res.status(500).json({ error: 'internal_error' });
        }
    };
}
