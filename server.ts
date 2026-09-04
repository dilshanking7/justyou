import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server as SocketServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';

import apiRoutes from './server/routes';
import { errorHandler } from './server/middleware/errorMiddleware';
import { setupPresenceSocket } from './server/socket/presenceSocket';
import {
  securityHeaders,
  apiRateLimiter,
  sanitizeInput,
  csrfProtection,
  requestLogger,
} from './server/middleware/securityMiddleware';
import { CONFIG } from './server/config/env';
import { UPLOADS_DIR } from './server/services/storageService';

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  // Setup Socket.IO
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  setupPresenceSocket(io);

  // Security & Request Middlewares
  app.use(securityHeaders);
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);
  app.use(sanitizeInput);
  app.use(csrfProtection);

  // Serve uploads statically
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Serve public folder for static files like verification files
  app.use(express.static(path.join(process.cwd(), 'public')));

  // API Routes with Rate Limiting
  app.use('/api', apiRateLimiter, apiRoutes);

  // Vite middleware for development or static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  const PORT = CONFIG.PORT;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[justyou Server] Production architecture running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Fatal Server Error]:', err);
  process.exit(1);
});
