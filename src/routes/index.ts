import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import cardRoutes from './cardRoutes';
import telebirrH5Routes from './telebirrH5Routes';
import walletRoutes from './walletRoutes';
import paymentRoutes from './paymentRoutes';
// import busRoutes from './busRoutes';
// import gpsRoutes from './gpsRoutes';
// import incidentRoutes from './incidentRoutes';
// import routeRoutes from './routeRoutes';
// import stopRoutes from './stopRoutes';
// import tripRoutes from './tripRoutes';

const router = express.Router();

//API v1 Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/telebirr/h5', telebirrH5Routes);
router.use('/wallet', walletRoutes);
router.use('/payment', paymentRoutes);
// router.use('/wallet', walletRoutes);
// router.use('/trips', tripRoutes);
// router.use('/buses', busRoutes);
// router.use('/routes', routeRoutes);
// router.use('/stops', stopRoutes);
// router.use('/gps', gpsRoutes);
// router.use('/incidents', incidentRoutes);

export default router;
