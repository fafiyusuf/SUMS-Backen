import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import validate from '../../middleware/validate';
import incidentController from './incident.controller';
import {
    getAllIncidentsSchema,
    getIncidentSchema,
    reportIncidentSchema,
    updateIncidentStatusSchema
} from './incident.schema';

const router: express.IRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Incidents
 *   description: Hazard and issue reporting API
 */

/**
 * @swagger
 * /incidents:
 *   post:
 *     summary: Report a new incident
 *     tags: [Incidents]
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
 *               - type
 *               - severity
 *               - description
 *             properties:
 *               busId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *               severity:
 *                 type: string
 *               description:
 *                 type: string
 *               reportedBy:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Incident reported
 *       400:
 *         description: Validation error
 */

router.post('/', verifyToken, validate(reportIncidentSchema), incidentController.reportIncident);

/**
 * @swagger
 * /incidents/{id}:
 *   get:
 *     summary: Get an incident by ID
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Incident ID
 *     responses:
 *       200:
 *         description: Incident details
 *       404:
 *         description: Incident not found
 */

router.get('/:id', verifyToken, validate(getIncidentSchema), incidentController.getIncident);

/**
 * @swagger
 * /incidents:
 *   get:
 *     summary: Get all incidents
 *     tags: [Incidents]
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
 *         description: Filter by status
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *         description: Filter by severity
 *     responses:
 *       200:
 *         description: List of incidents
 */

router.get('/', verifyToken, validate(getAllIncidentsSchema), incidentController.getAllIncidents);

/**
 * @swagger
 * /incidents/{id}/status:
 *   put:
 *     summary: Update an incident's status
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Incident ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Incident status updated
 *       404:
 *         description: Incident not found
 */

router.put('/:id/status', verifyToken, validate(updateIncidentStatusSchema), incidentController.updateIncidentStatus);

export default router;
