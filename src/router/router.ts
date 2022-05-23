import express from 'express';

export const router = express.Router();

import * as characterController from '../controller/character.controller';
import * as freeCompanyController from '../controller/freeCompany.controller';

router.get('/character/search', characterController.search);
router.get('/character/:id', characterController.get);
router.get('/free-company/search', freeCompanyController.search);
router.get('/free-company/:id', freeCompanyController.get);

export default router;
