import { Router } from 'express';
import { PresenceController } from '../controllers/presenceController';

const router = Router();

router.get('/presence', PresenceController.getPresence);

export default router;
