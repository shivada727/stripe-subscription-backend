import { MemberController } from '../../controllers/MemberController';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { Router } from 'express';

export const members = Router();

const controller = new MemberController();

members.get(
    '/members/:id',
    asyncHandler(controller.getOneMember.bind(controller))
);

export default members;
