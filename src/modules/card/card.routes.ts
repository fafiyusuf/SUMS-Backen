import express from 'express';
import cardController from './card.controller';
import verifyToken from '@/middleware/authMiddleware';
import requireRole from '@/middleware/roleMiddleware';
import validate from '@/middleware/validate';
import {
  activateCardSchema,
  linkTelebirrSchema,
  listCardsSchema,
  cardIdParamSchema,
  updateCardStatusSchema
} from './card.schema';

const router = express.Router();

router.post('/activate', verifyToken, requireRole('passenger'), validate(activateCardSchema), cardController.activate);

router.get('/my-card', verifyToken, requireRole('passenger'), cardController.myCard);

router.put('/link-telebirr', verifyToken, requireRole('passenger'), validate(linkTelebirrSchema), cardController.linkTelebirr);

router.get('/', verifyToken, requireRole('admin'), validate(listCardsSchema), cardController.list);

router.get('/:cardId', verifyToken, requireRole('admin'), validate(cardIdParamSchema), cardController.getById);

router.put('/:cardId/status', verifyToken, requireRole('admin'), validate(updateCardStatusSchema), cardController.updateStatus);

export default router;
