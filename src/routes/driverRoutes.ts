import express from 'express';
import tripController from '../controllers/tripController';
import verifyToken from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DriverTripStartResponse:
 *       type: object
 *       properties:
 *         busId:
 *           type: string
 *           format: uuid
 *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
 *         routeId:
 *           type: string
 *           format: uuid
 *           example: d1e2f3a4-0000-1111-2222-333344445555
 *         status:
 *           type: string
 *           example: active
 *         startTime:
 *           type: string
 *           format: date-time
 *     DriverTripEndResponse:
 *       type: object
 *       properties:
 *         busId:
 *           type: string
 *           format: uuid
 *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
 *         status:
 *           type: string
 *           example: inactive
 *         endTime:
 *           type: string
 *           format: date-time
 *     DriverCurrentTrip:
 *       type: object
 *       properties:
 *         busId:
 *           type: string
 *           format: uuid
 *           example: 1a2b3c4d-5678-90ab-cdef-1234567890ab
 *         routeId:
 *           type: string
 *           format: uuid
 *           example: d1e2f3a4-0000-1111-2222-333344445555
 *         status:
 *           type: string
 *           example: active
 */

/**
 * @swagger
 * /driver/trip/start:
 *   post:
 *     summary: Start a driver trip (sets bus status to active)
 *     tags: [Driver - Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver trip started successfully
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
 *                   example: Driver trip started
 *                 data:
 *                   $ref: '#/components/schemas/DriverTripStartResponse'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: No bus assigned to this driver
 */
router.post('/trip/start', verifyToken, (req, res, next) =>
    tripController.startDriverTrip(req, res, next)
);

/**
 * @swagger
 * /driver/trip/end:
 *   put:
 *     summary: End a driver trip (sets bus status to inactive)
 *     tags: [Driver - Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver trip ended successfully
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
 *                   example: Driver trip ended
 *                 data:
 *                   $ref: '#/components/schemas/DriverTripEndResponse'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: No bus assigned to this driver
 */
router.put('/trip/end', verifyToken, (req, res, next) =>
    tripController.endDriverTrip(req, res, next)
);

/**
 * @swagger
 * /driver/trip/current:
 *   get:
 *     summary: Get the driver's current active trip
 *     tags: [Driver - Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current driver trip retrieved successfully
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
 *                   example: Current driver trip retrieved
 *                 data:
 *                   $ref: '#/components/schemas/DriverCurrentTrip'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: No active trip found for this driver
 */
router.get('/trip/current', verifyToken, (req, res, next) =>
    tripController.getCurrentDriverTrip(req, res, next)
);

/**
 * @swagger
 * /driver/route:
 *   get:
 *     summary: Get the route assigned to the authenticated driver's bus
 *     tags: [Driver - Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned route retrieved successfully
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
 *                   example: Assigned route details retrieved
 *                 data:
 *                   type: object
 *                   description: Route object
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: No bus assignment found for this driver
 */
router.get('/route', verifyToken, (req, res, next) =>
    tripController.getAssignedRoute(req, res, next)
);

/**
 * @swagger
 * /driver/trip/history:
 *   get:
 *     summary: Get the authenticated driver's trip history
 *     tags: [Driver - Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver trip history retrieved successfully
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
 *                   example: Driver trip history retrieved
 *                 data:
 *                   type: array
 *                   items: {}
 *       401:
 *         description: Unauthorized – missing or invalid token
 */
router.get('/trip/history', verifyToken, (req, res, next) =>
    tripController.getDriverTripHistory(req, res, next)
);

export default router;
