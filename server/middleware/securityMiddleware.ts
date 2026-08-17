import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Global Helmet Security Headers
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disabled for Vite development asset injection
  crossOriginEmbedderPolicy: false,
});

// General API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again after 15 minutes.',
  },
});

// Strict Auth Rate Limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Auth Attempts',
    message: 'Too many authentication attempts. Please slow down.',
  },
});

// Input Sanitization Middleware (XSS & Injection Protection)
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  next();
}

function sanitizeObject(obj: Record<string, any>) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      // Basic XSS tag stripping
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// CSRF Defense Check Middleware
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Exclude safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Validate presence of CSRF Header or standard custom client header
  const customHeader = req.headers['x-requested-with'] || req.headers['x-csrf-token'];
  if (!customHeader && process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'CSRF Validation Failed',
      message: 'Missing security validation headers.',
    });
  }

  next();
}

// Request Logger
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && !req.path.includes('/health')) {
      console.log(`[HTTP] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
}
