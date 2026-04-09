// import express from 'express';
// import stopController from '../controllers/stopController';
// import verifyToken from '../middleware/authMiddleware';
// import { requireRole } from '../middleware/roleMiddleware';
// 
// const router = express.Router();
// 
// router.post('/', verifyToken, requireRole('admin'), (req, res, next) =>
//   stopController.createStop(req, res, next)
// );
// 
// router.get('/:id', (req, res, next) =>
//   stopController.getStop(req, res, next)
// );
// 
// router.get('/route/:routeId', (req, res, next) =>
//   stopController.getRouteStops(req, res, next)
// );
// 
// router.put('/:id', verifyToken, requireRole('admin'), (req, res, next) =>
//   stopController.updateStop(req, res, next)
// );
// 
// router.delete('/:id', verifyToken, requireRole('admin'), (req, res, next) =>
//   stopController.deleteStop(req, res, next)
// );
// 
// export default router;
