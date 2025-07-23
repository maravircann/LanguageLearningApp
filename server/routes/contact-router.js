import express from 'express';
import controllers from './controllers/index.js';

const router = express.Router();

router.post('/contact', controllers.sendContactEmail.sendContactEmail);

export default router;
