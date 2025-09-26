import { HouseholdController } from '../../controllers/HouseholdController';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { Router } from 'express';

export const households = Router();

const controller = new HouseholdController();

households.post(
    '/households',
    asyncHandler(controller.createPlan.bind(controller))
);
households.post(
    '/households/:id/join',
    asyncHandler(controller.joinPlan.bind(controller))
);

export default households;
