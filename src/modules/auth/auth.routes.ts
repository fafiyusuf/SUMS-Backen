import express, { NextFunction, Request, Response } from 'express';
import verifyToken from '../../middleware/authMiddleware';
import { authLimiter } from '../../middleware/rateLimiter';
import requireRole from '../../middleware/roleMiddleware';
import { validate } from '../../middleware/validate';
import authController from './auth.controller';
import { createDriverSchema, loginSchema, registerSchema } from './auth.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new passenger
 *     tags: [Auth]
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
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', authLimiter, validate(registerSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next)
);

/**
 * @swagger
 * /auth/create-driver:
 *   post:
 *     summary: Admin endpoint to create a new driver
 *     tags: [Auth]
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
 *                 minLength: 6
 *               licenseNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.post('/create-driver', verifyToken, requireRole('admin'), authLimiter, validate(createDriverSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.createDriver(req, res, next)
);

/**
 * @swagger
 * /auth/login/passenger:
 *   post:
 *     summary: Login for passengers
 *     tags: [Auth]
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
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login/passenger', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.loginPassenger(req, res, next)
);

/**
 * @swagger
 * /auth/login/driver:
 *   post:
 *     summary: Login for drivers
 *     tags: [Auth]
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
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials or not a driver
 */
router.post('/login/driver', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.loginDriver(req, res, next)
);

/**
 * @swagger
 * /auth/login/admin:
 *   post:
 *     summary: Login for administrators
 *     tags: [Auth]
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
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials or not an admin
 */
router.post('/login/admin', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) =>
  authController.loginAdmin(req, res, next)
);



/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req, res, next)
);

export default router;
