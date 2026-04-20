import express from 'express';
import gpsController from './gps.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  recordGPSSchema,
  getLatestGPSSchema,
  getGPSTrackSchema
} from './gps.schema';

const router = express.Router();

router.post('/record', verifyToken, requireRole('driver'), validate(recordGPSSchema), gpsController.recordGPSData);

router.get('/latest/:busId', validate(getLatestGPSSchema), gpsController.getLatestGPSData);

router.get('/track/:busId', validate(getGPSTrackSchema), gpsController.getGPSTrack);

export default router;
