import express from 'express';
import tripController from '../controllers/tripController';
import verifyToken from '../middleware/authMiddleware';

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
 *           example: 7c9e6679-7425-40de-944b-e07fc1f90ae7
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         busId:
 *           type: string
 *           format: uuid
 *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
 *         routeId:
 *           type: string
 *           format: uuid
 *           example: d1e2f3a4-0000-1111-2222-333344445555
 *         startStopId:
 *           type: string
 *           format: uuid
 *           example: a5f4c3b2-1234-5678-abcd-ef0123456789
 *         endStopId:
 *           type: string
 *           format: uuid
 *           example: b6a5d4c3-8765-4321-dcba-fe9876543210
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
 *           example: 12.50
 *         status:
 *           type: string
 *           enum: [ongoing, completed, cancelled]
 *           example: ongoing
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TripInput:
 *       type: object
 *       required: [userId, busId, routeId, startStopId, endStopId, startTime, fare]
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *         busId:
 *           type: string
 *           format: uuid
 *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
 *         routeId:
 *           type: string
 *           format: uuid
 *           example: d1e2f3a4-0000-1111-2222-333344445555
 *         startStopId:
 *           type: string
 *           format: uuid
 *           example: a5f4c3b2-1234-5678-abcd-ef0123456789
 *         endStopId:
 *           type: string
 *           format: uuid
 *           example: b6a5d4c3-8765-4321-dcba-fe9876543210
 *         startTime:
 *           type: string
 *           format: date-time
 *         fare:
 *           type: number
 *           format: float
 *           example: 12.50
 */

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new passenger trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripInput'
 *     responses:
 *       201:
 *         description: Trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trip created
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Unauthorized – missing or invalid token
 */
router.post('/', verifyToken, (req, res, next) =>
    tripController.createTrip(req, res, next)
);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a trip by ID
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
 *         description: UUID of the trip
 *         example: 7c9e6679-7425-40de-944b-e07fc1f90ae7
 *     responses:
 *       200:
 *         description: Trip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trip retrieved
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: Trip not found
 */
router.get('/:id', verifyToken, (req, res, next) =>
    tripController.getTrip(req, res, next)
);

/**
 * @swagger
 * /trips/user/{userId}:
 *   get:
 *     summary: Get all trips for a specific user (paginated)
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
 *         description: UUID of the user
 *         example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
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
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: User trips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trips retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     trips:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Trip'
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized – missing or invalid token
 */
router.get('/user/:userId', verifyToken, (req, res, next) =>
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the trip to complete
 *         example: 7c9e6679-7425-40de-944b-e07fc1f90ae7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [endStopId]
 *             properties:
 *               endStopId:
 *                 type: string
 *                 format: uuid
 *                 example: b6a5d4c3-8765-4321-dcba-fe9876543210
 *     responses:
 *       200:
 *         description: Trip completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trip completed
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: Trip not found
 */
router.put('/:id/complete', verifyToken, (req, res, next) =>
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the trip to cancel
 *         example: 7c9e6679-7425-40de-944b-e07fc1f90ae7
 *     responses:
 *       200:
 *         description: Trip cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trip cancelled
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: Trip not found
 */
router.put('/:id/cancel', verifyToken, (req, res, next) =>
    tripController.cancelTrip(req, res, next)
);

export default router;
