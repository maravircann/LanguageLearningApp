import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/words', middleware.authMiddleware, controllers.words.getWordsByLessonId);

export default router;
