import { Request, Response } from 'express';
import { PresenceService } from '../services/presenceService';

export class PresenceController {
  static async getPresence(_req: Request, res: Response) {
    try {
      const stats = await PresenceService.getPresenceStats();
      res.json(stats);
    } catch {
      res.status(500).json({ error: 'Failed to retrieve presence metrics' });
    }
  }
}
