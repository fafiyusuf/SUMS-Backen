import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import validate from '../../middleware/validate';
import stopController from './stop.controller';
import {
    createStopSchema,
    getStopSchema,
    updateStopSchema
} from './stop.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stops
 *   description: Route stops management API
 */

/**
 * @swagger
 * /stops:
 *   get:
 *     summary: Get all stops
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stops
 */

router.get('/', verifyToken, stopController.getAllStops);

/**
 * @swagger
 * /stops/{id}:
 *   get:
 *     summary: Get a stop by ID
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Stop ID
 *     responses:
 *       200:
 *         description: Stop details
 *       404:
 *         description: Stop not found
 */
router.get('/:id', verifyToken, validate(getStopSchema), stopController.getStop);

/**
 * @swagger
 * /stops:
 *   post:
 *     summary: Create a new stop
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - routeId
 *               - latitude
 *               - longitude
 *               - sequenceNumber
 *             properties:
 *               name:
 *                 type: string
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               sequenceNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Stop created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', verifyToken, requireRole('admin'), validate(createStopSchema), stopController.createStop);

/**
 * @swagger
 * /stops/{id}:
 *   put:
 *     summary: Update a stop
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Stop ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               sequenceNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stop updated successfully
 *       404:
 *         description: Stop not found
 */
router.put('/:id', verifyToken, requireRole('admin'), validate(updateStopSchema), stopController.updateStop);

export default router;
