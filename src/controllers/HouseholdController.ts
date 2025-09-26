import { guardCreateHouseholdBody } from '../guards/houseHoldsGuard';
import { HouseholdService } from '../services/HouseholdService';
import { guardJoinHouseholdBody } from '../guards/membersGuard';
import { HttpStatus } from '../domain/httpStatuses';
import { Request, Response } from 'express';

export class HouseholdController {
    constructor(private readonly service = new HouseholdService()) {}

    public async createPlan(request: Request, response: Response) {
        const input = guardCreateHouseholdBody(request.body);
        const payload = await this.service.createPlan(input);

        return response.status(HttpStatus.CREATED).json(payload);
    }

    public async joinPlan(request: Request, response: Response) {
        const { id } = request.params;
        const input = guardJoinHouseholdBody(request.body);
        const payload = await this.service.joinPlan(id, input);
        
        return response.status(HttpStatus.CREATED).json(payload);
    }
}
