import express from 'express';
import {
  analyzePdf,
  askPdfQuestion,
  getPresetDocuments,
  summarizeResource,
} from '../controllers/aiController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze-pdf', upload.single('file'), analyzePdf);
router.post('/ask-pdf', askPdfQuestion);
router.get('/preset-docs', getPresetDocuments);
router.get('/summarize/:resourceId', summarizeResource);

export default router;
