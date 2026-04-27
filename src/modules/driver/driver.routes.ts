import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import driverController from './driver.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: Driver actions and trip management API
 */

/**
 * @swagger
 * /driver/trip/start:
 *   post:
 *     summary: Start a new trip as a driver
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip started
 *       400:
 *         description: Trip already in progress
 */
router.post('/trip/start', verifyToken, driverController.startTrip);

/**
 * @swagger
 * /driver/trip/end:
 *   put:
 *     summary: End current trip
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip ended
 *       404:
 *         description: No active trip
 */
router.put('/trip/end', verifyToken, driverController.endTrip);

/**
 * @swagger
 * /driver/trip/current:
 *   get:
 *     summary: Get currently active trip
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current trip details
 *       404:
 *         description: No active trip
 */
router.get('/trip/current', verifyToken, driverController.getCurrentTrip);

/**
 * @swagger
 * /driver/route:
 *   get:
 *     summary: Get assigned route for the driver
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned route details
 *       404:
 *         description: No route assigned
 */
router.get('/route', verifyToken, driverController.getAssignedRoute);

/**
 * @swagger
 * /driver/trip/history:
 *   get:
 *     summary: Get past trips history for the driver
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past trips
 */
router.get('/trip/history', verifyToken, driverController.getHistory);

export default router;
