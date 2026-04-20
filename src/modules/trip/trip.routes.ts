import express from 'express';
import tripController from './trip.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  createTripSchema,
  getTripSchema,
  getUserTripsSchema,
  completeTripSchema,
  cancelTripSchema,
  getPassengerHistorySchema,
  getAllTripsSchema
} from './trip.schema';

const router = express.Router();

router.post('/', verifyToken, validate(createTripSchema), tripController.createTrip);

router.get('/history/passenger', verifyToken, requireRole('passenger'), validate(getPassengerHistorySchema), tripController.getPassengerHistory);

router.get('/:id', verifyToken, validate(getTripSchema), tripController.getTrip);

router.get('/user/:userId', verifyToken, requireRole('admin'), validate(getUserTripsSchema), tripController.getUserTrips);

router.put('/:id/complete', verifyToken, validate(completeTripSchema), tripController.completeTrip);

router.put('/:id/cancel', verifyToken, validate(cancelTripSchema), tripController.cancelTrip);

router.get('/', verifyToken, requireRole('admin'), validate(getAllTripsSchema), tripController.getAllTrips);

export default router;
