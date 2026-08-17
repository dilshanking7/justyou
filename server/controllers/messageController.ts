import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { db } from '../database/db';

export class MessageController {
  static async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { receiverId, channelId, content, mediaUrl } = req.body;
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Message content cannot be empty' });
      }

      const message = await db.messages.create({
        senderId: req.user.id,
        receiverId,
        channelId,
        content: content.trim(),
        mediaUrl,
      });

      return res.status(201).json({ success: true, message });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to send message' });
    }
  }

  static async getConversation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { targetUserId } = req.params;
      const messages = await db.messages.getConversation(req.user.id, targetUserId);
      return res.json({ success: true, messages });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  static async getRecentChats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const chats = await db.messages.getRecentChats(req.user.id);
      return res.json({ success: true, chats });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch recent chats' });
    }
  }
}
