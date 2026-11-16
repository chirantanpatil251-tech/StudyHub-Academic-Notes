import express from 'express';
import {
  getAdminStats,
  getAdminResources,
  updateResourceStatus,
  getAllUsers,
  getAdminReports,
  resolveReport,
  submitReport,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student can submit report
router.post('/report', protect, submitReport);

// Admin-only endpoints
router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/resources', protect, adminOnly, getAdminResources);
router.put('/resources/:id/status', protect, adminOnly, updateResourceStatus);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/reports', protect, adminOnly, getAdminReports);
router.put('/reports/:id', protect, adminOnly, resolveReport);

export default router;
