import { MemberPaymentService } from '../services/MemberPaymentService';
import { HttpStatus } from '../domain/httpStatuses';
import { Request, Response } from 'express';

export class MemberPaymentController {
    constructor(private readonly service = new MemberPaymentService()) {}
    public async createSetupIntent(request: Request, response: Response) {
        const { id } = request.params;

        if (!id) throw new Error('member_id_required');

        const payload = await this.service.createSetupIntent(id);

        return response.status(HttpStatus.CREATED).json(payload);
    }
}
