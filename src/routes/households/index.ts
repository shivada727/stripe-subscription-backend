import { HouseholdController } from '../../controllers/HouseholdController';
import { Router } from 'express';

export const households = Router();

const controller = new HouseholdController();

households.post('/households', controller.createPlan);
households.post('/households/:id/join', controller.joinPlan);

export default households;
