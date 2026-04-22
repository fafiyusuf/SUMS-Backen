import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error}`);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export default verifyToken;
