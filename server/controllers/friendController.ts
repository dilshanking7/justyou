import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { db } from '../database/db';

export class FriendController {
  static async sendRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { targetUserId } = req.body;
      if (!targetUserId) return res.status(400).json({ error: 'Target user ID is required' });

      const result = await db.friendRequests.send(req.user.id, targetUserId);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to send friend request' });
    }
  }

  static async getRequests(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const requests = await db.friendRequests.findPendingByUserId(req.user.id);
      return res.json({ success: true, requests });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch friend requests' });
    }
  }

  static async acceptRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { requestId } = req.params;
      const result = await db.friendRequests.accept(requestId, req.user.id);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to accept friend request' });
    }
  }

  static async rejectRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { requestId } = req.params;
      const result = await db.friendRequests.reject(requestId, req.user.id);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to reject friend request' });
    }
  }

  static async getFriends(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const friends = await db.friendships.getUserFriends(req.user.id);
      return res.json({ success: true, friends });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch friends' });
    }
  }

  static async removeFriend(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { friendId } = req.params;
      const result = await db.friendships.removeFriend(req.user.id, friendId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to remove friend' });
    }
  }

  static async getStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { targetUserId } = req.params;
      const status = await db.friendRequests.findStatus(req.user.id, targetUserId);
      return res.json({ success: true, status });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to get friendship status' });
    }
  }
}
