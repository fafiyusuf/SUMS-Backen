import express from 'express';
import routeController from './route.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  createRouteSchema,
  updateRouteSchema,
  getRouteSchema,
  getAllRoutesSchema,
  deleteRouteSchema
} from './route.schema';

const router = express.Router();

router.post('/', verifyToken, requireRole('admin'), validate(createRouteSchema), routeController.createRoute);

router.get('/', verifyToken, validate(getAllRoutesSchema), routeController.getAllRoutes);

router.get('/:routeId', verifyToken, validate(getRouteSchema), routeController.getRoute);

router.put('/:routeId', verifyToken, requireRole('admin'), validate(updateRouteSchema), routeController.updateRoute);

router.delete('/:routeId', verifyToken, requireRole('admin'), validate(deleteRouteSchema), routeController.deleteRoute);

export default router;
