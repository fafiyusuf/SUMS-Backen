import express from 'express';
import driverController from './driver.controller';
import verifyToken from '@/middleware/authMiddleware';

const router = express.Router();

router.post('/trip/start', verifyToken, driverController.startTrip);

router.put('/trip/end', verifyToken, driverController.endTrip);

router.get('/trip/current', verifyToken, driverController.getCurrentTrip);

router.get('/route', verifyToken, driverController.getAssignedRoute);

router.get('/trip/history', verifyToken, driverController.getHistory);

export default router;
