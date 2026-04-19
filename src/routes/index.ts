import express from 'express';
import authRoutes from './authRoutes';
import cardRoutes from './cardRoutes';
import driverRoutes from './driverRoutes';
import stopRoutes from './stopRoutes';
import telebirrH5Routes from './telebirrH5Routes';
import telebirrRoutes from './telebirrRoutes';
import tripRoutes from './tripRoutes';
import userRoutes from './userRoutes';
import walletRoutes from './walletRoutes';
import busRoutes from './busRoutes';
import routeRoutes from './routeRoutes';

const router = express.Router();

// API v1 Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/telebirr', telebirrRoutes);
router.use('/telebirr-h5', telebirrH5Routes);
router.use('/wallet', walletRoutes);
router.use('/driver', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/stops', stopRoutes);
router.use('/routes', routeRoutes);
router.use('/buses', busRoutes);
// router.use('/stops', stopRoutes);
// router.use('/gps', gpsRoutes);
// router.use('/incidents', incidentRoutes);

export default router;
