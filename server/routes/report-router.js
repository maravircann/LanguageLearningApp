import express from 'express';
import controllers from './controllers/index.js';
import middleware from '../middleware/index.js';

const router = express.Router();

// Rute protejate
router.get('/report/:user_id', middleware.authMiddleware, controllers.report.getReportByUserId);
router.put('/report/:user_id', middleware.authMiddleware, controllers.report.updateReport);
router.put('/report/reset/:user_id', middleware.authMiddleware, controllers.report.resetReport);
router.put('/report/test/:user_id', middleware.authMiddleware, controllers.report.updateAfterTest);
  
export default router;
 