import type { Request, Response } from 'express';
import { MemberSubscriptionService } from '../services/MemberSubscriptionService';
import { HttpStatus } from '../domain/httpStatuses';

export class MemberSubscriptionController {
    constructor(private readonly service = new MemberSubscriptionService()) {}

    public async subscribe(request: Request, response: Response) {
        const { id } = request.params;

        if (!id) {
            const error: any = new Error('member_id_required');

            error.status = HttpStatus.BAD_REQUEST;

            throw error;
        }

        const payload = await this.service.subscribe(id);

        return response.status(HttpStatus.CREATED).json(payload);
    }

    public async cancel(request: Request, response: Response) {
        const { id } = request.params;

        if (!id) {
            const error: any = new Error('member_id_required');
            error.status = HttpStatus.BAD_REQUEST;
            throw error;
        }

        const payload = await this.service.cancel(id);

        return response.status(HttpStatus.OK).json(payload);
    }
}
