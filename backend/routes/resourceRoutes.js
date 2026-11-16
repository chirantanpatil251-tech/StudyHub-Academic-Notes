import express from 'express';
import {
  getResources,
  getResourceById,
  uploadResource,
  deleteResource,
  downloadResource,
  toggleBookmark,
  getBookmarks,
  getMyUploads,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getResources);
router.get('/user/bookmarks', protect, getBookmarks);
router.get('/user/uploads', protect, getMyUploads);
router.get('/:id', getResourceById);
router.post('/', protect, upload.single('file'), uploadResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/download', downloadResource);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
