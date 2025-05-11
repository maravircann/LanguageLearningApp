import express from 'express';
import controllers from './controllers/index.js';

const router = express.Router();

router.get('/domains/:id', controllers.domain.getDomainById);

export default router;