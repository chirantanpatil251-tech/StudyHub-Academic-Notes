import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:resourceId', getComments);
router.post('/:resourceId', protect, addComment);

export default router;
