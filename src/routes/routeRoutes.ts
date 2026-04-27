import express, { Request, Response, NextFunction } from 'express';
import routeController from '../controllers/routeController';
import verifyToken from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { 
    validateCreateRoute, 
    validatePagination, 
    validateUUID, 
    handleValidationErrors 
} from '../utils/validators';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Bus route management
 */

/**
 * @swagger
 * /routes:
 *   post:
 *     summary: Create a new bus route
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', verifyToken, requireRole('admin'), validateCreateRoute, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
    routeController.createRoute(req, res, next)
);

/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all bus routes
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
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by route status
 *     responses:
 *       200:
 *         description: List of all routes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     routes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Route'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, validatePagination, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
    routeController.getAllRoutes(req, res, next)
);

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
 *         description: The route ID
 *     responses:
 *       200:
 *         description: Route details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Route not found
 */
router.get('/:routeId', verifyToken, validateUUID('routeId'), handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
    routeController.getRoute(req, res, next)
);

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
 *         description: The route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Route not found
 */
router.put('/:routeId', verifyToken, requireRole('admin'), validateUUID('routeId'), validateCreateRoute, handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
    routeController.updateRoute(req, res, next)
);

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
 *         description: The route ID
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Route not found
 */
router.delete('/:routeId', verifyToken, requireRole('admin'), validateUUID('routeId'), handleValidationErrors, (req: Request, res: Response, next: NextFunction) =>
    routeController.deleteRoute(req, res, next)
);

export default router;
