import { Response } from 'express';
import { UserService } from '../services/userService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class UserController {
  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data = await UserService.getProfile(req.user.id);
      res.json(data);
    } catch (err: any) {
      res.status(404).json({ error: err.message || 'User profile not found' });
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const result = await UserService.updateProfile(req.user.id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Profile update failed' });
    }
  }

  static async getSettings(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const settings = await UserService.getSettings(req.user.id);
      res.json({ settings });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch settings' });
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const settings = await UserService.updateSettings(req.user.id, req.body);
      res.json({ settings });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Settings update failed' });
    }
  }

  static async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const notifications = await UserService.getNotifications(req.user.id);
      res.json({ notifications });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch notifications' });
    }
  }

  static async uploadAvatar(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }
      const uploadResult = await UserService.uploadAvatar(req.user.id, req.file);
      res.json({ success: true, avatarUrl: uploadResult.url, file: uploadResult });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Avatar upload failed' });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { status } = req.body;
      const updatedUser = await UserService.updateOnlineStatus(req.user.id, status);
      res.json({ user: updatedUser });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Status update failed' });
    }
  }

  static async getMetadata(_req: AuthenticatedRequest, res: Response) {
    try {
      const data = await UserService.getMetadata();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch metadata' });
    }
  }
}
