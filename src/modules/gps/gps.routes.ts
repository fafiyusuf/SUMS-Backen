import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import validate from '../../middleware/validate';
import gpsController from './gps.controller';
import {
    getGPSTrackSchema,
    getLatestGPSSchema,
    recordGPSSchema
} from './gps.schema';

const router: express.IRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: GPS
 *   description: Real-time bus tracking and location API
 */

/**
 * @swagger
 * /gps/record:
 *   post:
 *     summary: Record GPS data (Driver)
 *     tags: [GPS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - busId
 *               - latitude
 *               - longitude
 *             properties:
 *               busId:
 *                 type: string
 *                 format: uuid
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               accuracy:
 *                 type: number
 *               speed:
 *                 type: number
 *               heading:
 *                 type: number
 *     responses:
 *       201:
 *         description: GPS data recorded successfully
 *       400:
 *         description: Validation error
 */

router.post('/record', verifyToken, requireRole('driver'), validate(recordGPSSchema), gpsController.recordGPSData);

/**
 * @swagger
 * /gps/latest/{busId}:
 *   get:
 *     summary: Get latest known location of a bus
 *     tags: [GPS]
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *     responses:
 *       200:
 *         description: Latest GPS coordinate
 *       404:
 *         description: No GPS data found for this bus
 */

router.get('/latest/:busId', validate(getLatestGPSSchema), gpsController.getLatestGPSData);

/**
 * @swagger
 * /gps/track/{busId}:
 *   get:
 *     summary: Get historical track of a bus
 *     tags: [GPS]
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *       - in: query
 *         name: minutes
 *         schema:
 *           type: integer
 *           default: 60
 *         description: Historical window in minutes
 *     responses:
 *       200:
 *         description: List of GPS coordinates
 */

router.get('/track/:busId', validate(getGPSTrackSchema), gpsController.getGPSTrack);

export default router;
