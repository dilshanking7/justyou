import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { SendMessageSchema } from '../types';

const router = Router();

router.post('/send', authenticate, validateBody(SendMessageSchema), MessageController.sendMessage);
router.get('/recent', authenticate, MessageController.getRecentChats);
router.get('/conversation/:targetUserId', authenticate, MessageController.getConversation);

export default router;
