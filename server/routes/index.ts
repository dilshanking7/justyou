import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import presenceRoutes from './presenceRoutes';
import friendRoutes from './friendRoutes';
import messageRoutes from './messageRoutes';
import aiDetectionRoutes from './aiDetectionRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'justyou-backend',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/friends', friendRoutes);
router.use('/messages', messageRoutes);
router.use('/ai', aiDetectionRoutes);
router.use('/', userRoutes);
router.use('/', presenceRoutes);

export default router;
