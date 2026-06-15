import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import tapController from './tap.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tap
 *   description: NFC Tap In/Out simulation API
 */

router.post('/in', verifyToken, tapController.tapIn);
router.post('/out', verifyToken, tapController.tapOut);
router.get('/validate/:cardId', verifyToken, tapController.validateCard);

export default router;
