import { WebhookController } from '../../controllers/WebhookController';
import { stripeRawBody } from '../../middlewares/stripeRawBody';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { Router } from 'express';

export const router = Router();

const controller = new WebhookController();

router.post(
    '/webhooks',
    stripeRawBody,
    asyncHandler(controller.handleStripe.bind(controller))
);

export default router;
