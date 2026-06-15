import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import settingsController from './settings.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System configuration management
 */

router.get('/', verifyToken, requireRole('admin'), settingsController.getAllSettings);
router.post('/update', verifyToken, requireRole('admin'), settingsController.updateSetting);

export default router;
