import { guardCreateHouseholdBody } from '../guards/houseHoldsGuard';
import { HouseholdService } from '../services/HouseholdService';
import type { Request, Response } from 'express';

export class HouseholdController {
    constructor(private readonly service = new HouseholdService()) {}

    create = async (request: Request, response: Response) => {
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
}
