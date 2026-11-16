import express from 'express';
import { addReview, getResourceReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:resourceId', getResourceReviews);
router.post('/:resourceId', protect, addReview);

export default router;
