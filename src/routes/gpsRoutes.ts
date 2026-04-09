// import express from 'express';
// import gpsController from '../controllers/gpsController';
// import verifyToken from '../middleware/authMiddleware';
// import { requireRole } from '../middleware/roleMiddleware';
// 
// const router = express.Router();
// 
// router.post('/record', verifyToken, requireRole('driver'), (req, res, next) =>
//   gpsController.recordGPSData(req, res, next)
// );
// 
// router.get('/latest/:busId', (req, res, next) =>
//   gpsController.getLatestGPSData(req, res, next)
// );
// 
// router.get('/track/:busId', (req, res, next) =>
//   gpsController.getGPSTrack(req, res, next)
// );
// 
// export default router;
