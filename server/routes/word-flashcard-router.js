import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

router.get('/tests/:id/flashcards', middleware.authMiddleware, controllers.wordFlashcards.getWordsForFlashcard);

export default router;
