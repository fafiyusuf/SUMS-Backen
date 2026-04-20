import express from 'express';
import stopController from './stop.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  createStopSchema,
  updateStopSchema,
  getStopSchema
} from './stop.schema';

const router = express.Router();

router.get('/', verifyToken, stopController.getAllStops);

router.get('/:id', verifyToken, validate(getStopSchema), stopController.getStop);

router.post('/', verifyToken, requireRole('admin'), validate(createStopSchema), stopController.createStop);

router.put('/:id', verifyToken, requireRole('admin'), validate(updateStopSchema), stopController.updateStop);

export default router;
