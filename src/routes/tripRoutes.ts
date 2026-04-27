import express, { Request, Response, NextFunction } from 'express';
import tripController from '../controllers/tripController';
import verifyToken from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         busId:
 *           type: string
 *           format: uuid
 *         routeId:
 *           type: string
 *           format: uuid
 *         startStopId:
 *           type: string
 *           format: uuid
 *         endStopId:
 *           type: string
 *           format: uuid
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         fare:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [ongoing, completed, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new passenger trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Trip created
 */
router.post('/', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  tripController.createTrip(req, res, next)
);

/**
 * @swagger
 * /trips/all:
 *   get:
 *     summary: Get all trips (Admin view)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all trips
 */
router.get('/all', verifyToken, requireRole('admin'), (req: Request, res: Response, next: NextFunction) =>
  tripController.getAllTrips(req, res, next)
);

/**
 * @swagger
 * /trips/history:
 *   get:
 *     summary: Get current passenger's trip history
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user trips
 */
router.get('/history', verifyToken, (req: any, res: Response, next: NextFunction) =>
  tripController.getPassengerHistory(req, res, next)
);

/**
 * @swagger
 * /trips/history/{tripId}:
 *   get:
 *     summary: Get specific trip details
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Trip details
 */
router.get('/history/:id', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  tripController.getTrip(req, res, next)
);

/**
 * @swagger
 * /trips/user/{userId}:
 *   get:
 *     summary: Get all trips for a specific user (Admin)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User trips
 */
router.get('/user/:userId', verifyToken, requireRole('admin'), (req: Request, res: Response, next: NextFunction) =>
  tripController.getUserTrips(req, res, next)
);

/**
 * @swagger
 * /trips/{id}/complete:
 *   put:
 *     summary: Mark a trip as completed
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip completed
 */
router.put('/:id/complete', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  tripController.completeTrip(req, res, next)
);

/**
 * @swagger
 * /trips/{id}/cancel:
 *   put:
 *     summary: Cancel a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip cancelled
 */
router.put('/:id/cancel', verifyToken, (req: Request, res: Response, next: NextFunction) =>
  tripController.cancelTrip(req, res, next)
);

export default router;
