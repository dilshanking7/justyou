import { Router } from 'express';
import { AiDetectionController } from '../controllers/aiDetectionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/detect', authenticate, AiDetectionController.detectCameraFrame);
router.get('/history', authenticate, AiDetectionController.getDetectionHistory);
router.post('/translate', authenticate, AiDetectionController.translateText);

export default router;
