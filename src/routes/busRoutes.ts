// import express from 'express';
// import busController from '../controllers/busController';
// import verifyToken from '../middleware/authMiddleware';
// import { requireRole } from '../middleware/roleMiddleware';
// 
// const router = express.Router();
// 
// router.post('/', verifyToken, requireRole('admin'), (req, res, next) =>
//   busController.createBus(req, res, next)
// );
// 
// router.get('/', (req, res, next) =>
//   busController.getAllBuses(req, res, next)
// );
// 
// router.get('/:id', (req, res, next) =>
//   busController.getBus(req, res, next)
// );
// 
// router.put('/:id', verifyToken, requireRole('admin', 'driver'), (req, res, next) =>
//   busController.updateBus(req, res, next)
// );
// 
// router.delete('/:id', verifyToken, requireRole('admin'), (req, res, next) =>
//   busController.deleteBus(req, res, next)
// );
// 
// export default router;
