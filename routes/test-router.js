import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/tests', middleware.authMiddleware, controllers.tests.getAllTests);
router.get('/tests/:id', middleware.authMiddleware, controllers.tests.getTestById);

export default router;
