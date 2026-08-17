import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { CONFIG } from '../config/env';

export interface JwtPayload {
  userId: string;
  isGuest: boolean;
  role: string;
}

export function generateTokens(payload: JwtPayload) {
  const accessOptions: SignOptions = {
    expiresIn: CONFIG.JWT_EXPIRES_IN as any,
  };

  const refreshOptions: SignOptions = {
    expiresIn: CONFIG.JWT_REFRESH_EXPIRES_IN as any,
  };

  const accessToken = jwt.sign(payload, CONFIG.JWT_SECRET as Secret, accessOptions);
  const refreshToken = jwt.sign(payload, CONFIG.JWT_REFRESH_SECRET as Secret, refreshOptions);

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, CONFIG.JWT_SECRET as Secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, CONFIG.JWT_REFRESH_SECRET as Secret) as JwtPayload;
  } catch {
    return null;
  }
}
