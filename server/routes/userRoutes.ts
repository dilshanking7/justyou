import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { uploadAvatar } from '../middleware/uploadMiddleware';
import { UpdateProfileSchema, UpdateSettingsSchema, UpdateStatusSchema } from '../types';

const router = Router();

// Profile Endpoints
router.get('/profile', authenticate as any, UserController.getMe as any);
router.patch('/profile', authenticate as any, validateBody(UpdateProfileSchema), UserController.updateMe as any);
router.post('/profile/avatar', authenticate as any, uploadAvatar.single('avatar'), UserController.uploadAvatar as any);
router.patch('/profile/status', authenticate as any, validateBody(UpdateStatusSchema), UserController.updateStatus as any);

// Legacy /me aliases
router.get('/me', authenticate as any, UserController.getMe as any);
router.patch('/me', authenticate as any, validateBody(UpdateProfileSchema), UserController.updateMe as any);
router.get('/me/settings', authenticate as any, UserController.getSettings as any);
router.patch('/me/settings', authenticate as any, validateBody(UpdateSettingsSchema), UserController.updateSettings as any);

// Settings Endpoints
router.get('/settings', authenticate as any, UserController.getSettings as any);
router.patch('/settings', authenticate as any, validateBody(UpdateSettingsSchema), UserController.updateSettings as any);

// Notifications Endpoint
router.get('/notifications', authenticate as any, UserController.getNotifications as any);

// Reference Metadata Endpoint
router.get('/metadata', UserController.getMetadata as any);

export default router;
