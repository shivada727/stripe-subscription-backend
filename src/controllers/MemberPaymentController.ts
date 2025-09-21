import { MemberPaymentService } from '../services/MemberPaymentService';
import type { Request, Response } from 'express';

const service = new MemberPaymentService();

export class MemberPaymentController {
    createSetupIntent = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const payload = await service.createSetupIntent(id);

            return response.status(201).json(payload);
        } catch (error: any) {
            const message = String(error?.message || '');
            const code =
                message === 'member_not_found'
                    ? 404
                    : message === 'member_missing_customer'
                    ? 409
                    : 500;

            if (code !== 500)
                return response.status(code).json({ error: message });

            console.error('[MemberPaymentController.createSetupIntent]', error);

            return response.status(500).json({ error: 'internal_error' });
        }
    };
}
