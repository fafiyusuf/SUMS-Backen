import express, { NextFunction, Request, Response } from 'express';
import authController from './auth.controller';
import verifyToken from '@/middleware/authMiddleware';
import { authLimiter } from '@/middleware/rateLimiter';
import requireRole from '@/middleware/roleMiddleware';
import { validate } from '@/middleware/validate';
import { registerSchema, loginSchema, createDriverSchema } from './auth.schema';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next)
);

router.post('/create-driver', verifyToken, requireRole('admin'), authLimiter, validate(createDriverSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.createDriver(req, res, next)
);

router.post('/login/passenger', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.loginPassenger(req, res, next)
);

router.post('/login/driver', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.loginDriver(req, res, next)
);

router.post('/login/admin', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.loginAdmin(req, res, next)
);

router.post('/refresh-token', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  authController.refreshToken(req, res, next)
);

router.post('/logout', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req, res, next)
);

export default router;
