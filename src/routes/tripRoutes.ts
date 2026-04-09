// import express from 'express';
// import tripController from '../controllers/tripController';
// import verifyToken from '../middleware/authMiddleware';
// 
// const router = express.Router();
// 
// router.post('/', verifyToken, (req, res, next) =>
//   tripController.createTrip(req, res, next)
// );
// 
// router.get('/:id', verifyToken, (req, res, next) =>
//   tripController.getTrip(req, res, next)
// );
// 
// router.get('/user/:userId', verifyToken, (req, res, next) =>
//   tripController.getUserTrips(req, res, next)
// );
// 
// router.put('/:id/complete', verifyToken, (req, res, next) =>
//   tripController.completeTrip(req, res, next)
// );
// 
// router.put('/:id/cancel', verifyToken, (req, res, next) =>
//   tripController.cancelTrip(req, res, next)
// );
// 
// export default router;
