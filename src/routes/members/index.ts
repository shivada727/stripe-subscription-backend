import { MemberSubscriptionController } from '../../controllers/MemberSubscriptionController';
import { MemberPaymentController } from '../../controllers/MemberPaymentController';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { Router } from 'express';

export const members = Router();

const payController = new MemberPaymentController();
const subController = new MemberSubscriptionController();

members.post(
    '/members/:id/setup-intent',
    asyncHandler(payController.createSetupIntent.bind(payController))
);
members.post(
    '/members/:id/subscribe',
    asyncHandler(subController.subscribe.bind(subController))
);
members.post(
    '/members/:id/cancel',
    asyncHandler(subController.cancel.bind(subController))
);

export default members;
