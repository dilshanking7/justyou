import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateBody } from '../middleware/validateMiddleware';
import {
  RegisterSchema,
  LoginSchema,
  GuestLoginSchema,
  GoogleLoginSchema,
} from '../types';

const router = Router();

router.post('/guest', validateBody(GuestLoginSchema), AuthController.guestLogin);
router.post('/register', validateBody(RegisterSchema), AuthController.register);
router.post('/login', validateBody(LoginSchema), AuthController.login);
router.post('/google', validateBody(GoogleLoginSchema), AuthController.googleLogin);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refreshToken);

export default router;
