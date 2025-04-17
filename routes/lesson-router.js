import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

// protejează ambele rute cu JWT middleware
router.get('/lessons', middleware.authMiddleware, controllers.lessons.getAllLessons);
router.get('/lessons/:id', middleware.authMiddleware, controllers.lessons.getLessonById);

export default router;
