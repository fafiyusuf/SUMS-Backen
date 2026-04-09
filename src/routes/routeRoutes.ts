// import express from 'express';
// import routeController from '../controllers/routeController';
// import verifyToken from '../middleware/authMiddleware';
// import { requireRole } from '../middleware/roleMiddleware';
// 
// const router = express.Router();
// 
// router.post('/', verifyToken, requireRole('admin'), (req, res, next) =>
//   routeController.createRoute(req, res, next)
// );
// 
// router.get('/', (req, res, next) =>
//   routeController.getAllRoutes(req, res, next)
// );
// 
// router.get('/:id', (req, res, next) =>
//   routeController.getRoute(req, res, next)
// );
// 
// router.put('/:id', verifyToken, requireRole('admin'), (req, res, next) =>
//   routeController.updateRoute(req, res, next)
// );
// 
// router.delete('/:id', verifyToken, requireRole('admin'), (req, res, next) =>
//   routeController.deleteRoute(req, res, next)
// );
// 
// export default router;
