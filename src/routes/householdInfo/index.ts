import { HouseholdInfoController } from '../../controllers/HouseholdInfoController';
import { asyncHandler } from '../../middlewares/asyncHandler';
import { Router } from 'express';

const router = Router();
const controller = new HouseholdInfoController();

router.get(
    '/households/:id',
    asyncHandler(controller.getHousehold.bind(controller))
);

export default router;
