import express from 'express';
import busController from './bus.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  createBusSchema,
  updateBusSchema,
  getBusSchema,
  getAllBusesSchema,
  deleteBusSchema
} from './bus.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: Bus management API
 */

/**
 * @swagger
 * /buses:
 *   post:
 *     summary: Create a new bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - capacity
 *             properties:
 *               plateNumber:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               driverId:
 *                 type: string
 *                 format: uuid
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       400:
 *         description: Validation error
 */

router.post('/', verifyToken, requireRole('admin'), validate(createBusSchema), busController.createBus);

/**
 * @swagger
 * /buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
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
 *         description: List of buses
 */
router.get('/', validate(getAllBusesSchema), busController.getAllBuses);

/**
 * @swagger
 * /buses/{id}:
 *   get:
 *     summary: Get a bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *     responses:
 *       200:
 *         description: Bus details
 *       404:
 *         description: Bus not found
 */
router.get('/:id', validate(getBusSchema), busController.getBus);

/**
 * @swagger
 * /buses/{id}:
 *   put:
 *     summary: Update a bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plateNumber:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               driverId:
 *                 type: string
 *                 format: uuid
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       404:
 *         description: Bus not found
 */
router.put('/:id', verifyToken, requireRole('admin', 'driver'), validate(updateBusSchema), busController.updateBus);

/**
 * @swagger
 * /buses/{id}:
 *   delete:
 *     summary: Delete a bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Bus ID
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *       404:
 *         description: Bus not found
 */
router.delete('/:id', verifyToken, requireRole('admin'), validate(deleteBusSchema), busController.deleteBus);

export default router;
