import express from 'express';
import stopController from '../controllers/stopController';
import verifyToken from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Stop:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: a5f4c3b2-1234-5678-abcd-ef0123456789
 *         name:
 *           type: string
 *           example: Meskel Square
 *         routeId:
 *           type: string
 *           format: uuid
 *           example: d1e2f3a4-0000-1111-2222-333344445555
 *         latitude:
 *           type: number
 *           format: float
 *           example: 9.0107
 *         longitude:
 *           type: number
 *           format: float
 *           example: 38.7614
 *         sequenceNumber:
 *           type: integer
 *           example: 3
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     StopInput:
 *       type: object
 *       required: [name, routeId, latitude, longitude, sequenceNumber]
 *       properties:
 *         name:
 *           type: string
 *           example: Meskel Square
 *         routeId:
 *           type: string
 *           format: uuid
 *           example: d1e2f3a4-0000-1111-2222-333344445555
 *         latitude:
 *           type: number
 *           format: float
 *           example: 9.0107
 *         longitude:
 *           type: number
 *           format: float
 *           example: 38.7614
 *         sequenceNumber:
 *           type: integer
 *           example: 3
 */

/**
 * @swagger
 * /stops:
 *   get:
 *     summary: Get all bus stops
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bus stops retrieved successfully
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
 *                   example: All stops retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stop'
 *       401:
 *         description: Unauthorized – missing or invalid token
 */
router.get('/', verifyToken, (req, res, next) =>
    stopController.getAllStops(req, res, next)
);

/**
 * @swagger
 * /stops/{id}:
 *   get:
 *     summary: Get a single bus stop by ID
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
 *         description: The UUID of the stop
 *         example: a5f4c3b2-1234-5678-abcd-ef0123456789
 *     responses:
 *       200:
 *         description: Stop retrieved successfully
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
 *                   example: Stop retrieved
 *                 data:
 *                   $ref: '#/components/schemas/Stop'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: Stop not found
 */
router.get('/:id', verifyToken, (req, res, next) =>
    stopController.getStop(req, res, next)
);

/**
 * @swagger
 * /stops:
 *   post:
 *     summary: Create a new bus stop (Admin only)
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StopInput'
 *     responses:
 *       201:
 *         description: Stop created successfully
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
 *                   example: Stop created
 *                 data:
 *                   $ref: '#/components/schemas/Stop'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – admin role required
 */
router.post('/', verifyToken, requireRole('admin'), (req, res, next) =>
    stopController.createStop(req, res, next)
);

/**
 * @swagger
 * /stops/{id}:
 *   put:
 *     summary: Update a bus stop by ID (Admin only)
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
 *         description: The UUID of the stop to update
 *         example: a5f4c3b2-1234-5678-abcd-ef0123456789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StopInput'
 *     responses:
 *       200:
 *         description: Stop updated successfully
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
 *                   example: Stop updated
 *                 data:
 *                   $ref: '#/components/schemas/Stop'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – admin role required
 *       404:
 *         description: Stop not found
 */
router.put('/:id', verifyToken, requireRole('admin'), (req, res, next) =>
    stopController.updateStop(req, res, next)
);

export default router;
