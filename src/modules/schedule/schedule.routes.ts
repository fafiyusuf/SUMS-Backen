import express from 'express';
import scheduleController from './schedule.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import { validate } from '@/middleware/validate';
import { createScheduleSchema, updateScheduleSchema, getRouteSchedulesSchema } from './schedule.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Schedule Management API
 */

/**
 * @swagger
 * /schedule/route/{routeId}:
 *   get:
 *     summary: Get schedules for a specific route
 *     tags: [Schedule]
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
 *         description: List of route schedules
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get('/route/:routeId', verifyToken, validate(getRouteSchedulesSchema), scheduleController.getRouteSchedules);

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Create a new schedule (Admin only)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - dayOfWeek
 *               - departureTime
 *               - arrivalTime
 *             properties:
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 *               departureTime:
 *                 type: string
 *                 example: "08:00"
 *               arrivalTime:
 *                 type: string
 *                 example: "10:30"
 *               busId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', verifyToken, requireRole('admin'), validate(createScheduleSchema), scheduleController.createSchedule);

/**
 * @swagger
 * /schedule/{scheduleId}:
 *   put:
 *     summary: Update an existing schedule (Admin only)
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeId:
 *                 type: string
 *                 format: uuid
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *               departureTime:
 *                 type: string
 *                 example: "08:00"
 *               arrivalTime:
 *                 type: string
 *                 example: "10:30"
 *               busId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Schedule not found
 */
router.put('/:scheduleId', verifyToken, requireRole('admin'), validate(updateScheduleSchema), scheduleController.updateSchedule);

export default router;
