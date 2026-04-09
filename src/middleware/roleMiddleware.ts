import { NextFunction, Response } from 'express';
import logger from '../utils/logger';
import { AuthRequest } from './authMiddleware';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Access denied for user ${req.user.userId} with role ${req.user.role}`);
        res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions'
        });
        return;
      }

      next();
    } catch (error) {
      logger.error(`Role check error: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

export default requireRole;
