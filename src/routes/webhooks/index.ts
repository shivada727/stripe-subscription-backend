import { WebhookController } from '../../controllers/WebhookController';
import { Router } from 'express';

const router = Router();

const controller = new WebhookController();

router.post(
    '/stripe',
    require('express').raw({ type: 'application/json' }),
    controller.handleStripe
);

export default router;
