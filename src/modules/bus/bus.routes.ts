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

router.post('/', verifyToken, requireRole('admin'), validate(createBusSchema), busController.createBus);

router.get('/', validate(getAllBusesSchema), busController.getAllBuses);

router.get('/:id', validate(getBusSchema), busController.getBus);

router.put('/:id', verifyToken, requireRole('admin', 'driver'), validate(updateBusSchema), busController.updateBus);

router.delete('/:id', verifyToken, requireRole('admin'), validate(deleteBusSchema), busController.deleteBus);

export default router;
