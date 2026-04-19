import express, { Request, Response, NextFunction } from 'express';
import busController from '../controllers/busController';
import verifyToken from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: Bus fleet management
 */

/**
 * @swagger
 * /buses:
 *   post:
 *     summary: Create a new bus (Admin only)
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', verifyToken, requireRole('admin'), (req: Request, res: Response, next: NextFunction) =>
  busController.createBus(req, res, next)
);

/**
 * @swagger
 * /buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: List of all buses
 */
router.get('/', (req: Request, res: Response, next: NextFunction) =>
  busController.getAllBuses(req, res, next)
);

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
 *     responses:
 *       200:
 *         description: Bus details
 *       404:
 *         description: Bus not found
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  busController.getBus(req, res, next)
);

/**
 * @swagger
 * /buses/{id}:
 *   put:
 *     summary: Update a bus (Admin or Driver)
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
 *     responses:
 *       200:
 *         description: Bus updated successfully
 */
router.put('/:id', verifyToken, requireRole('admin', 'driver'), (req: Request, res: Response, next: NextFunction) =>
  busController.updateBus(req, res, next)
);

/**
 * @swagger
 * /buses/{id}:
 *   delete:
 *     summary: Delete a bus (Admin only)
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
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 */
router.delete('/:id', verifyToken, requireRole('admin'), (req: Request, res: Response, next: NextFunction) =>
  busController.deleteBus(req, res, next)
);

export default router;
