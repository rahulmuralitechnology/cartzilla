import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    logger.warn('Authentication failed - no token provided');
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as any;
    next();
  } catch (err: any) {
    logger.error(`Authentication failed - invalid token: ${err.message}`);
    return res.status(403).json({ error: 'Invalid token' });
  }
};