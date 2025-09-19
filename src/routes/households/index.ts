import { HouseholdController } from '../../controllers/HouseholdController';
import { Router } from 'express';

export const households = Router();

const controller = new HouseholdController();

households.post('/households', controller.create);

export default households;
