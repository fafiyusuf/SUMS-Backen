import express, { NextFunction, Request, Response } from 'express';
import authController from '../controllers/authController';
import verifyToken from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';
import requireRole from '../middleware/roleMiddleware';
import { handleValidationErrors, validateCreateDriver, validateLogin, validateRegister } from '../utils/validators';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new passenger account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, password]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Passenger registered successfully
 */
router.post('/register', authLimiter, validateRegister, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next)
);

/**
 * @swagger
 * /auth/create-driver:
 *   post:
 *     summary: Create a driver account (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, password, licenseNumber]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               licenseNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       403:
 *         description: Access denied. Insufficient permissions
 */
router.post('/create-driver', verifyToken, requireRole('admin'), authLimiter, validateCreateDriver, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
  authController.createDriver(req, res, next)
);

/**
 * @swagger
 * /auth/login/passenger:
 *   post:
 *     summary: Passenger login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login/passenger', authLimiter, validateLogin, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
  authController.loginPassenger(req, res, next)
);

/**
 * @swagger
 * /auth/login/driver:
 *   post:
 *     summary: Driver login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login/driver', authLimiter, validateLogin, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
  authController.loginDriver(req, res, next)
);

/**
 * @swagger
 * /auth/login/admin:
 *   post:
 *     summary: Admin login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login/admin', authLimiter, validateLogin, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
  authController.loginAdmin(req, res, next)
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh-token', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  authController.refreshToken(req, res, next)
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req, res, next)
);

export default router;
