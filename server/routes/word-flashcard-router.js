import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/flashcard/:lesson_id/words', middleware.authMiddleware, controllers.wordFlashcards.getWordsForFlashcard);

export default router;
