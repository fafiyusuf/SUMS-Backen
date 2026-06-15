import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import busRoutes from './modules/bus/bus.routes';
import cardRoutes from './modules/card/card.routes';
import driverRoutes from './modules/driver/driver.routes';
import gpsRoutes from './modules/gps/gps.routes';
import incidentRoutes from './modules/incident/incident.routes';
import routeRoutes from './modules/route/route.routes';
import scheduleRoutes from './modules/schedule/schedule.routes';
import settingsRoutes from './modules/settings/settings.routes';
import stopRoutes from './modules/stop/stop.routes';
import tapRoutes from './modules/tap/tap.routes';
import telebirrRoutes from './modules/telebirr/telebirr.routes';
import telebirrH5Routes from './modules/telebirrH5/telebirrH5.routes';
import tripRoutes from './modules/trip/trip.routes';
import userRoutes from './modules/user/user.routes';
import walletRoutes from './modules/wallet/wallet.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/buses', busRoutes);
router.use('/cards', cardRoutes);
router.use('/driver', driverRoutes);
router.use('/gps', gpsRoutes);
router.use('/incidents', incidentRoutes);
router.use('/routes', routeRoutes);
router.use('/stops', stopRoutes);
router.use('/telebirr', telebirrRoutes);
router.use('/telebirr-h5', telebirrH5Routes);
router.use('/trips', tripRoutes);
router.use('/wallet', walletRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/tap', tapRoutes);
router.use('/settings', settingsRoutes);

export default router;
