import express from 'express';
import routeController from '../controllers/routeController';
import verifyToken from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/', verifyToken, requireRole('admin'), (req, res, next) =>
    routeController.createRoute(req, res, next)
);

router.get('/', verifyToken, (req, res, next) =>
    routeController.getAllRoutes(req, res, next)
);

router.get('/:routeId', verifyToken, (req, res, next) =>
    routeController.getRoute(req, res, next)
);

router.put('/:routeId', verifyToken, requireRole('admin'), (req, res, next) =>
    routeController.updateRoute(req, res, next)
);

router.delete('/:routeId', verifyToken, requireRole('admin'), (req, res, next) =>
    routeController.deleteRoute(req, res, next)
);

export default router;
