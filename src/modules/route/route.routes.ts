import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import validate from '../../middleware/validate';
import routeController from './route.controller';
import {
    createRouteSchema,
    deleteRouteSchema,
    getAllRoutesSchema,
    getRouteSchema,
    updateRouteSchema
} from './route.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Route management API
 */

/**
 * @swagger
 * /routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
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
 *               - startPoint
 *               - endPoint
 *               - distance
 *               - estimatedDuration
 *             properties:
 *               name:
 *                 type: string
 *               startPoint:
 *                 type: string
 *               endPoint:
 *                 type: string
 *               distance:
 *                 type: number
 *               estimatedDuration:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Validation error
 */

router.post('/', verifyToken, requireRole('admin'), validate(createRouteSchema), routeController.createRoute);

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all routes
 *     tags: [Routes]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of routes
 */
router.get('/', verifyToken, validate(getAllRoutesSchema), routeController.getAllRoutes);

/**
 * @swagger
 * /routes/{routeId}:
 *   get:
 *     summary: Get a route by ID
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route details
 *       404:
 *         description: Route not found
 */
router.get('/:routeId', verifyToken, validate(getRouteSchema), routeController.getRoute);

/**
 * @swagger
 * /routes/{routeId}/path:
 *   get:
 *     summary: Get route path coordinates
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route path retrieved
 *       404:
 *         description: Route not found
 */
router.get('/:routeId/path', verifyToken, routeController.getRoutePath);

/**
 * @swagger
 * /routes/{routeId}:
 *   put:
 *     summary: Update a route
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startPoint:
 *                 type: string
 *               endPoint:
 *                 type: string
 *               distance:
 *                 type: number
 *               estimatedDuration:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       404:
 *         description: Route not found
 */
router.put('/:routeId', verifyToken, requireRole('admin'), validate(updateRouteSchema), routeController.updateRoute);

/**
 * @swagger
 * /routes/{routeId}:
 *   delete:
 *     summary: Delete a route
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Route ID
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 */
router.delete('/:routeId', verifyToken, requireRole('admin'), validate(deleteRouteSchema), routeController.deleteRoute);

export default router;
