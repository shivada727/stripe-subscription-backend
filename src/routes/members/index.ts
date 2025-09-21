import { MemberSubscriptionController } from '../../controllers/MemberSubscriptionController';
import { MemberPaymentController } from '../../controllers/MemberPaymentController';
import { MemberController } from '../../controllers/MemberController';
import { Router } from 'express';

export const members = Router();

const payController = new MemberPaymentController();
const subController = new MemberSubscriptionController();
const memberController = new MemberController();

members.post('/members/:id/setup-intent', payController.createSetupIntent);
members.post('/members/:id/subscribe', subController.subscribe);
members.post('/members/:id/cancel', subController.cancel);
members.get('/members/:id', memberController.getOneMember);

export default members;
