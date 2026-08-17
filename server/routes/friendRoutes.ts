import { Router } from 'express';
import { FriendController } from '../controllers/friendController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { FriendRequestSchema } from '../types';

const router = Router();

router.post('/request', authenticate, validateBody(FriendRequestSchema), FriendController.sendRequest);
router.get('/requests', authenticate, FriendController.getRequests);
router.post('/request/:requestId/accept', authenticate, FriendController.acceptRequest);
router.post('/request/:requestId/reject', authenticate, FriendController.rejectRequest);
router.get('/friends', authenticate, FriendController.getFriends);
router.delete('/friends/:friendId', authenticate, FriendController.removeFriend);
router.get('/status/:targetUserId', authenticate, FriendController.getStatus);

export default router;
