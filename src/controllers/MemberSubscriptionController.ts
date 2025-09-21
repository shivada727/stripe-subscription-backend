import { MemberSubscriptionService } from '../services/MemberSubscriptionService';
import type { Request, Response } from 'express';

const service = new MemberSubscriptionService();

export class MemberSubscriptionController {
    subscribe = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const payload = await service.subscribe(id);

            return response.status(201).json(payload);
        } catch (error: any) {
            const message = String(error?.message || '');

            const code =
                message === 'member_not_found'
                    ? 404
                    : message === 'member_missing_customer'
                    ? 409
                    : message === 'household_not_found'
                    ? 404
                    : message === 'missing_payment_method'
                    ? 409
                    : 500;

            if (code !== 500)
                return response.status(code).json({ error: message });

            console.error('[MemberSubscriptionController.subscribe]', error);

            return response.status(500).json({ error: 'internal_error' });
        }
    };
    cancel = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const payload = await service.cancel(id);

            return response.status(200).json(payload);
        } catch (error: any) {
            const message = String(error?.message || '');
            
            const code =
                message === 'member_not_found'
                    ? 404
                    : message === 'member_not_subscribed'
                    ? 409
                    : 500;

            if (code !== 500) return response.status(code).json({ error: message });

            console.error('[MemberSubscriptionController.cancel]', error);

            return response.status(500).json({ error: 'internal_error' });
        }
    };
}
