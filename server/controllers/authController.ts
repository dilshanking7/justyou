import { Response } from 'express';
import { AuthService } from '../services/authService';
import { getClientMetadata } from '../utils/geo';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  static async guestLogin(req: AuthenticatedRequest, res: Response) {
    try {
      const meta = getClientMetadata(req);
      const result = await AuthService.guestLogin({
        ...meta,
        nickname: req.body?.nickname,
      });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Guest login failed' });
    }
  }

  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const meta = getClientMetadata(req);
      const result = await AuthService.register(req.body, meta);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const meta = getClientMetadata(req);
      const result = await AuthService.login(req.body, meta);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Login failed' });
    }
  }

  static async googleLogin(req: AuthenticatedRequest, res: Response) {
    try {
      const meta = getClientMetadata(req);
      const result = await AuthService.googleLoginPrepared(req.body.googleToken, meta);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Google Login failed' });
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const refreshToken = req.body?.refreshToken;
      await AuthService.logout(refreshToken);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  static async refreshToken(req: AuthenticatedRequest, res: Response) {
    try {
      const refreshToken = req.body?.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }
      const newTokens = await AuthService.refreshTokens(refreshToken);
      res.json(newTokens);
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Token refresh failed' });
    }
  }
}
