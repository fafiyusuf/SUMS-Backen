import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import analyticsController from './analytics.controller';

const router: express.IRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: System analytics and reporting API
 */

// All analytics routes are admin-only
router.use(verifyToken, requireRole('admin'));

/**
 * @swagger
 * /analytics/passengers:
 *   get:
 *     summary: Get passenger statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Passenger analytics data
 */
router.get('/passengers', analyticsController.getPassengerStats);

/**
 * @swagger
 * /analytics/peak-hours:
 *   get:
 *     summary: Get peak hours analysis
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Peak hours data
 */
router.get('/peak-hours', analyticsController.getPeakHours);

/**
 * @swagger
 * /analytics/route-efficiency:
 *   get:
 *     summary: Get route efficiency metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Route efficiency data
 */
router.get('/route-efficiency', analyticsController.getRouteEfficiency);

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard summary data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 */
router.get('/dashboard', analyticsController.getDashboardSummary);

export default router;
