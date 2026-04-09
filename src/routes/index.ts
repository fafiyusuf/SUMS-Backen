import express from 'express';
import authRoutes from './authRoutes';
// import busRoutes from './busRoutes';
// import gpsRoutes from './gpsRoutes';
// import incidentRoutes from './incidentRoutes';
// import routeRoutes from './routeRoutes';
// import stopRoutes from './stopRoutes';
// import tripRoutes from './tripRoutes';
// import walletRoutes from './walletRoutes';

const router = express.Router();

//API v1 Routes
router.use('/auth', authRoutes);
// router.use('/wallet', walletRoutes);
// router.use('/trips', tripRoutes);
// router.use('/buses', busRoutes);
// router.use('/routes', routeRoutes);
// router.use('/stops', stopRoutes);
// router.use('/gps', gpsRoutes);
// router.use('/incidents', incidentRoutes);

export default router;
