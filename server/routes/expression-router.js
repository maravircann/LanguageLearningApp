import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/expressions', middleware.authMiddleware, controllers.expressions.getExpressionsByLessonId);

export default router;
