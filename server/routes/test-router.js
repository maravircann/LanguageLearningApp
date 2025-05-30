import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/tests', middleware.authMiddleware, controllers.tests.getAllTests);
router.get('/tests/:id', middleware.authMiddleware, controllers.tests.getTestById);
router.put('/tests/:id/complete', middleware.authMiddleware, controllers.tests.completeTest);

export default router;
