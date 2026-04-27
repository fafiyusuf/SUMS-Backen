import express from 'express';
import authRoutes from './authRoutes';
import cardRoutes from './cardRoutes';
import driverRoutes from './driverRoutes';
import telebirrH5Routes from './telebirrH5Routes';
import tripRoutes from './tripRoutes';
import userRoutes from './userRoutes';
import walletRoutes from './walletRoutes';
import paymentRoutes from './paymentRoutes';
import busRoutes from './busRoutes';
import routeRoutes from './routeRoutes';
import stopRoutes from './stopRoutes';
// import gpsRoutes from './gpsRoutes';
// import incidentRoutes from './incidentRoutes';

const router = express.Router();

// API v1 Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/telebirr/h5', telebirrH5Routes);
router.use('/wallet', walletRoutes);
router.use('/payment', paymentRoutes);
router.use('/driver', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/stops', stopRoutes);
router.use('/routes', routeRoutes);
router.use('/buses', busRoutes);
// router.use('/gps', gpsRoutes);
// router.use('/incidents', incidentRoutes);

export default router;
