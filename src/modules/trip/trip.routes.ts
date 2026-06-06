import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import validate from '../../middleware/validate';
import tripController from './trip.controller';
import {
    cancelTripSchema,
    completeTripSchema,
    createTripSchema,
    getAllTripsSchema,
    getPassengerHistorySchema,
    getTripSchema,
    getUserTripsSchema,
    simulateTapInSchema,
    simulateTapOutSchema
} from './trip.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Journey and trip management API
 */

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip (Boarding)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - busId
 *               - routeId
 *               - startStopId
 *               - fare
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               busId:
 *                 type: string
 *                 format: uuid
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               startStopId:
 *                 type: string
 *                 format: uuid
 *               endStopId:
 *                 type: string
 *                 format: uuid
 *               fare:
 *                 type: number
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Validation error
 */

router.post('/', verifyToken, validate(createTripSchema), tripController.createTrip);

/**
 * @swagger
 * /trips/history/passenger:
 *   get:
 *     summary: Get passenger's trip history
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of trips
 */

router.get('/history/passenger', verifyToken, requireRole('passenger'), validate(getPassengerHistorySchema), tripController.getPassengerHistory);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get trip details by ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip details
 *       404:
 *         description: Trip not found
 */

router.get('/:id', verifyToken, validate(getTripSchema), tripController.getTrip);

/**
 * @swagger
 * /trips/user/{userId}:
 *   get:
 *     summary: Get trips by specific user (Admin)
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
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of user trips
 */

router.get('/user/:userId', verifyToken, requireRole('admin'), validate(getUserTripsSchema), tripController.getUserTrips);

/**
 * @swagger
 * /trips/{id}/complete:
 *   put:
 *     summary: Complete a trip (Deboarding)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endStopId
 *             properties:
 *               endStopId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Trip completed
 *       404:
 *         description: Trip not found
 */

router.put('/:id/complete', verifyToken, validate(completeTripSchema), tripController.completeTrip);

/**
 * @swagger
 * /trips/{id}/cancel:
 *   put:
 *     summary: Cancel an ongoing trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip canceled
 *       404:
 *         description: Trip not found
 */

router.put('/:id/cancel', verifyToken, validate(cancelTripSchema), tripController.cancelTrip);

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Get all trips (Admin)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of all global trips
 */

router.get('/', verifyToken, requireRole('admin'), validate(getAllTripsSchema), tripController.getAllTrips);

// --- Simulator Endpoints ---
/**
 * @swagger
 * /trips/simulate/tap-in:
 *   post:
 *     summary: Simulate Tap In (create ongoing trip)
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *               - busId
 *               - routeId
 *               - startStopId
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: Smart card identifier (SmartCard.cardId)
 *               busId:
 *                 type: string
 *                 format: uuid
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               startStopId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Tap In successful (ongoing trip created)
 *       400:
 *         description: Validation or business rule failure
 */
router.post('/simulate/tap-in', validate(simulateTapInSchema), tripController.simulateTapIn);

/**
 * @swagger
 * /trips/simulate/tap-out:
 *   post:
 *     summary: Simulate Tap Out (complete trip and deduct fare)
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *               - busId
 *               - routeId
 *               - endStopId
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: Smart card identifier (SmartCard.cardId)
 *               busId:
 *                 type: string
 *                 format: uuid
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               endStopId:
 *                 type: string
 *                 format: uuid
 *               fare:
 *                 type: number
 *                 description: Optional fare to charge (defaults to 15)
 *     responses:
 *       200:
 *         description: Tap Out successful (trip completed)
 *       400:
 *         description: Validation or business rule failure
 */
router.post('/simulate/tap-out', validate(simulateTapOutSchema), tripController.simulateTapOut);

export default router;
