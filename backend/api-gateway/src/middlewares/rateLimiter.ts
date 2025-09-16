import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';
import config from '../config';

export const rateLimiter = (max: number, windowMinutes: number) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    handler: (req: Request, res: Response) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
      res.status(429).json({
        error: `Too many requests, please try again after ${windowMinutes} minutes`,
      });
    },
    skip: () => config.nodeEnv === 'test',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const apiKeyRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  keyGenerator: (req: Request) => {
    // Always return a string - fall back to IP if no API key
    return (req.headers['x-api-key'] as string) ?? req.ip;
  },
  message: 'Too many requests from this API key, please try again after an hour',
});