import express from 'express';
import incidentController from './incident.controller';
import verifyToken from '@/middleware/authMiddleware';
import validate from '@/middleware/validate';
import {
  reportIncidentSchema,
  getIncidentSchema,
  getAllIncidentsSchema,
  updateIncidentStatusSchema
} from './incident.schema';

const router = express.Router();

router.post('/', verifyToken, validate(reportIncidentSchema), incidentController.reportIncident);

router.get('/:id', verifyToken, validate(getIncidentSchema), incidentController.getIncident);

router.get('/', verifyToken, validate(getAllIncidentsSchema), incidentController.getAllIncidents);

router.put('/:id/status', verifyToken, validate(updateIncidentStatusSchema), incidentController.updateIncidentStatus);

export default router;
