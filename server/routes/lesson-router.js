import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();


router.get('/lessons', middleware.authMiddleware, controllers.lessons.getAllLessons);
router.get('/lessons/:id', middleware.authMiddleware, controllers.lessons.getLessonById);
router.put('/lessons/:id/complete', middleware.authMiddleware, controllers.lessons.completeLesson);
export default router;
