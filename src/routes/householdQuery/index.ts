import { Router } from 'express';
import { HouseholdQueryController } from '../../controllers/HouseholdQueryController';

const router = Router();
const controller = new HouseholdQueryController();

router.get('/households/:id', controller.getOneMember);

export default router;
